// Função para calcular e exibir o crescimento previsto
function calcularCrescimento() {
    const idadeAtual = document.getElementById("idade-atual").value;
    const alturaAtual = document.getElementById("altura-atual").value;

    if (idadeAtual && alturaAtual) {
        const idadeAnos = parseFloat(idadeAtual) / 12;
        const crescimentoPrevisto = parseFloat(alturaAtual) + (18 - idadeAnos) * 5;
        mostrarMensagem("altura-resultado", `Altura Prevista: ${crescimentoPrevisto.toFixed(2)} cm`, "black");
    } else {
        mostrarMensagem("altura-resultado", "Por favor, insira todos os dados.", "red");
    }
}

// Função genérica para exibir mensagens
function mostrarMensagem(elementId, message, color) {
    const element = document.getElementById(elementId);
    element.innerText = message;
    element.style.color = color;
    setTimeout(() => {
        element.innerText = "";
    }, 5000);
}

// URL da API JSONServer - Substitua pela URL correta da sua API
const apiUrl = 'https://d3bc0c71-a21a-467c-b5cc-9c4323769087-00-u725a4dkcvpy.worf.replit.dev/pediatra';
const apiUrlConsultas = 'https://d3bc0c71-a21a-467c-b5cc-9c4323769087-00-u725a4dkcvpy.worf.replit.dev/consultas';
const apiUrlVacinas = 'https://d3bc0c71-a21a-467c-b5cc-9c4323769087-00-u725a4dkcvpy.worf.replit.dev/vacinas';

document.addEventListener("DOMContentLoaded", function () {
    loadPediatraCards();
    loadConsultas();
    loadVacinas();
});

function savePediatraInfo() {
    const nomePediatra = document.getElementById("nome-pediatra").value.trim();
    const telefonePediatra = document.getElementById("num-pediatra").value.trim();
    const hospitalPediatra = document.getElementById("hospital-pediatra").value.trim();
    const enderecoPediatra = document.getElementById("endereco-pediatra").value.trim();

    if (!nomePediatra || !telefonePediatra || !hospitalPediatra || !enderecoPediatra) {
        mostrarMensagem("status-message", "Por favor, preencha todos os campos corretamente.", "red");
        return;
    }

    const pediatraInfo = {
        nome: nomePediatra,
        telefone: telefonePediatra,
        hospital: hospitalPediatra,
        endereco: enderecoPediatra,
    };

    // Salva as informações na API
    savePediatraInfoAPI(pediatraInfo);
}

function savePediatraInfoAPI(pediatraInfo) {
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pediatraInfo),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao salvar informações do pediatra');
            }
            return response.json();
        })
        .then(data => {
            mostrarMensagem("status-message", "Informações do pediatra salvas com sucesso na API!", "green");
            addPediatraCard(data);
        })
        .catch(error => {
            console.error('Erro ao salvar informações do pediatra via API JSONServer:', error);
            mostrarMensagem("status-message", "Erro ao salvar informações do pediatra na API", "red");
        });
}

