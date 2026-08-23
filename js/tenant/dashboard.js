const loggedUser = JSON.parse(localStorage.getItem('locbooksLoggedUser'));
const welcome = document.querySelector('.tenant-welcome');
const logoutButton = document.querySelector('.logout-button');

if (!loggedUser || loggedUser.role !== 'locatario') {
  window.location.href = '../auth/login.html';
} else {
  welcome.textContent = `Olá, ${loggedUser.name}.`;
}

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('locbooksLoggedUser');
  window.location.href = '../auth/login.html';
});
