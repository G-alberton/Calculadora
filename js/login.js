const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const mainBtn = document.getElementById('main-btn');
    const authForm = document.getElementById('auth-form');

    let currentMode = 'login'; // login ou registrar

    // Alternar para Login
    tabLogin.addEventListener('click', () => {
        currentMode = 'login';
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        mainBtn.innerText = 'Entrar';

        const nameGroup = document.getElementById('name-group');
        if (nameGroup) nameGroup.remove();
    });

    // Alternar para Cadastro
    tabRegister.addEventListener('click', () => {
        currentMode = 'register';
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        mainBtn.innerText = 'Cadastrar';

        if (!document.getElementById('name-group')) {
            const nameGroup = document.createElement('div');
            nameGroup.classList = 'input-group';
            nameGroup.id = 'name-group';
            nameGroup.innerHTML = `
                <label for="name">Nome</label>
                <input type="text" id="name" placeholder="Seu nome completo" required>
            `;
        }
        authForm.insertBefore(nameGroup, authForm.firstChild);
    });

    // Envio do formulário para o Back-end
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        mainBtn.disabled = true;
        mainBtn.innerText = currentMode === 'login' ? 'Entrando...' : 'Cadastrando...';

        try {
            if (currentMode === 'login') {
                await fazerLogin(email, password);
            } else {
                const name = document.getElementById('name').value;
                await fazerCadastro(name, email, password);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            mainBtn.disabled = false;
            mainBtn.innerText = currentMode === 'login' ? 'Entrar' : 'Cadastrar';
        }
    });
});

async function fazerLogin (email, password) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    window.location.href = 'index.html';
}

async function fazerCadastro(name, email, password) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, email, password})
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar');
    }

    alert('Cadastro realizado! Faça login para continuar');
    document.getElementById('tab-login').click();
}