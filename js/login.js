const form = document.querySelector('.login-form');
const email = document.querySelector('[name="email"]');
const password = document.querySelector('[name="password"]');
const remember = document.querySelector('[name="remember"]');
const message = document.querySelector('.login-message');


let users = JSON.parse(localStorage.getItem('locbooksUsers')) || [];

if (users.length === 0) {
  users.push({
    name: 'teste',
    email: 'teste@locbooks.com',
    password: '123456'
  });

  localStorage.setItem('locbooksUsers', JSON.stringify(users));
}

const savedEmail = localStorage.getItem('locbooksRememberedEmail');

if (savedEmail) {
  email.value = savedEmail;
  remember.checked = true;
}

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const user = users.find(function (item) {
    return item.email === email.value.trim() && item.password === password.value;
  });

  if (!user) {
    message.textContent = 'E-mail ou senha inválidos.';
    message.className = 'login-message error';
    return;
  }

  if (remember.checked) {
    localStorage.setItem('locbooksRememberedEmail', email.value.trim());
  } else {
    localStorage.removeItem('locbooksRememberedEmail');
  }

  localStorage.setItem('locbooksLoggedUser', JSON.stringify(user));
  message.textContent = 'Login realizado com sucesso!';
  message.className = 'login-message success';
  password.value = '';
});
