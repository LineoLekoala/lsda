export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api' + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed. Please try again.');
  return data;
}

export async function downloadPdf(certNo) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/certificates/${certNo}/pdf`, { headers: { Authorization: 'Bearer ' + token } });
  if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Could not download the certificate.'); }
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement('a');
  a.href = url; a.download = certNo + '.pdf'; a.click();
  URL.revokeObjectURL(url);
}
