// declara a url para o objeto de mensagens, a variável objetos é um array
const url = '/mensagens';
objetos = [];

// função para carregar todos os dados dentro do db.json
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

// função para criar um chat usando o método POST na url 
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

// função para deletar um chat com o método DELETE na url
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

// função para atualizar o número de reações (like ou dislike) de uma mensagem específica
function updateReactions(id, likes, dislikes, refresh) {
  fetch(`${url}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ likes, dislikes })
  })
    .then(response => response.json())
    .then(data => {
      if (refresh) refresh();
    })
    .catch(error => {
      console.error('Erro ao atualizar likes/dislikes via API JSONServer:', error);
      alert("Erro ao atualizar likes/dislikes!");
    });
}
