const apiUrl = 'https://d3bc0c71-a21a-467c-b5cc-9c4323769087-00-u725a4dkcvpy.worf.replit.dev/cadastro'; // URL da API JSONServer para usuários

// Função para exibir mensagens na interface com estilo visível
function displayMessage(message, type = 'success') {
    const messageElement = document.getElementById('errorModalBody');

    // Define a classe CSS com base no tipo de mensagem (success ou danger)
    const alertType = type === 'success' ? 'alert-success' : 'alert-danger';

    // Cria o elemento de mensagem com o estilo definido
    const alertMessage = `<div class="alert ${alertType} error-box">${message}</div>`;

    // Define o conteúdo HTML do elemento de mensagem
    messageElement.innerHTML = alertMessage;

    // Exibe o modal de erro
    const modal = new bootstrap.Modal(document.getElementById('errorModal'));
    modal.show();
}

// Função para verificar se o email já está em uso
function checkEmailAvailability(email) {
    return fetch(`${apiUrl}?email=${email}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao verificar email');
            }
            return response.json();
        })
        .then(data => {
            return data.length === 0; // Retorna verdadeiro se não houver nenhum usuário com o mesmo email
        })
        .catch(error => {
            console.error('Erro ao verificar email via API JSONServer:', error);
            return false; // Retorna falso em caso de erro
        });
}

// Função para adicionar um novo usuário
function addUser(nome, login, senha, email, papel) {
    const usuario = {
        nome: nome,
        login: login,
        senha: senha,
        email: email,
        papel: papel
    };

    // Envia os dados do novo usuário para a API JSONServer via POST
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar usuário');
        }
        return response.json();
    })
    .then(data => {
        // Armazena os dados do usuário no Local Storage
        localStorage.setItem('usuario', JSON.stringify(usuario));

        displayMessage("Usuário cadastrado com sucesso");
        window.location.href = '../login/login.html'; // Redireciona para a página de login após o cadastro
    })
    .catch(error => {
        console.error('Erro ao cadastrar usuário via API JSONServer:', error);
        displayMessage(error.message, 'danger');
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
    const papel = document.getElementById('papel').value;

    if (email !== confirmarEmail) {
        displayMessage("Os campos de email não coincidem.", 'danger');
        return;
    }

    // Chama a função para adicionar o usuário com os dados fornecidos
    addUser(nome, login, senha, email, papel);
}

// Adiciona um ouvinte de eventos para o formulário de cadastro
document.getElementById('registerForm').addEventListener('submit', handleRegister);