function addPediatraCard(pediatraInfo) {
    const cardContainer = document.getElementById('cards-container');
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h3>${pediatraInfo.nome}</h3>
        <p><strong>Telefone:</strong> ${pediatraInfo.telefone}</p>
        <p><strong>Hospital:</strong> ${pediatraInfo.hospital}</p>
        <p><strong>Endereço:</strong> ${pediatraInfo.endereco}</p>
    `;
    cardContainer.appendChild(card);
}

function loadPediatraCards() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar as informações dos pediatras');
            }
            return response.json();
        })
        .then(data => {
            data.forEach(pediatraInfo => {
                addPediatraCard(pediatraInfo);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar as informações dos pediatras via API JSONServer:', error);
            mostrarMensagem("status-message", "Erro ao carregar as informações dos pediatras", "red");
        });
}

function addInfoDasConsultas(event) {
    event.preventDefault();

    const dataConsulta = document.getElementById('notas-datas').value;
    const conteudoConsulta = document.getElementById('notas-conteudo').value.trim();

    if (!dataConsulta || !conteudoConsulta) {
        mostrarMensagem("mensagemconsulta", "Por favor, preencha todos os campos corretamente.", "red");
        return;
    }

    const consultaInfo = {
        data: dataConsulta,
        conteudo: conteudoConsulta,
    };

    saveConsultaInfoAPI(consultaInfo);
    event.target.reset();
}

function saveConsultaInfoAPI(consultaInfo) {
    fetch(apiUrlConsultas, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultaInfo),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao salvar informações da consulta');
            }
            return response.json();
        })
        .then(data => {
            mostrarMensagem("mensagemconsulta", "Informações da consulta salvas com sucesso na API!", "green");
            addConsultaCard(data);
        })
        .catch(error => {
            console.error('Erro ao salvar informações da consulta via API JSONServer:', error);
            mostrarMensagem("mensagemconsulta", "Erro ao salvar informações da consulta na API", "red");
        });
}

function addConsultaCard(consultaInfo) {
    const notasLista = document.getElementById('notas-lista');
    const li = document.createElement('li');
    li.className = 'card';
    li.setAttribute('data-id', consultaInfo.id);
    li.innerHTML = `
        <div class="card-content">
            <h3>${new Date(consultaInfo.data).toLocaleDateString()}</h3>
            <p>${consultaInfo.conteudo}</p>
            <button onclick="toggleEditForm(${consultaInfo.id})">Editar</button>
            <form id="form-${consultaInfo.id}" onsubmit="updateConsulta(event, ${consultaInfo.id})" style="display: none;">
                <input type="date" name="data" value="${new Date(consultaInfo.data).toISOString().substring(0, 10)}">
                <textarea name="conteudo">${consultaInfo.conteudo}</textarea>
                <button type="submit">Salvar</button>
            </form>
            <button onclick="deleteConsulta(${consultaInfo.id})">Deletar</button>
        </div>
    `;
    notasLista.appendChild(li);
}

function toggleEditForm(id) {
    const editForm = document.getElementById(`form-${id}`);
    editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
}

function loadConsultas() {
    fetch(apiUrlConsultas)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar as informações das consultas');
            }
            return response.json();
        })
        .then(data => {
            data.forEach(consultaInfo => {
                addConsultaCard(consultaInfo);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar as informações das consultas via API JSONServer:', error);
            mostrarMensagem("mensagemconsulta", "Erro ao carregar as informações das consultas", "red");
        });
}

function updateConsulta(event, id) {
    event.preventDefault();

    const dataConsulta = event.target.data.value;
    const conteudoConsulta = event.target.conteudo.value.trim();

    if (!dataConsulta || !conteudoConsulta) {
        mostrarMensagem("mensagemconsulta", "Por favor, preencha todos os campos corretamente.", "red");
        return;
    }

    const consultaInfo = {
        data: dataConsulta,
        conteudo: conteudoConsulta,
    };

    fetch(`${apiUrlConsultas}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultaInfo),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao atualizar informações da consulta');
            }
            return response.json();
        })
        .then(data => {
            mostrarMensagem("mensagemconsulta", "Informações da consulta atualizadas com sucesso na API!", "green");
            const li = document.querySelector(`li[data-id="${id}"]`);
            li.querySelector('h3').textContent = new Date(data.data).toLocaleDateString();
            li.querySelector('p').textContent = data.conteudo;
            toggleEditForm(id);
        })
        .catch(error => {
            console.error('Erro ao atualizar informações da consulta via API JSONServer:', error);
            mostrarMensagem("mensagemconsulta", "Erro ao atualizar informações da consulta na API", "red");
        });
}

