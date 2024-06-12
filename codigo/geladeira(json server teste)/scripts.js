const SERVER_URL = 'https://1f5f6bff-e310-40b6-8d99-9bd68b66e47e-00-2klve06crk6xt.worf.replit.dev';
const lembretesContainer = document.getElementById('lembretesContainer');
const filtroLembretes = document.getElementById('filtroLembretes');
let lembretesCache = [];

document.getElementById('lembreteForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const lembreteText = document.getElementById('lembreteText').value.trim();
  if (lembreteText === '') return;

  fetch(`${SERVER_URL}/lembretes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: lembreteText, curtido: false }), // Definindo curtido como falso ao adicionar
  })
  .then(response => response.json())
  .then(data => {
    lembretesCache.push(data);
    manipularLembrete(data);
    document.getElementById('lembreteForm').reset();
  });
});

// Função para manipular e criar lembretes
function manipularLembrete(lembrete) {
  const lembreteElement = document.createElement('div');
  lembreteElement.classList.add('lembrete');
  lembreteElement.id = `lembrete-${lembrete.id}`;

  // Criando um elemento para mostrar o texto do lembrete
  const lembreteTextElement = document.createElement('p');
  lembreteTextElement.classList.add('lembrete-text');
  lembreteTextElement.textContent = lembrete.text;

  // Criando ícones de ação
  const editIcon = criarIcone('fa-solid fa-pen icone-lembrete', function() {
    editarLembrete(lembrete);
  });
  const likeIcon = criarIcone(lembrete.curtido ? 'fa-solid fa-thumbs-up icone-lembrete' : 'fa-regular fa-thumbs-up icone-lembrete', function() {
    curtirLembrete(lembrete, likeIcon);
  });
  const deleteIcon = criarIcone('fa-solid fa-trash icone-lembrete', function() {
    removerLembrete(lembrete);
  });
  const commentIcon = criarIcone('fa-solid fa-comment icone-lembrete', function() {
    adicionarComentario(lembrete);
  });

  // Adicionando elementos ao lembrete
  lembreteElement.appendChild(lembreteTextElement);
  lembreteElement.appendChild(editIcon);
  lembreteElement.appendChild(likeIcon);
  lembreteElement.appendChild(deleteIcon);
  lembreteElement.appendChild(commentIcon);

  // Expande a altura do card conforme necessário para exibir todo o texto
  lembreteElement.style.height = "auto";

  lembretesContainer.appendChild(lembreteElement);

  // Altera a cor de fundo do card ao ser curtido
  if (lembrete.curtido) {
    lembreteElement.style.backgroundColor = 'var(--likedColor)';
  }
}

// Função para criar um ícone
function criarIcone(className, clickHandler) {
  const icon = document.createElement('i');
  icon.className = className;
  icon.addEventListener('click', clickHandler);
  return icon;
}

// Função para filtrar e exibir os lembretes
function filtrarLembretes() {
  const filtro = filtroLembretes.value;

  // Limpar lembretes container
  lembretesContainer.innerHTML = '';

  // Filtrar e exibir lembretes
  if (filtro === 'todos') {
    lembretesCache.forEach(lembrete => {
      manipularLembrete(lembrete);
    });
  } else if (filtro === 'curtidos') {
    const lembretesCurtidos = lembretesCache.filter(lembrete => lembrete.curtido);
    lembretesCurtidos.forEach(lembrete => {
      manipularLembrete(lembrete);
    });
  } else if (filtro === 'nao-curtidos') {
    const lembretesNaoCurtidos = lembretesCache.filter(lembrete => !lembrete.curtido);
    lembretesNaoCurtidos.forEach(lembrete => {
      manipularLembrete(lembrete);
    });
  }
}

// Obter todos os lembretes do servidor quando a página carrega
window.addEventListener('load', function() {
  fetch(`${SERVER_URL}/lembretes`)
  .then(response => response.json())
  .then(lembretes => {
    lembretesCache = lembretes; // Armazenar lembretes no cache
    filtrarLembretes(); // Exibir lembretes filtrados
    carregarComentarios(); // Carregar comentários
  });
});

// Adicionar evento ao filtro de lembretes
filtroLembretes.addEventListener('change', filtrarLembretes);

// Funções editarLembrete, curtirLembrete e removerLembrete continuam iguais
function editarLembrete(lembrete) {
  const novoTexto = prompt("Digite o novo texto para o lembrete:");
  if (novoTexto !== null) {
    fetch(`${SERVER_URL}/lembretes/${lembrete.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: novoTexto }),
    })
    .then(response => response.json())
    .then(data => {
      const lembreteContent = document.getElementById(`lembrete-${lembrete.id}`).querySelector('.lembrete-text');
      lembreteContent.innerText = data.text;
    });
  }
}

