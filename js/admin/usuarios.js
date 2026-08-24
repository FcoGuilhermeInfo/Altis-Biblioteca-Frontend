const addUserButton = document.querySelector(".add-user-button");
const modal = document.querySelector(".user-modal-overlay");
const closeModalButton = document.querySelector(".user-modal-close");
const form = document.querySelector(".user-modal-form");
const tableBody = document.querySelector("#users-table-body");
const usersCount = document.querySelector(".users-count");
const pagination = document.querySelector(".pagination");
const searchInput = document.querySelector(".search-box input");

const USERS_PER_PAGE = 10;
let currentPage = 1;
let users = JSON.parse(localStorage.getItem("locbooksUsers")) || [];

users = users.map((user, index) => ({
  ...user,
  id: user.id || Date.now() + index,
  active: user.active !== false,
}));

function saveUsers() {
  localStorage.setItem("locbooksUsers", JSON.stringify(users));
}

function showModal() {
  form.reset();
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function hideModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function getVisibleUsers() {
  const search = searchInput.value.toLowerCase().trim();
  const filteredUsers = users.filter((user) =>
    (user.name || "").toLowerCase().includes(search),
  );
  const firstUser = (currentPage - 1) * USERS_PER_PAGE;

  return {
    filteredUsers,
    pageUsers: filteredUsers.slice(firstUser, firstUser + USERS_PER_PAGE),
    firstUser,
  };
}

function renderTable(pageUsers) {
  tableBody.innerHTML = "";

  pageUsers.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name || "-"}</td>
      <td>${user.cpf || "-"}</td>
      <td>${user.email || "-"}</td>
      <td>${user.telefone || "-"}</td>
      <td class="user-status-cell">
        <span class="status-badge ${user.active ? "" : "inactive"}">
          ${user.active ? "Ativo" : "Inativo"}
        </span>
      </td>
      <td>
        <button class="toggle-user-button" type="button" data-id="${user.id}"
          aria-label="${user.active ? "Desativar" : "Ativar"} usuário"
          aria-pressed="${user.active}">
          <span class="toggle-knob"></span>
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function renderPagination(totalUsers, firstUser) {
  const totalPages = Math.max(1, Math.ceil(totalUsers / USERS_PER_PAGE));
  const lastUser = Math.min(firstUser + USERS_PER_PAGE, totalUsers);

  usersCount.textContent = `Mostrando ${totalUsers ? firstUser + 1 : 0} a ${lastUser} de ${totalUsers} Usuários`;
  pagination.innerHTML = "";

  const previous = document.createElement("button");
  previous.textContent = "← Voltar";
  previous.disabled = currentPage === 1;
  previous.addEventListener("click", () => changePage(currentPage - 1));
  pagination.appendChild(previous);

  for (let page = 1; page <= totalPages; page += 1) {
    if (
      totalPages > 3 &&
      page > 1 &&
      page < totalPages &&
      page !== currentPage
    ) {
      if (!pagination.querySelector(".ellipsis")) {
        const ellipsis = document.createElement("span");
        ellipsis.className = "ellipsis";
        ellipsis.textContent = "...";
        pagination.appendChild(ellipsis);
      }
      continue;
    }

    const pageButton = document.createElement("button");
    pageButton.textContent = page;
    pageButton.setAttribute(
      "aria-current",
      page === currentPage ? "page" : "false",
    );
    pageButton.addEventListener("click", () => changePage(page));
    pagination.appendChild(pageButton);
  }

  const next = document.createElement("button");
  next.textContent = "Próximo →";
  next.disabled = currentPage === totalPages;
  next.addEventListener("click", () => changePage(currentPage + 1));
  pagination.appendChild(next);
}

function renderUsers() {
  const { filteredUsers, pageUsers, firstUser } = getVisibleUsers();
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / USERS_PER_PAGE),
  );
  currentPage = Math.min(currentPage, totalPages);

  renderTable(pageUsers);
  renderPagination(filteredUsers.length, firstUser);
}

function changePage(page) {
  if (page < 1) return;
  currentPage = page;
  renderUsers();
}

addUserButton.addEventListener("click", showModal);
closeModalButton.addEventListener("click", hideModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) hideModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideModal();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const getValue = (name) =>
    form.querySelector(`[name="${name}"]`).value.trim();
  const name = getValue("nome");
  const email = getValue("email");
  const password = form.querySelector('[name="senha"]').value;
  const confirmPassword = form.querySelector('[name="confirmar-senha"]').value;

  if (!name) return alert("Digite o nome do usuário.");
  if (!email) return alert("Digite o e-mail do usuário.");
  if (password.length < 8)
    return alert("A senha deve possuir pelo menos 8 caracteres.");
  if (password !== confirmPassword) return alert("As senhas não coincidem.");

  const emailExists = users.some(
    (user) => (user.email || "").toLowerCase() === email.toLowerCase(),
  );
  if (emailExists) return alert("Este e-mail já está cadastrado.");

  users.push({
    id: Date.now(),
    name,
    dataNascimento: getValue("nascimento"),
    cpf: getValue("cpf"),
    telefone: getValue("telefone"),
    endereco: getValue("endereco"),
    email,
    password,
    active: true,
  });

  saveUsers();
  renderUsers();
  hideModal();
  alert("Usuário cadastrado com sucesso!");
});

searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderUsers();
});

tableBody.addEventListener("click", (event) => {
  const button = event.target.closest(".toggle-user-button");
  if (!button) return;

  const user = users.find((item) => item.id === Number(button.dataset.id));
  if (!user) return;

  user.active = !user.active;
  saveUsers();
  renderUsers();
});

renderUsers();
