const form = document.querySelector('.recovery-form');
const email = document.querySelector('[name="email"]');
const cpf = document.querySelector('[name="cpf"]');

let users = JSON.parse(localStorage.getItem('locbooksUsers')) || JSON.parse(localStorage.getItem('usuarios')) || [];


if (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const user = users.find(function (item) {
      return item.email === email.value.trim() && item.cpf === cpf.value;
    });

    if (!user) {
      alert('E-mail ou CPF inválidos.');
      return;
    }

    window.location.href = 'alterar-senha.html';
  })
}
