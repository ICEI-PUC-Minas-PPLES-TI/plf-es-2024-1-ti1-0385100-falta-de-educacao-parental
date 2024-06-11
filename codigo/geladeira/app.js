
// Trabalho Interdisciplinar 1 - Aplicações Web
//
// Esse módulo realiza as operações de CRUD a partir de uma API baseada no JSONServer
// O servidor JSONServer fica hospedado na seguinte URL
// https://jsonserver.rommelpuc.repl.co/contatos
//
// Para fazer o seu servidor, acesse o projeto do JSONServer no Replit, faça o 
// fork do projeto e altere o arquivo db.json para incluir os dados do seu projeto.
// URL Projeto JSONServer: https://replit.com/@rommelpuc/JSONServer
//
// Autor: Rommel Vieira Carneiro
// Data: 03/10/2023
https://2e97d184-4bbf-4bc8-87d7-cc9370e219fc-00-3j71kr47th255.worf.replit.dev/
// URL da API JSONServer - Substitua pela URL correta da sua API
const apiUrl = 'https://2e97d184-4bbf-4bc8-87d7-cc9370e219fc-00-3j71kr47th255.worf.replit.dev/Lembretes';
//const apiUrl = 'https://2e97d184-4bbf-4bc8-87d7-cc9370e219fc-00-3j71kr47th255.worf.replit.dev/'; 

function displayMessage(mensagem) {
    msg = document.getElementById('msg');
    msg.innerHTML = '<div class="alert alert-warning">' + mensagem + '</div>';
}

function readlembrete(processaDados) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            processaDados(data);
        })
        .catch(error => {
            console.error('Erro ao ler lembretes via API JSONServer:', error);
            displayMessage("Erro ao ler lembretes");
        });
}

function createlembrete(lembrete, refreshFunction) {
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(lembrete),
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("lembrete inserido com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao inserir lembrete via API JSONServer:', error);
            displayMessage("Erro ao inserir lembrete");
        });
}

function updatelembrete(id, lembrete, refreshFunction) {
    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(lembrete),
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("lembrete alterado com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao atualizar lembrete via API JSONServer:', error);
            displayMessage("Erro ao atualizar lembrete");
        });
}

function deleteContato(id, refreshFunction) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("lembrete removido com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao remover lembrete via API JSONServer:', error);
            displayMessage("Erro ao remover lembrete");
        });
}