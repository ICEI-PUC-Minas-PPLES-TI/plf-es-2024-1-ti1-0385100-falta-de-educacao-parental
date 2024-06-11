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
    criarLembrete(data);
    document.getElementById('lembreteForm').reset();
  });
});

function criarLembrete(lembrete) {
  const lembreteElement = document.createElement('div');
  lembreteElement.classList.add('lembrete');
  lembreteElement.id = `lembrete-${lembrete.id}`;

  // Criando um elemento para mostrar o texto do lembrete
  const lembreteTextElement = document.createElement('p');
  lembreteTextElement.classList.add('lembrete-text'); // Adicione uma classe para estilização, se necessário
  lembreteTextElement.textContent = lembrete.text; // Adicionando o texto do lembrete ao elemento

  const editIcon = criarIcone('fa-solid fa-pen edit-icon', function() {
    editarLembrete(lembrete);
  });

  const likeIcon = criarIcone(lembrete.curtido ? 'fa-solid fa-thumbs-up like-icon' : 'fa-regular fa-thumbs-up like-icon', function() {
    curtirLembrete(lembrete, likeIcon);
  });

  const deleteIcon = criarIcone('fa-solid fa-trash delete-icon', function() {
    removerLembrete(lembrete);
  });

  // Adicionando o texto do lembrete ao elemento do lembrete
  lembreteElement.appendChild(lembreteTextElement);
  lembreteElement.appendChild(editIcon);
  lembreteElement.appendChild(likeIcon);
  lembreteElement.appendChild(deleteIcon);

  // Expande a altura do card conforme necessário para exibir todo o texto
  lembreteElement.style.height = "auto";

  lembretesContainer.appendChild(lembreteElement);

  // Altera a cor de fundo do card ao ser curtido
  if (lembrete.curtido) {
    lembreteElement.style.backgroundColor = 'var(--likedColor)';
  }
}

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
      criarLembrete(lembrete);
    });
  } else if (filtro === 'curtidos') {
    const lembretesCurtidos = lembretesCache.filter(lembrete => lembrete.curtido);
    lembretesCurtidos.forEach(lembrete => {
      criarLembrete(lembrete);
    });
  } else if (filtro === 'nao-curtidos') {
    const lembretesNaoCurtidos = lembretesCache.filter(lembrete => !lembrete.curtido);
    lembretesNaoCurtidos.forEach(lembrete => {
      criarLembrete(lembrete);
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
    likeIcon.className = data.curtido ? 'fa-solid fa-thumbs-up like-icon' : 'fa-regular fa-thumbs-up like-icon';
    const lembreteElement = document.getElementById(`lembrete-${lembrete.id}`);
    lembreteElement.style.backgroundColor = data.curtido ? 'var(--likedColor)' : 'inherit';
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

// Obter todos os lembretes do servidor quando a página carrega
window.addEventListener('load', function() {
  fetch(`${SERVER_URL}/lembretes`)
  .then(response => response.json())
  .then(lembretes => {
    lembretesCache = lembretes; // Armazenar lembretes no cache
    filtroLembretes.value = 'todos'; // Selecionar filtro 'todos' por padrão
    filtrarLembretes(); // Exibir lembretes filtrados
  });
});
