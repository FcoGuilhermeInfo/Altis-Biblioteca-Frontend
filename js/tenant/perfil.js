const loggedUser = JSON.parse(localStorage.getItem("locbooksLoggedUser"));
const users = JSON.parse(localStorage.getItem("locbooksUsers")) || [];
const user = users.find(
  (item) => item.id === loggedUser?.id || item.email === loggedUser?.email,
);

const profileCard = document.querySelector(".profile-card");
const editButton = document.querySelector(".edit-profile-button");
const editOverlay = document.querySelector(".edit-profile-overlay");
const closeEditButton = document.querySelector(".edit-profile-close");
const editForm = document.querySelector(".edit-profile-form");
const confirmationOverlay = document.querySelector(".confirmation-overlay");
const cancelConfirmation = document.querySelector(".cancel-confirmation");
const acceptConfirmation = document.querySelector(".accept-confirmation");

if (!loggedUser || loggedUser.role !== "locatario" || !user) {
  window.location.href = "../auth/login.html";
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR");
}

function setText(selector, value) {
  document.querySelector(selector).textContent = value || "-";
}

function renderProfile() {
  setText(".tenant-name", user.name);
  setText(".tenant-full-name", user.name);
  setText(".tenant-email", user.email);
  setText(".tenant-cpf", user.cpf);
  setText(".tenant-birth-date", formatDate(user.dataNascimento));
  setText(".tenant-phone", user.telefone);
  setText(".tenant-address", user.endereco);
  setText(".tenant-password", "*".repeat((user.password || "").length));
}

function openEditModal() {
  editForm.nome.value = user.name || "";
  editForm.email.value = user.email || "";
  editForm.cpf.value = user.cpf || "";
  editForm.nascimento.value = user.dataNascimento || "";
  editForm.telefone.value = user.telefone || "";
  editForm.endereco.value = user.endereco || "";
  editForm.senhaAtual.value = "";
  editForm.novaSenha.value = "";
  editForm.confirmarSenha.value = "";
  editOverlay.classList.add("open");
  editOverlay.setAttribute("aria-hidden", "false");
}

function closeEditModal() {
  editOverlay.classList.remove("open");
  editOverlay.setAttribute("aria-hidden", "true");
}

function closeConfirmation() {
  confirmationOverlay.classList.remove("open");
  confirmationOverlay.setAttribute("aria-hidden", "true");
}

function saveProfile() {
  user.name = editForm.nome.value.trim();
  user.dataNascimento = editForm.nascimento.value;
  user.telefone = editForm.telefone.value.trim();
  user.endereco = editForm.endereco.value.trim();

  const currentPassword = editForm.senhaAtual.value;
  const newPassword = editForm.novaSenha.value;
  const confirmedPassword = editForm.confirmarSenha.value;

  if (newPassword || confirmedPassword || currentPassword) {
    if (currentPassword !== user.password) {
      alert("A senha atual está incorreta.");
      return;
    }
    if (newPassword.length < 8) {
      alert("A nova senha deve possuir pelo menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmedPassword) {
      alert("As senhas não coincidem.");
      return;
    }
    user.password = newPassword;
  }

  const userIndex = users.findIndex(
    (item) => item.id === user.id || item.email === user.email,
  );
  users[userIndex] = user;
  localStorage.setItem("locbooksUsers", JSON.stringify(users));
  localStorage.setItem(
    "locbooksLoggedUser",
    JSON.stringify({ ...loggedUser, ...user }),
  );
  renderProfile();
  closeConfirmation();
  closeEditModal();
}

editButton.addEventListener("click", openEditModal);
closeEditButton.addEventListener("click", closeEditModal);
editOverlay.addEventListener("click", (event) => {
  if (event.target === editOverlay) closeEditModal();
});

editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!editForm.nome.value.trim()) {
    alert("Digite seu nome completo.");
    return;
  }

  const hasPasswordChange =
    editForm.senhaAtual.value ||
    editForm.novaSenha.value ||
    editForm.confirmarSenha.value;
  if (hasPasswordChange && editForm.novaSenha.value.length < 8) {
    alert("A nova senha deve possuir pelo menos 8 caracteres.");
    return;
  }

  confirmationOverlay.classList.add("open");
  confirmationOverlay.setAttribute("aria-hidden", "false");
});

cancelConfirmation.addEventListener("click", closeConfirmation);
acceptConfirmation.addEventListener("click", saveProfile);

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeEditModal();
  closeConfirmation();
});

renderProfile();
