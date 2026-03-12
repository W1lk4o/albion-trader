document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const msg = document.getElementById('msg');

    loginBtn.addEventListener('click', () => {
        const user = users.find(u => u.email === emailInput.value && u.senha === senhaInput.value);

        if (user) {
            msg.style.color = 'green';
            msg.textContent = 'Login efetuado com sucesso!';

            if (user.admin) {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        } else {
            msg.style.color = 'red';
            msg.textContent = 'E-mail ou senha incorretos!';
        }
    });
});
