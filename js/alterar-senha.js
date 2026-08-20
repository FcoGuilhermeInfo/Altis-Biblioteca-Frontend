const form = document.querySelector('.change-form');
const password = document.querySelector('[name="password"]');
const confirmPassword = document.querySelector('[name="confirm-password"]');

let loggedUser = JSON.parse(localStorage.getItem('locbooksLoggedUser'));
let users = JSON.parse(localStorage.getItem('locbooksUsers')) || JSON.parse(localStorage.getItem('usuarios')) || [];

document.querySelector('.user-name').innerHTML = '<strong>Usuário:</strong> ' + loggedUser.name;

if (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    
    const user = users.find(function (item) {
      return item.password === confirmPassword.value;
    });

    if (!user) {
      alert('As senhas não coincidem.');
      return;
    }

    if (loggedUser.password === password.value) {
        alert('A nova senha não pode ser igual à senha antiga.');
        return;
    }

    if (password.value.length < 8) {
      alert('A senha deve possuir pelo menos 8 caracteres.');
      return;
    }

    loggedUser.password = password.value;
    localStorage.setItem('locbooksLoggedUser', JSON.stringify(loggedUser));

    const userIndex = users.findIndex(function (item) {
      return item.id === loggedUser.id || item.email === loggedUser.email;
    });

    if (userIndex !== -1) {
      users[userIndex].password = password.value;
      localStorage.setItem('locbooksUsers', JSON.stringify(users));
    }

    alert('Senha alterada com sucesso!');
    window.location.href = 'login.html';
  });
}