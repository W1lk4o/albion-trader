
function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const msg = document.getElementById("msg");
    
    if(!email.endsWith("@gmail.com")) {
        msg.innerText = "Use um email @gmail.com";
        return;
    }
    if(senha.length < 4) {
        msg.innerText = "Senha muito curta";
        return;
    }
    
    // Simula login
    localStorage.setItem("usuario", email);
    window.location.href = "dashboard.html";
}

function abrir(pagina) {
    window.location.href = pagina;
}

document.addEventListener("DOMContentLoaded", () => {
    const lucros = document.getElementById("lucros");
    if(lucros) {
        fetch("data/items.json")
        .then(res => res.json())
        .then(data => {
            data.slice(0,5).forEach(item => {
                const li = document.createElement("li");
                li.innerText = `${item.nome_pt} - Lucro: ${item.lucro_est}% - Cidade: ${item.cidade}`;
                lucros.appendChild(li);
            });
        });
    }
});
