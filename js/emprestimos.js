const addLoanButton = document.querySelector('.add-loan-button');
const modal = document.querySelector('.loan-modal-overlay');
const modalBox = document.querySelector('.loan-modal');
const closeModalButton = document.querySelector('.loan-modal-close');
const form = document.querySelector('.loan-form');
const currentBody = document.querySelector('#current-loans-body');
const historyBody = document.querySelector('#history-loans-body');
const searchInput = document.querySelector('.search-box input');
const currentCount = document.querySelector('.current-loans-count');
const pagination = document.querySelector('.current-pagination');
const userOptions = document.querySelector('#user-options');
const bookOptions = document.querySelector('#book-options');
const confirmation = document.querySelector('.confirmation-overlay');
const confirmationMessage = document.querySelector('.confirmation-message');
const cancelConfirmation = document.querySelector('.cancel-confirmation');
const acceptConfirmation = document.querySelector('.accept-confirmation');
const returnButton = document.querySelector('.return-loan-button');
const showHistoryButton = document.querySelector('.show-history-button');
const fullHistoryOverlay = document.querySelector('.full-history-overlay');
const fullHistoryClose = document.querySelector('.full-history-close');
const fullHistoryBody = document.querySelector('#full-history-body');

const LOANS_PER_PAGE = 10;
let currentPage = 1;
let selectedLoanId = null;
let loans = JSON.parse(localStorage.getItem('locbooksLoans')) || [];
let users = JSON.parse(localStorage.getItem('locbooksUsers')) || [];
let books = JSON.parse(localStorage.getItem('locbooksBooks')) || [];

function saveLoans() {
  localStorage.setItem('locbooksLoans', JSON.stringify(loans));
}

