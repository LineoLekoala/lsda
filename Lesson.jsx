import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useApp } from '../context';

// Tiny renderer: paragraphs and "- " bullet lists (React escapes everything)
function Body({ text }) {
  return text.split(/\n\n+/).map((block, i) => {
    const lines = block.split('\n');
    if (lines.every(l => l.startsWith('- ')))
      return <ul key={i}>{lines.map((l, j) => <li key={j}>{l.slice(2)}</li>)}</ul>;
    return <p key={i}>{block}</p>;
  });
}

// YouTube links play in an embedded player; anything else (like /uploads/123.mp4) plays as a normal video
function VideoPlayer({ url }) {
  const yt = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  if (yt)
    return (
      <div className="video">
        <iframe src={`https://www.google.com/search?q=%E2%86%90+Back+to+course%0D%0A%0D%0AFinding+your+way+around+your+phone%0D%0AYour+phone+has+a+home+screen%2C+a+settings+app+and+a+place+where+apps+are+kept.%0D%0A%0D%0ATap+the+gear+icon+to+open+Settings.%0D%0AIn+Settings+you+can+change+the+language%2C+the+screen+brightness+and+the+volume.%0D%0ATurn+on+Wi-Fi+only+when+you+are+near+a+network+you+trust.%0D%0ATip%3A+if+your+battery+is+low%2C+turn+on+Battery+Saver+in+Settings.%0D%0A%0D%0AI+finished+this+lesson%0D%0ACertificates+are+issued+by+the+Academy+as+proof+of+completion.+They+are+not+accredited+qualifications.&sca_esv=803fbec6cdeb4045&rlz=1C1GEWG_enLS1181LS1181&amc=1&aep=42&udm=vids&sxsrf=AKL5yDhCcECuhXdsCdkWSIAKUfZ_Bab25g%3A1794600486487&ei=Jm73av6hHZCL_fwPwYrWqQQ&biw=1242&bih=583&ved=2ahUKEwj-zIrk34WYAxWQRZ8JHUGFNUUQ4dUDegQIBRAM&uact=5&oq=%E2%86%90+Back+to+course%0D%0A%0D%0AFinding+your+way+around+your+phone%0D%0AYour+phone+has+a+home+screen%2C+a+settings+app+and+a+place+where+apps+are+kept.%0D%0A%0D%0ATap+the+gear+icon+to+open+Settings.%0D%0AIn+Settings+you+can+change+the+language%2C+the+screen+brightness+and+the+volume.%0D%0ATurn+on+Wi-Fi+only+when+you+are+near+a+network+you+trust.%0D%0ATip%3A+if+your+battery+is+low%2C+turn+on+Battery+Saver+in+Settings.%0D%0A%0D%0AI+finished+this+lesson%0D%0ACertificates+are+issued+by+the+Academy+as+proof+of+completion.+They+are+not+accredited+qualifications.&gs_lp=EhZnd3Mtd2l6LW1vZGVsZXNzLXZpZGVvIvED4oaQIEJhY2sgdG8gY291cnNlCgpGaW5kaW5nIHlvdXIgd2F5IGFyb3VuZCB5b3VyIHBob25lCllvdXIgcGhvbmUgaGFzIGEgaG9tZSBzY3JlZW4sIGEgc2V0dGluZ3MgYXBwIGFuZCBhIHBsYWNlIHdoZXJlIGFwcHMgYXJlIGtlcHQuCgpUYXAgdGhlIGdlYXIgaWNvbiB0byBvcGVuIFNldHRpbmdzLgpJbiBTZXR0aW5ncyB5b3UgY2FuIGNoYW5nZSB0aGUgbGFuZ3VhZ2UsIHRoZSBzY3JlZW4gYnJpZ2h0bmVzcyBhbmQgdGhlIHZvbHVtZS4KVHVybiBvbiBXaS1GaSBvbmx5IHdoZW4geW91IGFyZSBuZWFyIGEgbmV0d29yayB5b3UgdHJ1c3QuClRpcDogaWYgeW91ciBiYXR0ZXJ5IGlzIGxvdywgdHVybiBvbiBCYXR0ZXJ5IFNhdmVyIGluIFNldHRpbmdzLgoKSSBmaW5pc2hlZCB0aGlzIGxlc3NvbgpDZXJ0aWZpY2F0ZXMgYXJlIGlzc3VlZCBieSB0aGUgQWNhZGVteSBhcyBwcm9vZiBvZiBjb21wbGV0aW9uLiBUaGV5IGFyZSBub3QgYWNjcmVkaXRlZCBxdWFsaWZpY2F0aW9ucy4yBxAjGOoCGCcyBxAjGOoCGCcyBxAjGOoCGCcyBxAjGOoCGCcyBxAjGOoCGCdIgiJQtQZYkRpwAngAkAEEmAHZAqAB6gyqAQMzLTW4AQPIAQD4AQH4AQKYAgOgAq0DqAIFwgIHECMYsAIYJ8ICCBAAGIAEGKIEwgIFEAAY7wWYAwriAwUSATEgQIgGAZIHBTIuMy0xoAfEHLIHAzMtMbgHwQLCBwkyLTEuMS4wLjHIB2WACAE&sclient=gws-wiz-modeless-video#fpstate=ive&vld=cid:0d5d2513,vid:I3uA-8E7lYA,st:0{yt[1]}`} title="Lesson video" allowFullScreen loading="lazy" />
      </div>
    );
  return <video className="video" controls preload="none" src={url} />;
}

export default function Lesson() {
  const { id } = useParams();
  const { t, pick, hasSo, lang } = useApp();
  const nav = useNavigate();
  const [l, setL] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { setL(null); api('/lessons/' + id).then(setL).catch(e => setErr(e.message)); window.scrollTo(0, 0); }, [id]);

  if (err) return <div className="error">{err}</div>;
  if (!l) return <p>{t('loading')}</p>;

  const finish = async () => {
    await api(`/lessons/${id}/complete`, { method: 'POST' });
    nav(l.next_id ? `/lessons/${l.next_id}` : `/courses/${l.course_id}`);
  };

  return (
    <>
      <p><Link to={`/courses/${l.course_id}`}>← {t('backToCourse')}</Link></p>
      <h1>{pick(l, 'title')}</h1>
      {lang === 'so' && !hasSo(l, 'body') && <p className="note">{t('notTranslated')}</p>}
      <div className="lesson-body"><Body text={pick(l, 'body')} /></div>
      {l.video_url && <VideoPlayer url={l.video_url} />}
      <div className="nav-row">
        {l.prev_id && <Link className="btn ghost" to={`/lessons/${l.prev_id}`}>{t('prev')}</Link>}
        <button className="btn maize" onClick={finish}>{l.completed ? t('next') : t('completeLesson')}</button>
      </div>
    </>
  );
}