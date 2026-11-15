const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function api(path, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : options.body
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof data === 'object' && data !== null
      ? data.error || data.message
      : data;

    throw new Error(message || `Request failed (${response.status})`);
  }

  return data;
}

export async function downloadPdf(certificateNo) {
  const token = localStorage.getItem('token');

  const response = await fetch(
    `${API_BASE}/certificates/${encodeURIComponent(certificateNo)}/pdf`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }
  );

  if (!response.ok) {
    let message = 'Could not download certificate.';
    try {
      const data = await response.json();
      message = data.error || message;
    } catch {
      // Keep the default error message.
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `${certificateNo}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}
