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

document.addEventListener("DOMContentLoaded", function () {
    loadPediatraCards();
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

function mostrarMensagem(elementId, message, color) {
    const element = document.getElementById(elementId);
    element.innerText = message;
    element.style.color = color;
    setTimeout(() => {
        element.innerText = "";
    }, 5000);
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

const apiUrlConsultas = 'https://d3bc0c71-a21a-467c-b5cc-9c4323769087-00-u725a4dkcvpy.worf.replit.dev/consultas';
document.addEventListener("DOMContentLoaded", function () {
    loadConsultas();
});

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

function mostrarMensagem(elementId, message, color) {
    const element = document.getElementById(elementId);
    element.innerText = message;
    element.style.color = color;
    setTimeout(() => {
        element.innerText = "";
    }, 5000);
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
            updateConsultaCard(data);
        })
        .catch(error => {
            console.error('Erro ao atualizar informações da consulta via API JSONServer:', error);
            mostrarMensagem("mensagemconsulta", "Erro ao atualizar informações da consulta na API", "red");
        });
}

function updateConsultaCard(consultaInfo) {
    const consultaCard = document.querySelector(`li.card[data-id="${consultaInfo.id}"]`);
    consultaCard.querySelector('h3').innerText = new Date(consultaInfo.data).toLocaleDateString();
    consultaCard.querySelector('p').innerText = consultaInfo.conteudo;
    consultaCard.querySelector('input[name="data"]').value = new Date(consultaInfo.data).toISOString().substring(0, 10);
    consultaCard.querySelector('textarea[name="conteudo"]').value = consultaInfo.conteudo;
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
                throw new Error('Erro ao deletar a consulta');
            }
            return response.json();
        })
        .then(() => {
            mostrarMensagem("mensagemconsulta", "Consulta deletada com sucesso na API!", "green");
            const consultaCard = document.querySelector(`li.card[data-id="${id}"]`);
            consultaCard.remove();
        })
        .catch(error => {
            console.error('Erro ao deletar a consulta via API JSONServer:', error);
            mostrarMensagem("mensagemconsulta", "Erro ao deletar a consulta na API", "red");
        });
}

const apiUrlVacinas = 'https://d3bc0c71-a21a-467c-b5cc-9c4323769087-00-u725a4dkcvpy.worf.replit.dev/vacinas';

document.addEventListener("DOMContentLoaded", function () {
    loadVacinas();
});

function addInfoDasVacinas(event) {
    event.preventDefault();

    const dataVacina = document.getElementById('vacinas-datas').value;
    const proximaDose = document.getElementById('proxima-dose').value;
    const nomeVacina = document.getElementById('nome-vacina').value.trim();
    const localAplicacao = document.getElementById('local-aplicacao').value.trim();

    if (!dataVacina || !nomeVacina || !localAplicacao) {
        mostrarMensagem("mensagemvacina", "Por favor, preencha todos os campos obrigatórios.", "red");
        return;
    }

    const vacinaInfo = {
        data: dataVacina,
        proximaDose: proximaDose,
        nome: nomeVacina,
        local: localAplicacao,
    };

    saveVacinaInfoAPI(vacinaInfo);
    event.target.reset();
}

function mostrarMensagem(elementId, message, color) {
    const element = document.getElementById(elementId);
    element.innerText = message;
    element.style.color = color;
    setTimeout(() => {
        element.innerText = "";
    }, 5000);
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
            console.error('Erro ao salvar informações da vacina via API:', error);
            mostrarMensagem("mensagemvacina", "Erro ao salvar informações da vacina na API", "red");
        });
}

