const monthYearDisplay = document.getElementById('monthYear');
const daysDisplay = document.getElementById('days');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

let currentDate = new Date();

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
    if (currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth() && i === today.getDate()) {
      dayClass += ' today';
    }
    if (registeredDays.includes(i)) {
      dayClass += ' registered-day';
    }
    daysHTML += `<div class="${dayClass}">${i}</div>`;
  }
  
  daysDisplay.innerHTML = daysHTML;
}

renderCalendar();

const popup = document.getElementById('popup');
const registerButton = document.getElementById('btnlembrete');

registerButton.addEventListener('click', () => {
  popup.style.display = 'block';
});
prevButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});


function closePopup() {
  popup.style.display = 'none';
}

function confirmRegistration() {
  const day = new Date(document.getElementById('day').value).getDate() + 1;

  let registeredDays = JSON.parse(localStorage.getItem('registeredDays')) || [];

  registeredDays.push(day);

  localStorage.setItem('registeredDays', JSON.stringify(registeredDays));

  renderCalendar();

  closePopup();
}

let userData = JSON.parse(localStorage.getItem('users')) || [];

function saveToLocalStorage() {
  localStorage.setItem('users', JSON.stringify(userData));
}

function generateId() {
  return userData.length === 0 ? 1 : Math.max(...userData.map(user => user.id)) + 1;
}

function addUser(name, date) {
  const id = generateId();
  userData.push({ id, name, date: new Date(date) });
  saveToLocalStorage();
  displayUserData();
}

function removeUser(id) {
  const userToRemove = userData.find(user => user.id === id);
  
  if (!userToRemove) {
    console.error('User not found');
    return;
  }

  userData = userData.filter(user => user.id !== id);
  
  saveToLocalStorage();

  let registeredDays = JSON.parse(localStorage.getItem('registeredDays')) || [];
  const day = new Date(userToRemove.date).getDate() + 1;
  const indexToRemove = registeredDays.indexOf(day);
  
  if (indexToRemove !== -1) {
    registeredDays.splice(indexToRemove, 1);
    localStorage.setItem('registeredDays', JSON.stringify(registeredDays));
    renderCalendar();
  }

  displayUserData();
}

function displayUserData() {
  const userList = document.getElementById('userList');
  userList.innerHTML = '';

  userData.forEach(user => {
    const userItem = document.createElement('li');
    
    const userDate = new Date(user.date);
    const adjustedDate = new Date(userDate.getTime() + (24 * 60 * 60 * 1000));
    const formattedDate = adjustedDate.toLocaleDateString('pt-BR');

    userItem.textContent = `${user.name}, Data: ${formattedDate}`;
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      removeUser(user.id);
    });

    userItem.appendChild(deleteButton);
    userList.appendChild(userItem);
  });
}

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

function openPopup() {
  document.getElementById('popup').style.display = 'block';
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
}

function goBack() {
  window.history.back();
}

window.onload = function() {
  userData = JSON.parse(localStorage.getItem('users')) || [];
  displayUserData();
}

function clearRegisteredDays() {
  localStorage.removeItem('registeredDays');
  renderCalendar();
}
