document.addEventListener('DOMContentLoaded', function () {
    const LOGIN_URL = "login.html";
    const apiUrl = 'https://d3bc0c71-a21a-467c-b5cc-9c4323769087-00-u725a4dkcvpy.worf.replit.dev/usuarios';

    var db_usuarios = [];

    // Função para inicializar a aplicação de login
    function initLoginApp() {
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

    // Função para validar o login
    function loginUser(email, senha) {
        // Recupera os dados do usuário do Local Storage
        const usuarioSalvo = JSON.parse(localStorage.getItem('usuario'));
    
        if (usuarioSalvo && usuarioSalvo.email === email && usuarioSalvo.senha === senha) {
            // Login bem-sucedido
            displayMessage("Login realizado com sucesso!");
    
            // Redireciona para a página do calendário
            window.location.href = 'http://127.0.0.1:5501/codigo/calendario/public/index.html';
        } else {
            // Email ou senha incorretos
            displayMessage("Email ou senha incorretos.", 'danger');
        }
    }
    

    // Função para lidar com o evento de login
    function handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        if (loginUser(email, senha)) {
            displayMessage("Login realizado com sucesso!");
        }
    }

    // Função para exibir mensagens na interface
    function displayMessage(message) {
        alert(message);
    }

    // Adiciona um ouvinte de eventos para o formulário de login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Inicializa a aplicação de login ao carregar o DOM
    initLoginApp();
});
