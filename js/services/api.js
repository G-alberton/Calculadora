const API_URL = 'http://localhost:3000';

function authHeaders() {
  const token = localStorage.getItem('token');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export async function calcular(payload) {
  const res = await fetch(`${API_URL}/api/calculations`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao calcular.');
  return data.calculation;
}

export async function buscarHistorico() {
  const res = await fetch(`${API_URL}/api/calculations/history`, { headers: authHeaders() });
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = 'autentication.html';
    return [];
  }
  const data = await res.json();
  return data.history || [];
}

export async function login(body) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro na autenticação.');
  return data;
}

export async function registrar(body) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro no cadastro.');
  return data;
}