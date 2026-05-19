const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const btnEntrar = document.querySelector('#btn-login');
  const btnCadastrar = document.querySelector('#btn-register');

  const inputName = document.querySelector('#name');
  const inputEmail = document.querySelector('#email');
  const inputPassword = document.querySelector('#password');

  let modo = 'login';

  if (btnEntrar) {
    btnEntrar.addEventListener('click', () => {
      modo = 'login';
      if (inputName) inputName.style.display = 'none';
    });
  }

  if (btnCadastrar) {
    btnCadastrar.addEventListener('click', () => {
      modo = 'register';
      if (inputName) inputName.style.display = 'block';
    });
  }

  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();
    const name = inputName ? inputName.value.trim() : '';

    const url =
      modo === 'login'
        ? `${API_URL}/api/auth/login`
        : `${API_URL}/api/auth/register`;

    const body =
      modo === 'login'
        ? { email, password }
        : { name, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Erro na autenticação');
        return;
      }

      if (modo === 'register') {
        alert('Cadastro realizado com sucesso. Agora faça login.');
        modo = 'login';
        if (inputName) inputName.style.display = 'none';
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      window.location.href = 'index.html';
    } catch (error) {
      console.error(error);
      alert('Erro ao conectar com o servidor.');
    }
  });
});