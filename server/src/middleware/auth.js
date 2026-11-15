const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'change-me';

const sign = u => jwt.sign({ id: u.id, role: u.role }, SECRET, { expiresIn: '7d' });

function read(req) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return null;
  try { return jwt.verify(token, SECRET); } catch { return null; }
}

const optional = (req, res, next) => { req.user = read(req); next(); };
const required = (req, res, next) => {
  const u = read(req);
  if (!u) return res.status(401).json({ error: 'Please log in to continue.' });
  req.user = u; next();
};
const allow = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ error: 'You do not have access to this.' });

module.exports = { sign, optional, required, allow };
