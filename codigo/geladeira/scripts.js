document.getElementById('lembreteForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const lembreteText = document.getElementById('lembreteText').value.trim();
    if (lembreteText === '') return;

    const lembrete = criarLembrete(lembreteText);

    document.getElementById('lembretesContainer').appendChild(lembrete);
    document.getElementById('lembreteForm').reset();
});

function criarLembrete(text) {
    const lembrete = document.createElement('div');
    lembrete.className = 'lembrete';
    lembrete.draggable = true;
    lembrete.id = 'lembrete-' + Date.now(); // ID único baseado no timestamp
    lembrete.addEventListener('dragstart', dragStart);
    lembrete.addEventListener('dragover', dragOver);
    lembrete.addEventListener('drop', drop);
    lembrete.addEventListener('dragend', dragEnd);

    const lembreteContent = document.createElement('div');
    lembreteContent.className = 'lembrete-content';
    lembreteContent.innerText = text;

    const editIcon = document.createElement('i');
    editIcon.className = 'fa-solid fa-pen edit-icon';
    editIcon.addEventListener('click', function() {
        editarLembrete(lembrete, lembreteContent);
    });

    const likeIcon = document.createElement('i');
    likeIcon.className = 'fa-regular fa-thumbs-up like-icon';
    likeIcon.addEventListener('click', function() {
        curtirLembrete(lembrete, likeIcon);
    });

    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fa-solid fa-trash delete-icon';
    deleteIcon.addEventListener('click', function() {
        removerLembrete(lembrete);
    });

    const replyIcon = document.createElement('i');
    replyIcon.className = 'fa-regular fa-comment reply-icon';
    replyIcon.addEventListener('click', function() {
        responderLembrete(lembrete);
    });

    lembrete.appendChild(lembreteContent);
    lembrete.appendChild(editIcon);
    lembrete.appendChild(likeIcon);
    lembrete.appendChild(deleteIcon);
    lembrete.appendChild(replyIcon);

    return lembrete;
}

function editarLembrete(lembrete, lembreteContent) {
    const textArea = document.createElement('textarea');
    textArea.className = 'lembrete-textarea';
    textArea.value = lembreteContent.innerText;

    const saveButton = document.createElement('button');
    saveButton.className = 'lembrete-save-button';
    saveButton.innerText = 'Salvar';
    saveButton.addEventListener('click', function() {
        lembreteContent.innerText = textArea.value.trim();
        lembrete.replaceChild(lembreteContent, textArea);
        lembrete.removeChild(saveButton);
    });

    lembrete.replaceChild(textArea, lembreteContent);
    lembrete.appendChild(saveButton);
}

function curtirLembrete(lembrete, likeIcon) {
    if (likeIcon.classList.contains('fa-regular')) {
        lembrete.style.backgroundColor = 'var(--likedColor)';
        likeIcon.className = 'fa-solid fa-thumbs-up like-icon';
    } else {
        lembrete.style.backgroundColor = 'var(--lightyellow)';
        likeIcon.className = 'fa-regular fa-thumbs-up like-icon';
    }
}

function removerLembrete(lembrete) {
    lembrete.remove();
}

function responderLembrete(lembrete) {
    const textArea = document.createElement('textarea');
    textArea.className = 'lembrete-textarea';
    textArea.placeholder = 'Escreva sua resposta aqui...';

    const submitButton = document.createElement('button');
    submitButton.className = 'lembrete-save-button';
    submitButton.innerText = 'Comentar';
    submitButton.addEventListener('click', function() {
        publicarResposta(lembrete, textArea);
    });

    textArea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            publicarResposta(lembrete, textArea);
        }
    });

    lembrete.appendChild(textArea);
    lembrete.appendChild(submitButton);
    textArea.focus();
}

function publicarResposta(lembrete, textArea) {
    const responseText = textArea.value.trim();
    if (responseText !== '') {
        const responseContent = document.createElement('div');
        responseContent.className = 'response-content';
        responseContent.innerText = responseText;
        lembrete.appendChild(responseContent);
    }
    textArea.remove();
    const submitButton = lembrete.querySelector('.lembrete-save-button');
    if (submitButton) submitButton.remove();
}

// Funções de arrastar e soltar
function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
}

function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function drop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const draggableElement = document.getElementById(id);
    const dropzone = e.target.closest('.lembrete');
   
    if (dropzone && draggableElement !== dropzone) {
        const container = document.getElementById('lembretesContainer');
        const children = Array.from(container.children);
        const draggableIndex = children.indexOf(draggableElement);
        const dropzoneIndex = children.indexOf(dropzone);

        if (draggableIndex > dropzoneIndex) {
            container.insertBefore(draggableElement, dropzone);
        } else {
            container.insertBefore(draggableElement, dropzone.nextSibling);
        }
    }
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

// Adicione um evento change ao seletor de filtro
document.getElementById('filtroLembretes').addEventListener('change', function() {
    const filtro = this.value; // Obtenha o valor selecionado

    const lembretes = document.querySelectorAll('.lembrete');
    
    lembretes.forEach(function(lembrete) {
        const curtido = lembrete.querySelector('.like-icon').classList.contains('fa-solid');
        
        // Verifique o filtro selecionado e oculte ou exiba o lembrete com base nisso
        if (filtro === 'curtidos' && !curtido) {
            lembrete.style.display = 'none';
        } else if (filtro === 'nao-curtidos' && curtido) {
            lembrete.style.display = 'none';
        } else {
            lembrete.style.display = 'block';
        }
    });
});
