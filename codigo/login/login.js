const LOGIN_URL = "login.html";
const HOME_URL = "home.html";
const apiUrl = 'https://jsonserver.rommelpuc.repl.co/usuarios';

var db_usuarios = {};
var usuarioCorrente = {};

function generateUUID() {
    var d = new Date().getTime();
    var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

const dadosIniciais = {
    usuarios: [
        { "id": generateUUID(), "login": "admin", "senha": "123", "nome": "Administrador do Sistema", "email": "admin@abc.com" },
        { "id": generateUUID(), "login": "user", "senha": "123", "nome": "Usuario Comum", "email": "user@abc.com" },
    ]
};

function initLoginApp() {
    let usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (usuarioCorrenteJSON) {
        usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            db_usuarios = data;
        })
        .catch(error => {
            console.error('Erro ao ler usuários via API JSONServer:', error);
            displayMessage("Erro ao ler usuários");
        });
};

function loginUser(login, senha) {
    for (var i = 0; i < db_usuarios.length; i++) {
        var usuario = db_usuarios[i];
        if (login == usuario.login && senha == usuario.senha) {
            // Verifica se o email está registrado no localStorage
            var emailRegistrado = localStorage.getItem('emailRegistrado');
            if (emailRegistrado && emailRegistrado === usuario.email) {
                usuarioCorrente.id = usuario.id;
                usuarioCorrente.login = usuario.login;
                usuarioCorrente.email = usuario.email;
                usuarioCorrente.nome = usuario.nome;
                sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
                window.location = HOME_URL;
                return true;
            } else {
                displayMessage("Email não registrado neste dispositivo.");
                return false;
            }
        }
    }
    displayMessage("Usuário ou senha incorretos.");
    return false;
}


function logoutUser() {
    usuarioCorrente = {};
    sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
    window.location = LOGIN_URL;
}

function addUser(nome, login, senha, email) {
    let newId = generateUUID();
    let usuario = { "id": newId, "login": login, "senha": senha, "nome": nome, "email": email };
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
    })
    .then(response => response.json())
    .then(data => {
        db_usuarios.push(usuario);
        displayMessage("Usuário inserido com sucesso");
    })
    .catch(error => {
        console.error('Erro ao inserir usuário via API JSONServer:', error);
        displayMessage("Erro ao inserir usuário");
    });
}

function handleLogin(event) {
    event.preventDefault();
    const login = document.getElementById('login').value;
    const senha = document.getElementById('senha').value;
    if (loginUser(login, senha)) {
        localStorage.setItem('emailRegistrado', usuarioCorrente.email);
        displayMessage("Login realizado com sucesso!");
    }
}


function handleRegister(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const login = document.getElementById('login').value;
    const senha = document.getElementById('senha').value;
    const email = document.getElementById('email').value;

    // Verificar se o login já existe
    const usuarioExistente = db_usuarios.find(u => u.login === login);
    if (usuarioExistente) {
        displayMessage("Login já cadastrado. Por favor, escolha outro login.");
        return;
    }

    addUser(nome, login, senha, email);
}

function displayMessage(message) {
    alert(message);
}