function curtirLembrete(lembrete, likeIcon) {
  const novoStatus = !lembrete.curtido;
  fetch(`${SERVER_URL}/lembretes/${lembrete.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ curtido: novoStatus }),
  })
  .then(response => response.json())
  .then(data => {
    // Atualiza a classe do ícone
    likeIcon.classList.toggle('fa-solid', data.curtido);
    likeIcon.classList.toggle('fa-regular', !data.curtido);
    // Atualiza o status de curtida no objeto lembrete
    lembrete.curtido = data.curtido;
    // Atualiza a cor de fundo do lembrete
    const lembreteElement = document.getElementById(`lembrete-${lembrete.id}`);
    lembreteElement.style.backgroundColor = data.curtido ? 'var(--likedColor)' : 'initial';
  })
  .catch(error => {
    console.error('Erro ao curtir lembrete:', error);
  });
}


function removerLembrete(lembrete) {
  const confirmacao = confirm("Tem certeza que deseja remover este lembrete?");
  if (confirmacao) {
    fetch(`${SERVER_URL}/lembretes/${lembrete.id}`, {
      method: 'DELETE',
    })
    .then(() => {
      const lembreteElement = document.getElementById(`lembrete-${lembrete.id}`);
      lembreteElement.remove();
    });
  }
}

// Função para adicionar comentário a um lembrete
function adicionarComentario(lembrete) {
  const comentario = prompt("Adicione um comentário:");
  if (comentario !== null) {
    // Armazenar o comentário no objeto lembrete
    lembrete.comentario = comentario;

    // Enviar os dados atualizados para o servidor
    fetch(`${SERVER_URL}/lembretes/${lembrete.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comentario: comentario }),
    })
    .then(response => response.json())
    .then(data => {
      // Atualizar a exibição do comentário no lembrete na página
      const lembreteElement = document.getElementById(`lembrete-${lembrete.id}`);
      const comentarioElement = document.createElement('p');
      comentarioElement.classList.add('comentario-text');
      comentarioElement.textContent = `Comentário: ${data.comentario}`;
      lembreteElement.appendChild(comentarioElement);
    })
    .catch(error => {
      console.error('Erro ao adicionar comentário:', error);
    });
  }
}

// Função para carregar os comentários do servidor e atualizar a interface do usuário
function carregarComentarios() {
  fetch(`${SERVER_URL}/lembretes`)
    .then(response => response.json())
    .then(lembretes => {
      lembretes.forEach(lembrete => {
        const lembreteElement = document.getElementById(`lembrete-${lembrete.id}`);
        if (lembreteElement) {
          if (lembrete.comentario) {
            const comentarioElement = document.createElement('p');
            comentarioElement.classList.add('comentario-text');
            comentarioElement.textContent = `Comentário: ${lembrete.comentario}`;
            lembreteElement.appendChild(comentarioElement);
          }
        }
      });
    })
    .catch(error => {
      console.error('Erro ao carregar comentários:', error);
    });
}

// Chamar a função para carregar os comentários no momento apropriado
window.addEventListener('load', function() {
  carregarComentarios();
});

