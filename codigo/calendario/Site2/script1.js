// Seletores
const monthYearDisplay = document.getElementById('monthYear');
const daysDisplay = document.getElementById('days');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const popup = document.getElementById('popup');
const registerButton = document.getElementById('btnlembrete');
const userList = document.getElementById('userList');

// Data Atual
let currentDate = new Date();

// Estrutura de Dados: Lista de Usuários
let userData = JSON.parse(localStorage.getItem('users')) || [];

// Função para renderizar o calendário
function renderCalendar() {
  const today = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();

  monthYearDisplay.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;

  let daysHTML = '';

  const registeredDays = JSON.parse(localStorage.getItem('registeredDays')) || [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    daysHTML += `<div></div>`;
  }

  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    let dayClass = 'calendar-day';
    const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${i}`;
    if (currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth() && i === today.getDate()) {
      dayClass += ' today';
    }
    if (registeredDays.includes(dateStr)) {
      dayClass += ' registered-day';
    }
    daysHTML += `<div class="${dayClass}">${i}</div>`;
  }

  daysDisplay.innerHTML = daysHTML;
}

// Função para salvar os usuários no LocalStorage
function saveToLocalStorage() {
  localStorage.setItem('users', JSON.stringify(userData));
}

// Função para gerar um ID único para cada usuário
function generateId() {
  return userData.length === 0 ? 1 : Math.max(...userData.map(user => user.id)) + 1;
}

// Função para adicionar um usuário
function addUser(name, date) {
  const id = generateId();
  userData.push({ id, name, date: new Date(date), impor: 0 });
  saveToLocalStorage();
  displayUserData();
}

// Função para remover um usuário
function removeUser(id) {
  const userToRemove = userData.find(user => user.id === id);
  if (!userToRemove) {
    console.error('User not found');
    return;
  }
  userData = userData.filter(user => user.id !== id);
  saveToLocalStorage();

  let registeredDays = JSON.parse(localStorage.getItem('registeredDays')) || [];
  const dateStr = `${new Date(userToRemove.date).getFullYear()}-${new Date(userToRemove.date).getMonth() + 1}-${new Date(userToRemove.date).getDate()}`;
  const indexToRemove = registeredDays.indexOf(dateStr);

  if (indexToRemove !== -1) {
    registeredDays.splice(indexToRemove, 1);
    localStorage.setItem('registeredDays', JSON.stringify(registeredDays));
    renderCalendar();
  }

  displayUserData();
}

// Função para alternar a importância de um usuário
function toggleImportant(id) {
  const user = userData.find(user => user.id === id);
  if (user) {
    user.impor = user.impor === 0 ? 1 : 0;
    saveToLocalStorage();
    displayUserData();
  }
}

// Função para exibir os dados dos usuários
function displayUserData() {
  userList.innerHTML = '';
  userData.forEach(user => {
    const userItem = document.createElement('li');
    const userDate = new Date(user.date);
    const formattedDate = userDate.toLocaleDateString('pt-BR');
    userItem.textContent = `${user.name}, Data: ${formattedDate}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      removeUser(user.id);
    });

    const importantButton = document.createElement('button');
    importantButton.textContent = user.impor === 1 ? 'Não Importante' : 'Importante';
    importantButton.addEventListener('click', () => {
      toggleImportant(user.id);
    });

    userItem.appendChild(deleteButton);
    userItem.appendChild(importantButton);
    userList.appendChild(userItem);
  });
}

// Função para lidar com a adição de um usuário a partir de um formulário
function handleAddUser(event) {
  event.preventDefault();
  const name = document.getElementById('dayName').value;
  const date = document.getElementById('day').value;

  if (name && date) {
    addUser(name, date);
    confirmRegistration();
    document.getElementById('dayName').value = '';
    document.getElementById('day').value = '';
    closePopup();
  }
}

// Função para abrir o popup
function openPopup() {
  popup.style.display = 'block';
}

// Função para fechar o popup
function closePopup() {
  popup.style.display = 'none';
}

// Função para confirmar o registro de uma data
function confirmRegistration() {
  const date = new Date(document.getElementById('day').value);
  const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  let registeredDays = JSON.parse(localStorage.getItem('registeredDays')) || [];
  registeredDays.push(dateStr);
  localStorage.setItem('registeredDays', JSON.stringify(registeredDays));
  renderCalendar();
  closePopup();
}

// Função para limpar os dias registrados
function clearRegisteredDays() {
  localStorage.removeItem('registeredDays');
  renderCalendar();
}

// Função para voltar para a página anterior
function goBack() {
  window.history.back();
}

// Event Listeners
registerButton.addEventListener('click', openPopup);
prevButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});
nextButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// Inicialização
window.onload = function () {
  userData = JSON.parse(localStorage.getItem('users')) || [];
  displayUserData();
};

renderCalendar();
