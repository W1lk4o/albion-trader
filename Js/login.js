document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const msg = document.getElementById('msg');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Pega o JSON de usuários
        const response = await fetch('Data/users.json');
        const users = await response.json();

        // Verifica se o usuário existe
        const user = users.find(u => u.email === emailInput.value && u.senha === senhaInput.value);

        if (user) {
            // Login correto
            msg.style.color = 'green';
            msg.textContent = 'Login efetuado com sucesso!';

            // Redirecionar para dashboard/admin
            if(user.admin){
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        } else {
            // Login incorreto
            msg.style.color = 'red';
            msg.textContent = 'E-mail ou senha incorretos!';
        }
    });
});
