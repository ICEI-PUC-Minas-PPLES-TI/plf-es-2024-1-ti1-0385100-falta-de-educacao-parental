// URL da API JSONServer para os dados do pediatra
const apiUrl =
	"https://c3f820e3-023c-4b17-a88a-548c4ba0f300-00-348ax4jvkkgmw.worf.replit.dev/pediatra";

// URL da API JSONServer para os dados das anotações das consultas
const apiUrlConsultas =
	"https://c3f820e3-023c-4b17-a88a-548c4ba0f300-00-348ax4jvkkgmw.worf.replit.dev/consultas";

// Função para ler as informações do pediatra na API
function readPediatraInfo(processaDados) {
	fetch(apiUrl)
		.then((response) => response.json())
		.then((data) => {
			processaDados(data);
		})
		.catch((error) => {
			console.error(
				"Erro ao ler informações do pediatra via API JSONServer:",
				error,
			);
			mostrarMensagem(
				"status-message",
				"Erro ao ler informações do pediatra",
				"red",
			);
		});
}

// Função para salvar as informações do pediatra na API
function savePediatraInfoAPI(pediatra, refreshFunction) {
	fetch(apiUrl)
		.then((response) => response.json())
		.then((existingData) => {
			const existingEntry = existingData.find(
				(entry) => entry.nome === pediatra.nome,
			);

			if (existingEntry) {
				fetch(`${apiUrl}/${existingEntry.id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(pediatra),
				})
					.then((response) => {
						if (!response.ok) {
							throw new Error("Network response was not ok");
						}
						return response.json();
					})
					.then((data) => {
						mostrarMensagem(
							"status-message",
							"Informações do pediatra atualizadas com sucesso",
							"green",
						);
						if (refreshFunction) refreshFunction();
					})
					.catch((error) => {
						console.error(
							"Erro ao atualizar informações do pediatra via API JSONServer:",
							error,
						);
						mostrarMensagem(
							"status-message",
							"Erro ao atualizar informações do pediatra",
							"red",
						);
					});
			} else {

				fetch(apiUrl, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(pediatra),
				})
					.then((response) => {
						if (!response.ok) {
							throw new Error("Network response was not ok");
						}
						return response.json();
					})
					.then((data) => {
						mostrarMensagem(
							"status-message",
							"Informações do pediatra salvas com sucesso",
							"green",
						);
						if (refreshFunction) refreshFunction();
					})
					.catch((error) => {
						console.error(
							"Erro ao salvar informações do pediatra via API JSONServer:",
							error,
						);
						mostrarMensagem(
							"status-message",
							"Erro ao salvar informações do pediatra",
							"red",
						);
					});
			}
		})
		.catch((error) => {
			console.error(
				"Erro ao verificar informações do pediatra via API JSONServer:",
				error,
			);
			mostrarMensagem(
				"status-message",
				"Erro ao verificar informações do pediatra",
				"red",
			);
		});
}

function init() {
	loadNotas();
	loadPediatraInfo();
	document
		.getElementById("save-pediatra")
		.addEventListener("click", savePediatraInfoAPI);
}



// Função para carregar as informações do pediatra do localStorage
function loadPediatraInfo() {
	const pediatraInfo = localStorage.getItem("pediatraInfo");
	if (pediatraInfo) {
		const info = JSON.parse(pediatraInfo);
		document.getElementById("nome-pediatra").value = info.nome;
		document.getElementById("num-pediatra").value = info.telefone;
		document.getElementById("hospital-pediatra").value = info.hospital;
		document.getElementById("endereco-pediatra").value = info.endereco;
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


// Função para ler as informações das consultas na API
function readConsultasInfo(processaDados) {
	fetch(apiUrlConsultas)
		.then((response) => response.json())
		.then((data) => {
			processaDados(data);
		})
		.catch((error) => {
			console.error(
				"Erro ao ler informações das consultas via API JSONServer:",
				error,
			);
			mostrarMensagem(
				"status-message",
				"Erro ao ler informações das consultas",
				"red",
			);
		});
}

// Função para salvar as informações da consulta na API
function saveConsultasInfoAPI(consulta, refreshFunction) {
	if (!consulta.id) {
			console.error('O objeto consulta não contém um ID válido.');
			return;
	}
	fetch(apiUrlConsultas)
		.then((response) => response.json())
		.then((existingData) => {

							const existingEntry = existingData.find(entry => entry.id === consulta.id);

							if (existingEntry) {

								fetch(`${apiUrlConsultas}/${existingEntry.id}`, {
											method: 'PUT',
											headers: {
													'Content-Type': 'application/json',
											},
											body: JSON.stringify(consulta),
									})
									.then(response => {
											if (!response.ok) {
													throw new Error('Network response was not ok');
											}
											return response.json();
									})
									.then(data => {
											mostrarMensagem("status-message", "Informações da consulta atualizadas com sucesso", "green");
											if (refreshFunction) refreshFunction();
									})
									.catch(error => {
											console.error('Erro ao atualizar informações da consulta via API JSONServer:', error);
											mostrarMensagem("status-message", "Erro ao atualizar informações da consulta", "red");
									});
							} else {
									// Inserir uma nova entrada
									fetch(apiUrlConsultas, {
											method: 'POST',
											headers: {
													'Content-Type': 'application/json',
											},
											body: JSON.stringify(consulta),
									})
									.then(response => {
											if (!response.ok) {
													throw new Error('Network response was not ok');
											}
											return response.json();
									})
									.then(data => {
											mostrarMensagem("status-message", "Informações da consulta salvas com sucesso", "green");
											if (refreshFunction) refreshFunction();
									})
									.catch(error => {
											console.error('Erro ao salvar informações da consulta via API JSONServer:', error);
											mostrarMensagem("status-message", "Erro ao salvar informações da consulta", "red");
									});
							}
					})
					.catch(error => {
							console.error('Erro ao verificar informações da consulta via API JSONServer:', error);
							mostrarMensagem("status-message", "Erro ao verificar informações da consulta", "red");
					});
	}



// Função para atualizar as informações das consultas na API
function updateConsultasInfo(notaId, refreshFunction) {
	fetch(`${apiUrlConsultas}/${notaId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(consultas),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Erro na requisição: " + response.status);
			}
			return response.json();
		})
		.then((data) => {
			console.log("Resposta da API após atualizar as consultas:", data);
			mostrarMensagem("Informações das consultas atualizadas com sucesso");
			if (refreshFunction) {
				refreshFunction();
			}
		})
		.catch((error) => {
			console.error(
				"Erro ao atualizar informações das consultas via API JSONServer:",
				error,
			);
			mostrarMensagem("Erro ao atualizar informações das consultas");
		});
}

// Função para excluir as informações das consultas na API
function deleteConsultasInfo(notaId, refreshFunction) {
	fetch(`${apiUrlConsultas}/${notaId}`, {
		method: "DELETE",
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Erro na requisição: " + response.status);
			}
			return response.json();
		})
		.then(() => {
			mostrarMensagem("Informações da consulta removida com sucesso");
			if (refreshFunction) {
				refreshFunction();
			}
		})
		.catch((error) => {
			console.error(
				"Erro ao remover informações da consulta via API JSONServer:",
				error,
			);
			mostrarMensagem("Erro ao remover informações da consulta");
		});
}




window.onload = init;
