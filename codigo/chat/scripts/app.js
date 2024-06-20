const url = 'https://6bea1cdc-be48-4dc4-9b7c-16a09ccd19e7-00-u0yl2u8vykcf.kirk.replit.dev/mensagens';
objetos = [];

function carregaDadosJSONServer(func) {
  fetch(url.replace('/mensagens', '/db'))
  .then(function(response) {
    return response.json()
  })
  .then(function(dados) {
    console.log('Dados recebidos do servidor:', dados); 
    objetos = dados;
    func();
  })
  .catch(function(error) {
    console.error('Erro ao carregar dados:', error);
  });
}

function createChat(chat, refresh) {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(chat),
  })
    
    .then(response => response.json())
    .then(data => {
      if (refresh) refresh();
    })
    .catch(function(error) {
      console.error("Erro ao inserir mensagem via API JSONServer:", error);
      alert("Erro ao inserir mensagem!");
    });
}

function deleteChat(id, refresh) {
  fetch(`${url}/${id}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      alert("Mensagem deletada com sucesso!");
      if(refresh) refresh();
    })
    .catch(error => {
      console.error('Erro ao remover mensagens via API JSONServer:', error);
      alert("Erro ao deletar mensagem!");
    });
}
