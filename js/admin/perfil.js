const loggedUser = JSON.parse(localStorage.getItem('locbooksLoggedUser'));

if (!loggedUser || loggedUser.role !== 'admin') {
  window.location.href = '../auth/login.html';
} else {
  document.querySelector('.admin-name').textContent = loggedUser.name;
  document.querySelector('.admin-full-name').textContent = loggedUser.name;
  document.querySelector('.admin-email').textContent = loggedUser.email;
  document.querySelector('.admin-email').href = `mailto:${loggedUser.email}`;
  document.querySelector('.admin-password').textContent = '*'.repeat(loggedUser.password.length);
}
