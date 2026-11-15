import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useApp } from '../context';

export function Login() {
  const { t, login } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState({ identifier: '', password: '' });
  const [err, setErr] = useState('');
  const submit = async e => {
    e.preventDefault(); setErr('');
    try { const r = await api('/auth/login', { method: 'POST', body: f }); login(r.token, r.user); nav('/dashboard'); }
    catch (ex) { setErr(ex.message); }
  };
  return (
    <form className="panel" onSubmit={submit}>
      <h1>{t('login')}</h1>
      <label htmlFor="id">{t('identifier')}</label>
      <input id="id" type="text" autoComplete="username" required value={f.identifier} onChange={e => setF({ ...f, identifier: e.target.value })} />
      <label htmlFor="pw">{t('password')}</label>
      <input id="pw" type="password" autoComplete="current-password" required value={f.password} onChange={e => setF({ ...f, password: e.target.value })} />
      {err && <div className="error">{err}</div>}
      <p><button className="btn" type="submit">{t('login')}</button></p>
      <p><Link to="/register">{t('register')}</Link></p>
    </form>
  );
}

export function Register() {
  const { t, login, lang } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState({ full_name: '', identifier: '', password: '', gender: 'undisclosed', age_group: '18-35', has_disability: 'undisclosed', consent: false, guardian_consent: false });
  const [err, setErr] = useState('');
  const set = k => e => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const submit = async e => {
    e.preventDefault(); setErr('');
    try { const r = await api('/auth/register', { method: 'POST', body: { ...f, language: lang } }); login(r.token, r.user); nav('/courses'); }
    catch (ex) { setErr(ex.message); }
  };
  return (
    <form className="panel" onSubmit={submit}>
      <h1>{t('register')}</h1>
      <label htmlFor="n">{t('fullName')}</label>
      <input id="n" type="text" required value={f.full_name} onChange={set('full_name')} />
      <label htmlFor="i">{t('identifier')}</label>
      <input id="i" type="text" required autoComplete="username" value={f.identifier} onChange={set('identifier')} />
      <label htmlFor="p">{t('password')}</label>
      <input id="p" type="password" required minLength={6} autoComplete="new-password" value={f.password} onChange={set('password')} />
      <label htmlFor="g">{t('gender')}</label>
      <select id="g" value={f.gender} onChange={set('gender')}>
        {['female', 'male', 'other', 'undisclosed'].map(v => <option key={v} value={v}>{t(v)}</option>)}
      </select>
      <label htmlFor="a">{t('ageGroup')}</label>
      <select id="a" value={f.age_group} onChange={set('age_group')}>
        <option value="under18">Under 18</option><option value="18-35">18–35</option><option value="36-60">36–60</option><option value="over60">60+</option>
      </select>
      <label htmlFor="d">{t('disability')}</label>
      <select id="d" value={f.has_disability} onChange={set('has_disability')}>
        {['no', 'yes', 'undisclosed'].map(v => <option key={v} value={v}>{t(v)}</option>)}
      </select>
      {f.age_group === 'under18' && (
        <label className="check"><input type="checkbox" checked={f.guardian_consent} onChange={set('guardian_consent')} />{t('guardianText')}</label>
      )}
      <label className="check"><input type="checkbox" checked={f.consent} onChange={set('consent')} />{t('consentText')}</label>
      {err && <div className="error">{err}</div>}
      <p><button className="btn maize" type="submit">{t('register')}</button></p>
    </form>
  );
}
