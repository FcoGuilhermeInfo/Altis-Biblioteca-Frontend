const form = document.querySelector(".login-form");
const email = document.querySelector('[name="email"]');
const password = document.querySelector('[name="password"]');
const remember = document.querySelector('[name="remember"]');
const message = document.querySelector(".login-message");

const ADMIN = {
  name: "admin",
  email: "admin@admin.com",
  password: "12345678",
};
const users = JSON.parse(localStorage.getItem("locbooksUsers")) || [];

const savedEmail = localStorage.getItem("locbooksRememberedEmail");

if (email && savedEmail) {
  email.value = savedEmail;
  if (remember) remember.checked = true;
}

if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const typedEmail = email.value.trim().toLowerCase();
    const typedPassword = password.value;
    const isAdmin =
      typedEmail === ADMIN.email && typedPassword === ADMIN.password;
    const user = users.find(function (item) {
      return (
        (item.email || "").toLowerCase() === typedEmail &&
        item.password === typedPassword
      );
    });

    if (!isAdmin && !user) {
      message.textContent = "E-mail ou senha inválidos.";
      message.className = "login-message error";
      password.value = "";
      return;
    }

    if (remember && remember.checked) {
      localStorage.setItem("locbooksRememberedEmail", email.value.trim());
    } else {
      localStorage.removeItem("locbooksRememberedEmail");
    }

    const loggedUser = isAdmin
      ? { ...ADMIN, role: "admin" }
      : { ...user, role: "locatario" };
    localStorage.setItem("locbooksLoggedUser", JSON.stringify(loggedUser));
    message.textContent = "Login realizado com sucesso!";
    message.className = "login-message success";
    password.value = "";
    window.location.href = isAdmin
      ? "../admin/dashboard.html"
      : "../tenant/dashboard.html";
  });
}