function formatDate(date) {
  if (!date) return '-';
  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR');
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function loadOptions() {
  userOptions.innerHTML = '';
  bookOptions.innerHTML = '';
  users.forEach(user => {
    const option = document.createElement('option');
    option.value = user.name;
    userOptions.appendChild(option);
  });
  books.forEach(book => {
    const option = document.createElement('option');
    option.value = book.title;
    bookOptions.appendChild(option);
  });
}

function getUserName(id) {
  return users.find(user => user.id === id)?.name || '-';
}

function getBookTitle(id) {
  return books.find(book => book.id === id)?.title || '-';
}

function getStatus(loan) {
  return loan.returnedAt ? 'Finalizado' : loan.dueDate < today() ? 'Atrasado' : 'Em andamento';
}

function renderCurrentLoans() {
  const search = searchInput.value.toLowerCase().trim();
  const activeLoans = loans.filter(loan => !loan.returnedAt && getUserName(loan.userId).toLowerCase().includes(search));
  const totalPages = Math.max(1, Math.ceil(activeLoans.length / LOANS_PER_PAGE));
  currentPage = Math.min(currentPage, totalPages);
  const start = (currentPage - 1) * LOANS_PER_PAGE;
  currentBody.innerHTML = '';

  activeLoans.slice(start, start + LOANS_PER_PAGE).forEach(loan => {
    const status = getStatus(loan);
    const row = document.createElement('tr');
    row.innerHTML = `<td>${getUserName(loan.userId)}</td><td>${getBookTitle(loan.bookId)}</td><td>${formatDate(loan.startDate)}</td><td>${formatDate(loan.dueDate)}</td><td>-</td><td><span class="loan-status ${status === 'Atrasado' ? 'late' : ''}">${status}</span></td><td><button class="edit-loan-button" type="button" data-id="${loan.id}" aria-label="Registrar devolução"></button></td>`;
    currentBody.appendChild(row);
  });

  currentCount.textContent = `Mostrando ${activeLoans.length ? start + 1 : 0} a ${Math.min(start + LOANS_PER_PAGE, activeLoans.length)} de ${activeLoans.length} Empréstimos`;
  pagination.innerHTML = '';
  const previous = document.createElement('button');
  previous.textContent = '← Voltar';
  previous.disabled = currentPage === 1;
  previous.onclick = () => changePage(currentPage - 1);
  pagination.appendChild(previous);
  for (let page = 1; page <= totalPages; page += 1) {
    if (totalPages > 3 && page > 1 && page < totalPages && page !== currentPage) continue;
    const button = document.createElement('button');
    button.textContent = page;
    button.setAttribute('aria-current', page === currentPage ? 'page' : 'false');
    button.onclick = () => changePage(page);
    pagination.appendChild(button);
  }
  const next = document.createElement('button');
  next.textContent = 'Próximo →';
  next.disabled = currentPage === totalPages;
  next.onclick = () => changePage(currentPage + 1);
  pagination.appendChild(next);
}

function renderHistory() {
  historyBody.innerHTML = '';
  const completedLoans = loans.filter(loan => loan.returnedAt).reverse();
  const historyToShow = completedLoans.slice(0, 5);
  historyToShow.forEach(loan => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${getUserName(loan.userId)}</td><td>${getBookTitle(loan.bookId)}</td><td>${formatDate(loan.startDate)}</td><td>${formatDate(loan.dueDate)}</td><td>${formatDate(loan.returnedAt)}</td><td><span class="loan-status">Finalizado</span></td>`;
    historyBody.appendChild(row);
  });
  showHistoryButton.textContent = 'Ver histórico completo';
}

function renderFullHistory() {
  fullHistoryBody.innerHTML = '';
  [...loans].sort((firstLoan, secondLoan) => {
    const firstDate = firstLoan.startDate || '';
    const secondDate = secondLoan.startDate || '';
    return secondDate.localeCompare(firstDate);
  }).forEach(loan => {
    const status = getStatus(loan);
    const row = document.createElement('tr');
    row.innerHTML = `<td>${getUserName(loan.userId)}</td><td>${getBookTitle(loan.bookId)}</td><td>${formatDate(loan.startDate)}</td><td>${formatDate(loan.dueDate)}</td><td>${formatDate(loan.returnedAt)}</td><td><span class="loan-status ${status === 'Atrasado' ? 'late' : ''}">${status}</span></td>`;
    fullHistoryBody.appendChild(row);
  });
}

function renderLoans() {
  renderCurrentLoans();
  renderHistory();
}

function changePage(page) {
  if (page < 1) return;
  currentPage = page;
  renderCurrentLoans();
}

function showModal(loan) {
  form.reset();
  selectedLoanId = loan?.id || null;
  modalBox.classList.toggle('returning', Boolean(loan));
  form.usuario.value = loan ? getUserName(loan.userId) : '';
  form.livro.value = loan ? getBookTitle(loan.bookId) : '';
  form.dataEmprestimo.value = loan?.startDate || today();
  form.devolucaoPrevista.value = loan?.dueDate || '';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function hideModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function askConfirmation(message, action) {
  confirmationMessage.textContent = message;
  confirmation.classList.add('open');
  confirmation.setAttribute('aria-hidden', 'false');
  acceptConfirmation.onclick = () => {
    confirmation.classList.remove('open');
    confirmation.setAttribute('aria-hidden', 'true');
    action();
  };
}

cancelConfirmation.onclick = () => {
  confirmation.classList.remove('open');
  confirmation.setAttribute('aria-hidden', 'true');
};
addLoanButton.onclick = () => showModal();
closeModalButton.onclick = hideModal;
modal.onclick = event => { if (event.target === modal) hideModal(); };

document.addEventListener('keydown', event => { if (event.key === 'Escape') hideModal(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && fullHistoryOverlay.classList.contains('open')) fullHistoryClose.click();
});

form.onsubmit = event => {
  event.preventDefault();
  const user = users.find(item => item.name.toLowerCase() === form.usuario.value.trim().toLowerCase());
  const book = books.find(item => item.title.toLowerCase() === form.livro.value.trim().toLowerCase());
  const startDate = form.dataEmprestimo.value;
  const dueDate = form.devolucaoPrevista.value;
  if (!user) return alert('Escolha um usuário cadastrado.');
  if (!book) return alert('Escolha um livro cadastrado.');
  if (!startDate || !dueDate || dueDate < startDate) return alert('Informe datas válidas.');
  if ((book.total || 0) - (book.borrowed || 0) < 1) return alert('Este livro não está disponível.');

  loans.push({ id: Date.now(), userId: user.id, bookId: book.id, startDate, dueDate });
  book.borrowed = (book.borrowed || 0) + 1;
  localStorage.setItem('locbooksBooks', JSON.stringify(books));
  saveLoans();
  renderLoans();
  hideModal();
  alert('Empréstimo registrado com sucesso!');
};

returnButton.onclick = () => {
  const loan = loans.find(item => item.id === selectedLoanId);
  if (!loan) return;
  askConfirmation('Confirma a devolução do livro por parte do locatário?', () => {
    loan.returnedAt = today();
    const book = books.find(item => item.id === loan.bookId);
    if (book) book.borrowed = Math.max(0, (book.borrowed || 0) - 1);
    localStorage.setItem('locbooksBooks', JSON.stringify(books));
    saveLoans();
    renderLoans();
    hideModal();
  });
};

searchInput.oninput = () => { currentPage = 1; renderCurrentLoans(); };
currentBody.onclick = event => {
  const button = event.target.closest('.edit-loan-button');
  if (!button) return;
  const loan = loans.find(item => item.id === Number(button.dataset.id));
  if (loan) showModal(loan);
};

showHistoryButton.onclick = () => {
  renderFullHistory();
  fullHistoryOverlay.classList.add('open');
  fullHistoryOverlay.setAttribute('aria-hidden', 'false');
};

fullHistoryClose.onclick = () => {
  fullHistoryOverlay.classList.remove('open');
  fullHistoryOverlay.setAttribute('aria-hidden', 'true');
};
fullHistoryOverlay.onclick = event => {
  if (event.target === fullHistoryOverlay) fullHistoryClose.click();
};

loadOptions();
renderLoans();