function deleteConsulta(id) {
    fetch(`${apiUrlConsultas}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao deletar informações da consulta');
            }
            mostrarMensagem("mensagemconsulta", "Informações da consulta deletadas com sucesso na API!", "green");
            const li = document.querySelector(`li[data-id="${id}"]`);
            li.remove();
        })
        .catch(error => {
            console.error('Erro ao deletar informações da consulta via API JSONServer:', error);
            mostrarMensagem("mensagemconsulta", "Erro ao deletar informações da consulta na API", "red");
        });
}

function adicionarVacina(event) {
    event.preventDefault();

    const nomeVacina = document.getElementById('vacina-nome').value.trim();
    const dataVacina = document.getElementById('vacina-data').value;

    if (!nomeVacina || !dataVacina) {
        mostrarMensagem("mensagemvacina", "Por favor, preencha todos os campos corretamente.", "red");
        return;
    }

    const vacinaInfo = {
        nome: nomeVacina,
        data: dataVacina,
    };

    saveVacinaInfoAPI(vacinaInfo);
    event.target.reset();
}

function saveVacinaInfoAPI(vacinaInfo) {
    fetch(apiUrlVacinas, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(vacinaInfo),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao salvar informações da vacina');
            }
            return response.json();
        })
        .then(data => {
            mostrarMensagem("mensagemvacina", "Informações da vacina salvas com sucesso na API!", "green");
            addVacinaCard(data);
        })
        .catch(error => {
            console.error('Erro ao salvar informações da vacina via API JSONServer:', error);
            mostrarMensagem("mensagemvacina", "Erro ao salvar informações da vacina na API", "red");
        });
}

function addVacinaCard(vacinaInfo) {
    const vacinaLista = document.getElementById('vacinas-lista');
    const li = document.createElement('li');
    li.className = 'card';
    li.setAttribute('data-id', vacinaInfo.id);
    li.innerHTML = `
        <div class="card-content">
            <h3>${vacinaInfo.nome}</h3>
            <p>${new Date(vacinaInfo.data).toLocaleDateString()}</p>
            <button onclick="toggleEditForm(${vacinaInfo.id})" style="background-color: #4b0082; color: white; border: none; padding: 0.5em 1em; border-radius: 5px; cursor: pointer;">Editar</button>
            <form id="form-${vacinaInfo.id}" onsubmit="updateVacina(event, ${vacinaInfo.id})" style="display: none;">
                <input type="text" name="nome" value="${vacinaInfo.nome}">
                <input type="date" name="data" value="${new Date(vacinaInfo.data).toISOString().substring(0, 10)}">
                <button type="submit">Salvar</button>
            </form>
            <button onclick="deleteVacina(${vacinaInfo.id})"style="background-color: #4b0082; color: white; border: none; padding: 0.5em 1em; border-radius: 5px; cursor: pointer;">Deletar</button>
        </div>
    `;
    vacinaLista.appendChild(li);
}


function loadVacinas() {
    fetch(apiUrlVacinas)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar as informações das vacinas');
            }
            return response.json();
        })
        .then(data => {
            data.forEach(vacinaInfo => {
                addVacinaCard(vacinaInfo);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar as informações das vacinas via API JSONServer:', error);
            mostrarMensagem("mensagemvacina", "Erro ao carregar as informações das vacinas", "red");
        });
}

function updateVacina(event, id) {
    event.preventDefault();

    const nomeVacina = event.target.nome.value.trim();
    const dataVacina = event.target.data.value;

    if (!nomeVacina || !dataVacina) {
        mostrarMensagem("mensagemvacina", "Por favor, preencha todos os campos corretamente.", "red");
        return;
    }

    const vacinaInfo = {
        nome: nomeVacina,
        data: dataVacina,
    };

    fetch(`${apiUrlVacinas}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(vacinaInfo),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao atualizar informações da vacina');
            }
            return response.json();
        })
        .then(data => {
            mostrarMensagem("mensagemvacina", "Informações da vacina atualizadas com sucesso na API!", "green");
            const li = document.querySelector(`li[data-id="${id}"]`);
            li.querySelector('h3').textContent = data.nome;
            li.querySelector('p').textContent = new Date(data.data).toLocaleDateString();
            toggleEditForm(id);
        })
        .catch(error => {
            console.error('Erro ao atualizar informações da vacina via API JSONServer:', error);
            mostrarMensagem("mensagemvacina", "Erro ao atualizar informações da vacina na API", "red");
        });
}

function deleteVacina(id) {
    fetch(`${apiUrlVacinas}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao deletar informações da vacina');
            }
            mostrarMensagem("mensagemvacina", "Informações da vacina deletadas com sucesso na API!", "green");
            const li = document.querySelector(`li[data-id="${id}"]`);
            li.remove();
        })
        .catch(error => {
            console.error('Erro ao deletar informações da vacina via API JSONServer:', error);
            mostrarMensagem("mensagemvacina", "Erro ao deletar informações da vacina na API", "red");
        });
}