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
  const day = new Date(document.getElementById('day').value).getDate();

 
  let registeredDays = JSON.parse(localStorage.getItem('registeredDays')) || [];

  
  registeredDays.push(day);

  
  localStorage.setItem('registeredDays', JSON.stringify(registeredDays));

  
  const dayElements = document.querySelectorAll('.calendar-day');
  dayElements.forEach((element, index) => {
      if (index === day) {
          
          element.classList.add('registered-day');
      }
  });

  
  closePopup();
}

var calendario = 
  [
      {
          "usersId": [1,2,3],
      }
  ];


