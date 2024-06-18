const apiUrl = 'https://d3bc0c71-a21a-467c-b5cc-9c4323769087-00-u725a4dkcvpy.worf.replit.dev/cadastro'; // URL da API JSONServer para usuários

// Função para exibir mensagens na interface
function displayMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.innerHTML = `<div class="alert alert-success">${message}</div>`;
}

// Função para verificar se o nome de usuário já está em uso
function checkUsernameAvailability(login) {
    return fetch(`${apiUrl}?login=${login}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao verificar nome de usuário');
            }
            return response.json();
        })
        .then(data => {
            return data.length === 0; // Retorna verdadeiro se não houver nenhum usuário com o mesmo nome de usuário
        })
        .catch(error => {
            console.error('Erro ao verificar nome de usuário via API JSONServer:', error);
            return false; // Retorna falso em caso de erro
        });
}

// Função para adicionar um novo usuário
function addUser(nome, login, senha, email) {
    // Verifica a disponibilidade do nome de usuário antes de prosseguir
    checkUsernameAvailability(login)
        .then(isAvailable => {
            if (!isAvailable) {
                throw new Error('Nome de usuário já está em uso');
            }

            const usuario = {
                nome: nome,
                login: login,
                senha: senha,
                email: email
            };

            // Envia os dados do novo usuário para a API JSONServer via POST
            return fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario),
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao cadastrar usuário');
            }
            return response.json();
        })
        .then(data => {
            displayMessage("Usuário cadastrado com sucesso");
            window.location.href = 'login.html'; // Redireciona para a página de login após o cadastro
        })
        .catch(error => {
            console.error('Erro ao cadastrar usuário via API JSONServer:', error);
            displayMessage("Erro ao cadastrar usuário");
        });
}

// Função para lidar com o evento de submissão do formulário de cadastro
function handleRegister(event) {
    event.preventDefault(); // Evita o comportamento padrão de submissão do formulário

    const nome = document.getElementById('nome').value;
    const login = document.getElementById('login').value;
    const email = document.getElementById('email').value;
    const confirmarEmail = document.getElementById('confirmar-email').value;
    const senha = document.getElementById('senha').value;

    if (email !== confirmarEmail) {
        displayMessage("Os campos de email não coincidem.");
        return;
    }

    // Chama a função para adicionar o usuário com os dados fornecidos
    addUser(nome, login, senha, email);
}

// Adiciona um ouvinte de eventos para o formulário de cadastro
document.getElementById('registerForm').addEventListener('submit', handleRegister);
