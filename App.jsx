import { Routes, Route, Link, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from './context';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Lesson from './pages/Lesson';
import Quiz from './pages/Quiz';
import { Login, Register } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Certificates from './pages/Certificates';
import Verify from './pages/Verify';
import Admin from './pages/Admin';

function Private({ children, roles }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const { user, t, lang, setLang, logout } = useApp();
  const nav = useNavigate();
  return (
    <>
      <div className="band" aria-hidden="true" />
      <header className="top">
        <Link to="/" className="brand">Lesotho Digital Skills Academy</Link>
        <nav>
          <NavLink to="/courses">{t('courses')}</NavLink>
          {user && <NavLink to="/dashboard">{t('dashboard')}</NavLink>}
          {user && <NavLink to="/certificates">{t('certificates')}</NavLink>}
          <NavLink to="/verify">{t('verify')}</NavLink>
          {user && ['admin', 'instructor'].includes(user.role) && <NavLink to="/admin">{t('admin')}</NavLink>}
        </nav>
        <div className="actions">
          <div className="lang" role="group" aria-label={t('language')}>
            <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
            <button className={lang === 'so' ? 'on' : ''} onClick={() => setLang('so')}>SO</button>
          </div>
          {user
            ? <button className="btn ghost" onClick={() => { logout(); nav('/'); }}>{t('logout')}</button>
            : <><Link className="btn ghost" to="/login">{t('login')}</Link><Link className="btn" to="/register">{t('register')}</Link></>}
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/lessons/:id" element={<Private><Lesson /></Private>} />
          <Route path="/courses/:id/quiz/:kind" element={<Private><Quiz /></Private>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
          <Route path="/certificates" element={<Private><Certificates /></Private>} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/verify/:no" element={<Verify />} />
          <Route path="/admin" element={<Private roles={['admin', 'instructor']}><Admin /></Private>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer><div className="band" aria-hidden="true" /><p>{t('disclaimer')}</p></footer>
    </>
  );
}
