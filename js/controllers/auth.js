//falta arrumar o auth.js para que o cookie funcione sem estar no localstorage

import { login, registrar } from '../services/api.js';

const inputName     = document.querySelector('#name');
const inputEmail    = document.querySelector('#email');
const inputPassword = document.querySelector('#password');
const btnEntrar     = document.querySelector('#btn-login');
const btnCadastrar  = document.querySelector('#btn-register');

let modo = 'login';

btnEntrar?.addEventListener('click', () => {
  modo = 'login';
  if (inputName) inputName.style.display = 'none';
});

btnCadastrar?.addEventListener('click', () => {
  modo = 'register';
  if (inputName) inputName.style.display = 'block';
});

document.querySelector('form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email    = inputEmail.value.trim();
  const password = inputPassword.value.trim();
  const name     = inputName?.value.trim();

  try {
    if (modo === 'register') {
      await registrar({ name, email, password });
      alert('Cadastro realizado! Agora faça login.');
      modo = 'login';
      if (inputName) inputName.style.display = 'none';
      return;
    }

    const data = await login({ email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = 'index.html';
  } catch (err) {
    alert(err.message);
  }
});