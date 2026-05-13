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
    });

    // Alternar para Cadastro
    tabRegister.addEventListener('click', () => {
        currentMode = 'register';
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        mainBtn.innerText = 'Cadastrar';
    });

    // Envio do formulário para o Back-end
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const authData = {
            email: email,
            password: password,
            type: currentMode // pra saber o tipo, se ta logando ou se ta cadastrando
        };

        console.log(`Enviando dados de ${currentMode}:`, authData);

        //aqui conecta com o back api e tals, igual o outro lá
        //fazer um negocio para ele confirmar no e-mail
        
        alert(`Dados capturados! Verifique o console (F12). Modo: ${currentMode}`);
    });
});