const router = require('express').Router();
const db = require('../db');
const wrap = require('../util');
const { required, allow } = require('../middleware/auth');

router.use(required);

// KPI numbers for the M&E report
router.get('/stats', allow('admin', 'instructor'), wrap(async (req, res) => {
  const [[u]] = await db.query(
    `SELECT COUNT(*) n, SUM(gender='female') female, SUM(gender<>'undisclosed') gender_known,
            SUM(age_group IN ('under18','18-35')) youth, SUM(has_disability='yes') disability
     FROM users WHERE role='learner'`);
  const [[e]] = await db.query('SELECT COUNT(*) n FROM enrollments');
  const [[c]] = await db.query("SELECT COUNT(*) n FROM certificates WHERE status='valid'");
  const [[fb]] = await db.query('SELECT COUNT(*) n, AVG(usability_ok)*100 usability, AVG(rating) rating FROM feedback');
  const [attempts] = await db.query('SELECT id, user_id, course_id, kind, score FROM quiz_attempts ORDER BY id');

  const first = {}, best = {};
  attempts.forEach(a => {
    const k = a.user_id + '-' + a.course_id;
    if (a.kind === 'pre' && !(k in first)) first[k] = a.score;
    if (a.kind === 'post') best[k] = Math.max(best[k] ?? 0, a.score);
  });
  const pairs = Object.keys(first).filter(k => k in best);
  const improvement = pairs.length ? pairs.reduce((s, k) => s + (best[k] - first[k]), 0) / pairs.length : null;
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : null);

  res.json({
    registered: u.n,
    enrolments: e.n,
    certificates: c.n,
    female_pct: pct(Number(u.female), Number(u.gender_known)),
    youth_pct: pct(Number(u.youth), u.n),
    disability_count: Number(u.disability) || 0,
    completion_pct: pct(c.n, e.n),
    usability_pct: fb.usability === null ? null : Math.round(fb.usability),
    avg_rating: fb.rating === null ? null : Number(Number(fb.rating).toFixed(1)),
    feedback_count: fb.n,
    skills_gain_points: improvement === null ? null : Math.round(improvement),
    skills_gain_sample: pairs.length
  });
}));

router.get('/users', allow('admin'), wrap(async (req, res) => {
  const [rows] = await db.query(
    'SELECT id, full_name, identifier, role, gender, age_group, created_at FROM users ORDER BY id DESC LIMIT 500');
  res.json(rows);
}));

router.get('/certificates', allow('admin'), wrap(async (req, res) => {
  const [rows] = await db.query(
    `SELECT x.certificate_no, x.status, x.issued_at, u.full_name, c.title_en
     FROM certificates x JOIN users u ON u.id=x.user_id JOIN courses c ON c.id=x.course_id ORDER BY x.id DESC LIMIT 500`);
  res.json(rows);
}));

router.post('/certificates/:no/revoke', allow('admin'), wrap(async (req, res) => {
  await db.query("UPDATE certificates SET status='revoked' WHERE certificate_no=?", [req.params.no]);
  res.json({ ok: true });
}));

router.patch('/users/:id/role', allow('admin'), wrap(async (req, res) => {
  if (!['learner', 'instructor', 'admin'].includes(req.body.role)) return res.status(400).json({ error: 'Invalid role.' });
  await db.query('UPDATE users SET role=? WHERE id=?', [req.body.role, req.params.id]);
  res.json({ ok: true });
}));

// ---- Content management (instructors and admins) ----
router.post('/courses', allow('admin', 'instructor'), wrap(async (req, res) => {
  const b = req.body;
  if (!b.title_en || !b.description_en) return res.status(400).json({ error: 'English title and description are required.' });
  const [[m]] = await db.query('SELECT COALESCE(MAX(module_no),0)+1 n FROM courses');
  const [ins] = await db.query(
    'INSERT INTO courses (module_no, title_en, title_so, description_en, description_so) VALUES (?,?,?,?,?)',
    [b.module_no || m.n, b.title_en, b.title_so || null, b.description_en, b.description_so || null]);
  await db.query('INSERT INTO quizzes (course_id, pass_mark) VALUES (?,70)', [ins.insertId]);
  res.json({ id: ins.insertId });
}));

router.post('/lessons', allow('admin', 'instructor'), wrap(async (req, res) => {
  const b = req.body;
  if (!b.course_id || !b.title_en || !b.body_en) return res.status(400).json({ error: 'Course, English title and lesson text are required.' });
  const [[p]] = await db.query('SELECT COALESCE(MAX(position),0)+1 n FROM lessons WHERE course_id=?', [b.course_id]);
  const [ins] = await db.query(
    'INSERT INTO lessons (course_id, position, title_en, title_so, body_en, body_so, video_url) VALUES (?,?,?,?,?,?,?)',
    [b.course_id, p.n, b.title_en, b.title_so || null, b.body_en, b.body_so || null, b.video_url || null]);
  res.json({ id: ins.insertId });
}));

router.post('/questions', allow('admin', 'instructor'), wrap(async (req, res) => {
  const b = req.body;
  const opts = (b.options_en || []).map(s => String(s).trim()).filter(Boolean);
  if (!b.course_id || !b.text_en || opts.length < 2) return res.status(400).json({ error: 'A course, a question and at least two options are required.' });
  const idx = Number(b.correct_index);
  if (!(idx >= 0 && idx < opts.length)) return res.status(400).json({ error: 'Choose which option is correct.' });
  const [[quiz]] = await db.query('SELECT id FROM quizzes WHERE course_id=?', [b.course_id]);
  if (!quiz) return res.status(404).json({ error: 'Course not found.' });
  await db.query('INSERT INTO questions (quiz_id, text_en, options_en, correct_index) VALUES (?,?,?,?)',
    [quiz.id, b.text_en, JSON.stringify(opts), idx]);
  res.json({ ok: true });
}));

module.exports = router;
