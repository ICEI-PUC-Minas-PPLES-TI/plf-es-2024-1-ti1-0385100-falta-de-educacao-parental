const monthYearDisplay = document.getElementById('monthYear');
const daysDisplay = document.getElementById('days');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

let currentDate = new Date();

prevButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();

const popup = document.getElementById('popup');
const registerButton = document.getElementById('btnlembrete');

registerButton.addEventListener('click', () => {
  popup.style.display = 'block';
});

function closePopup() {
  popup.style.display = 'none';
}

function confirmRegistration() {
  const date = new Date(document.getElementById('day').value);
  const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  let registeredDays = JSON.parse(localStorage.getItem('registeredDays')) || [];

  registeredDays.push(dateStr);

  localStorage.setItem('registeredDays', JSON.stringify(registeredDays));

  renderCalendar();

  closePopup();
}
