import { useEffect, useState } from 'react';
import { api } from '../api';
import { useApp } from '../context';

const KPI = ({ v, label, suffix = '' }) => <div className="kpi"><b>{v === null || v === undefined ? '–' : v + suffix}</b><span>{label}</span></div>;

export default function Admin() {
  const { user, pick } = useApp();
  const isAdmin = user.role === 'admin';
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [certs, setCerts] = useState([]);
  const [msg, setMsg] = useState(''); const [err, setErr] = useState('');

  const load = () => {
    api('/admin/stats').then(setStats).catch(e => setErr(e.message));
    api('/courses').then(setCourses);
    if (isAdmin) { api('/admin/users').then(setUsers); api('/admin/certificates').then(setCerts); }
  };
  useEffect(load, []);

  const post = async (path, body, reset) => {
    setMsg(''); setErr('');
    try { await api(path, { method: 'POST', body }); setMsg('Saved.'); reset && reset(); load(); } catch (e) { setErr(e.message); }
  };

  const [course, setCourse] = useState({ title_en: '', title_so: '', description_en: '', description_so: '' });
  const [lesson, setLesson] = useState({ course_id: '', title_en: '', title_so: '', body_en: '', body_so: '', video_url: '' });
  const [q, setQ] = useState({ course_id: '', text_en: '', o: ['', '', '', ''], correct_index: 0 });

  return (
    <>
      <h1>Manage</h1>
      {msg && <div className="ok">{msg}</div>}{err && <div className="error">{err}</div>}

      <h2>M&amp;E indicators</h2>
      {stats && (
        <div className="kpis">
          <KPI v={stats.registered} label="Learners registered" />
          <KPI v={stats.enrolments} label="Course enrolments" />
          <KPI v={stats.certificates} label="Certificates earned" />
          <KPI v={stats.completion_pct} suffix="%" label="Completion (certificates ÷ enrolments)" />
          <KPI v={stats.skills_gain_points} suffix=" pts" label={`Average pre → post gain (n=${stats.skills_gain_sample})`} />
          <KPI v={stats.female_pct} suffix="%" label="Female learners (of those who stated gender)" />
          <KPI v={stats.youth_pct} suffix="%" label="Learners under 36" />
          <KPI v={stats.disability_count} label="Learners with a disability" />
          <KPI v={stats.usability_pct} suffix="%" label={`Used it without help (n=${stats.feedback_count})`} />
          <KPI v={stats.avg_rating} label="Average rating (1–5)" />
        </div>
      )}

      <h2 style={{ marginTop: 40 }}>Add content</h2>
      <div className="row2">
        <form className="panel" onSubmit={e => { e.preventDefault(); post('/admin/courses', course, () => setCourse({ title_en: '', title_so: '', description_en: '', description_so: '' })); }}>
          <h3>New course</h3>
          <label>Title (English)</label><input type="text" required value={course.title_en} onChange={e => setCourse({ ...course, title_en: e.target.value })} />
          <label>Title (Sesotho)</label><input type="text" value={course.title_so} onChange={e => setCourse({ ...course, title_so: e.target.value })} />
          <label>Description (English)</label><textarea rows={2} required value={course.description_en} onChange={e => setCourse({ ...course, description_en: e.target.value })} />
          <label>Description (Sesotho)</label><textarea rows={2} value={course.description_so} onChange={e => setCourse({ ...course, description_so: e.target.value })} />
          <p><button className="btn" type="submit">Add course</button></p>
        </form>

        <form className="panel" onSubmit={e => { e.preventDefault(); post('/admin/lessons', lesson, () => setLesson({ ...lesson, title_en: '', title_so: '', body_en: '', body_so: '', video_url: '' })); }}>
          <h3>New lesson</h3>
          <label>Course</label>
          <select required value={lesson.course_id} onChange={e => setLesson({ ...lesson, course_id: e.target.value })}>
            <option value="">–</option>{courses.map(c => <option key={c.id} value={c.id}>{pick(c, 'title')}</option>)}
          </select>
          <label>Title (English)</label><input type="text" required value={lesson.title_en} onChange={e => setLesson({ ...lesson, title_en: e.target.value })} />
          <label>Title (Sesotho)</label><input type="text" value={lesson.title_so} onChange={e => setLesson({ ...lesson, title_so: e.target.value })} />
          <label>Lesson text (English). Start list lines with "- "</label><textarea rows={5} required value={lesson.body_en} onChange={e => setLesson({ ...lesson, body_en: e.target.value })} />
          <label>Lesson text (Sesotho)</label><textarea rows={5} value={lesson.body_so} onChange={e => setLesson({ ...lesson, body_so: e.target.value })} />
          <label>Video link (optional)</label><input type="text" value={lesson.video_url} onChange={e => setLesson({ ...lesson, video_url: e.target.value })} />
          <p><button className="btn" type="submit">Add lesson</button></p>
        </form>

        <form className="panel" onSubmit={e => { e.preventDefault(); post('/admin/questions', { course_id: q.course_id, text_en: q.text_en, options_en: q.o, correct_index: q.correct_index }, () => setQ({ ...q, text_en: '', o: ['', '', '', ''] })); }}>
          <h3>New assessment question</h3>
          <label>Course</label>
          <select required value={q.course_id} onChange={e => setQ({ ...q, course_id: e.target.value })}>
            <option value="">–</option>{courses.map(c => <option key={c.id} value={c.id}>{pick(c, 'title')}</option>)}
          </select>
          <label>Question</label><input type="text" required value={q.text_en} onChange={e => setQ({ ...q, text_en: e.target.value })} />
          {q.o.map((o, i) => (
            <label className="check" key={i} style={{ alignItems: 'center' }}>
              <input type="radio" name="correct" checked={q.correct_index === i} onChange={() => setQ({ ...q, correct_index: i })} aria-label={`Option ${i + 1} is correct`} />
              <input type="text" placeholder={`Option ${i + 1}`} value={o} onChange={e => { const n = [...q.o]; n[i] = e.target.value; setQ({ ...q, o: n }); }} />
            </label>
          ))}
          <p className="meta">Select the radio button next to the correct option.</p>
          <p><button className="btn" type="submit">Add question</button></p>
        </form>
      </div>

      {isAdmin && (
        <>
          <h2 style={{ marginTop: 40 }}>Certificates</h2>
          <div className="table-wrap"><table>
            <thead><tr><th>ID</th><th>Learner</th><th>Course</th><th>Status</th><th /></tr></thead>
            <tbody>{certs.map(c => (
              <tr key={c.certificate_no}><td>{c.certificate_no}</td><td>{c.full_name}</td><td>{c.title_en}</td><td>{c.status}</td>
                <td>{c.status === 'valid' && <button className="btn ghost" onClick={() => post(`/admin/certificates/${c.certificate_no}/revoke`)}>Revoke</button>}</td></tr>
            ))}</tbody>
          </table></div>

          <h2 style={{ marginTop: 40 }}>Users</h2>
          <div className="table-wrap"><table>
            <thead><tr><th>Name</th><th>Contact</th><th>Role</th><th>Gender</th><th>Age</th></tr></thead>
            <tbody>{users.map(u => (
              <tr key={u.id}><td>{u.full_name}</td><td>{u.identifier}</td><td>{u.role}</td><td>{u.gender}</td><td>{u.age_group || '–'}</td></tr>
            ))}</tbody>
          </table></div>
        </>
      )}
    </>
  );
}