function addVacinaCard(vacinaInfo) {
    const vacinaLista = document.getElementById('vacina-lista');
    if (vacinaLista) {
        const li = document.createElement('li');
        li.className = 'card';
        li.setAttribute('data-id', vacinaInfo.id);
        li.innerHTML = `
            <div class="card-content">
                <h3>${new Date(vacinaInfo.data).toLocaleDateString()}</h3>
                <p><strong>Nome:</strong> ${vacinaInfo.nome}</p>
                <p><strong>Local de Aplicação:</strong> ${vacinaInfo.local}</p>
                <p><strong>Próxima Dose:</strong> ${vacinaInfo.proximaDose}</p>
                <button onclick="toggleEditForm(${vacinaInfo.id})">Editar</button>
                <form id="form-${vacinaInfo.id}" onsubmit="updateVacina(event, ${vacinaInfo.id})" style="display: none;">
                    <input type="date" name="data" value="${new Date(vacinaInfo.data).toISOString().substring(0, 10)}" required>
                    <input type="date" name="proxima-dose" value="${vacinaInfo.proximaDose}">
                    <input type="text" name="nome-vacina" value="${vacinaInfo.nome}">
                    <input type="text" name="local-aplicacao" value="${vacinaInfo.local}">
                    <button type="submit">Salvar</button>
                </form>
                <button onclick="deleteVacina(${vacinaInfo.id})">Deletar</button>
            </div>
        `;
        vacinaLista.appendChild(li);
    } else {
        console.error('Elemento vacina-lista não encontrado.');
    }
}


function toggleEditForm(id) {
    const editForm = document.getElementById(`form-${id}`);
    editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
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
            console.error('Erro ao carregar as informações das vacinas via API:', error);
            mostrarMensagem("mensagemvacina", "Erro ao carregar as informações das vacinas", "red");
        });
}

function updateVacina(event, id) {
    event.preventDefault();

    const dataVacina = event.target.data.value;
    const proximaDose = event.target['proxima-dose'].value;
    const nomeVacina = event.target['nome-vacina'].value.trim();
    const localAplicacao = event.target['local-aplicacao'].value.trim();

    if (!dataVacina || !nomeVacina || !localAplicacao) {
        mostrarMensagem("mensagemvacina", "Por favor, preencha todos os campos obrigatórios.", "red");
        return;
    }

    const vacinaInfo = {
        data: dataVacina,
        proximaDose: proximaDose,
        nome: nomeVacina,
        local: localAplicacao,
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
            updateVacinaCard(data);
        })
        .catch(error => {
            console.error('Erro ao atualizar informações da vacina via API:', error);
            mostrarMensagem("mensagemvacina", "Erro ao atualizar informações da vacina na API", "red");
        });
}

function updateVacinaCard(vacinaInfo) {
    const vacinaCard = document.querySelector(`li.card[data-id="${vacinaInfo.id}"]`);
    vacinaCard.querySelector('h3').innerText = new Date(vacinaInfo.data).toLocaleDateString();
    vacinaCard.querySelector('strong').innerText = vacinaInfo.nome;
    vacinaCard.querySelectorAll('p')[1].innerText = `Local de Aplicação: ${vacinaInfo.local}`;
    vacinaCard.querySelectorAll('p')[2].innerText = `Próxima Dose: ${vacinaInfo.proximaDose}`;
    vacinaCard.querySelector('input[name="data"]').value = new Date(vacinaInfo.data).toISOString().substring(0, 10);
    vacinaCard.querySelector('input[name="proxima-dose"]').value = vacinaInfo.proximaDose;
    vacinaCard.querySelector('input[name="nome-vacina"]').value = vacinaInfo.nome;
    vacinaCard.querySelector('input[name="local-aplicacao"]').value = vacinaInfo.local;
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
                throw new Error('Erro ao deletar a vacina');
            }
            return response.json();
        })
        .then(() => {
            mostrarMensagem("mensagemvacina", "Vacina deletada com sucesso na API!", "green");
            const vacinaCard = document.querySelector(`li.card[data-id="${id}"]`);
            vacinaCard.remove();
        })
        .catch(error => {
            console.error('Erro ao deletar a vacina via API:', error);
            mostrarMensagem("mensagemvacina", "Erro ao deletar a vacina na API", "red");
        });
}
