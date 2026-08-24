const loggedUser = JSON.parse(localStorage.getItem("locbooksLoggedUser"));
const logoutButton = document.querySelector(".logout-button");
const users = JSON.parse(localStorage.getItem("locbooksUsers")) || [];
const books = JSON.parse(localStorage.getItem("locbooksBooks")) || [];
const loans = JSON.parse(localStorage.getItem("locbooksLoans")) || [];

if (!loggedUser || loggedUser.role !== "locatario") {
  window.location.href = "../auth/login.html";
}

const user = users.find(
  (item) => item.id === loggedUser?.id || item.email === loggedUser?.email,
);
const myLoans = loans.filter((loan) => loan.userId === user?.id);
const activeLoans = myLoans.filter((loan) => !loan.returnedAt);

function getBook(loan) {
  return books.find((book) => book.id === loan.bookId);
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR");
}

function getStatus(loan) {
  if (loan.returnedAt) return "Finalizado";

  const today = new Date().toISOString().slice(0, 10);
  return loan.dueDate < today ? "Atrasado" : "Em andamento";
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function renderSummary() {
  const nextLoan = [...activeLoans].sort((first, second) =>
    first.dueDate.localeCompare(second.dueDate),
  )[0];
  const latestLoan = [...myLoans].sort((first, second) =>
    second.startDate.localeCompare(first.startDate),
  )[0];

  setText(".tenant-name", loggedUser.name);
  setText(".borrowed-count", `${activeLoans.length}/5`);
  setText(".next-return-date", nextLoan ? formatDate(nextLoan.dueDate) : "-");
  setText(
    ".latest-book-title",
    latestLoan ? getBook(latestLoan)?.title || "-" : "-",
  );
  setText(
    ".latest-book-date",
    latestLoan
      ? `Emprestado em: ${formatDate(latestLoan.startDate)}`
      : "Nenhum empréstimo registrado",
  );
}

function renderLoans() {
  const body = document.querySelector("#tenant-loans-body");
  body.innerHTML = "";

  activeLoans.forEach((loan) => {
    const book = getBook(loan);
    const status = getStatus(loan);
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${loggedUser.name}</td>
      <td>${book?.title || "-"}</td>
      <td>${formatDate(loan.startDate)}</td>
      <td>${formatDate(loan.dueDate)}</td>
      <td>-</td>
      <td>
        <span class="tenant-status ${status === "Atrasado" ? "late" : ""}">
          ${status}
        </span>
      </td>
    `;

    body.appendChild(row);
  });

  if (!activeLoans.length) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td colspan="6" class="empty-loans">
        Você não possui empréstimos ativos.
      </td>
    `;
    body.appendChild(row);
  }
}

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("locbooksLoggedUser");
  window.location.href = "../auth/login.html";
});

renderSummary();
renderLoans();
