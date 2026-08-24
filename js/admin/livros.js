const addBookButton = document.querySelector('.add-book-button');
const modal = document.querySelector('.book-modal-overlay');
const closeModalButton = document.querySelector('.book-modal-close');
const form = document.querySelector('.book-form');
const tableBody = document.querySelector('#books-table-body');
const booksCount = document.querySelector('.books-count');
const pagination = document.querySelector('.pagination');
const searchInput = document.querySelector('.search-box input');
const modalBox = document.querySelector('.book-modal');
const modalTitle = document.querySelector('#book-modal-title');
const submitButton = document.querySelector('.save-book-button');
const deleteButton = document.querySelector('.delete-book-button');
const publisherOptions = document.querySelector('#publisher-options');
const confirmation = document.querySelector('.confirmation-overlay');
const confirmationMessage = document.querySelector('#confirmation-message');
const cancelConfirmation = document.querySelector('.cancel-confirmation');
const acceptConfirmation = document.querySelector('.accept-confirmation');

const BOOKS_PER_PAGE = 10;
let currentPage = 1;
let editingBookId = null;
let books = JSON.parse(localStorage.getItem('locbooksBooks')) || [];
const publishers = JSON.parse(localStorage.getItem('locbooksPublishers')) || [];

books = books.map((book, index) => ({ ...book, id: book.id || Date.now() + index }));

function saveBooks() {
  localStorage.setItem('locbooksBooks', JSON.stringify(books));
}

function loadPublisherOptions() {
  publisherOptions.innerHTML = '';
  publishers.forEach(publisher => {
    if (!publisher.name) return;
    const option = document.createElement('option');
    option.value = publisher.name;
    publisherOptions.appendChild(option);
  });
}

function showModal(book) {
  form.reset();
  editingBookId = book ? book.id : null;
  modalBox.classList.toggle('editing', Boolean(book));
  modalTitle.textContent = book ? 'Editar Livro' : 'Cadastrar Livro';
  submitButton.textContent = book ? 'Editar' : 'Cadastrar';

  if (book) {
    form.titulo.value = book.title || '';
    form.autor.value = book.author || '';
    form.ano.value = book.year || '';
    form.editora.value = book.publisher || '';
    form.quantidade.value = book.total || '';
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function hideModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function renderTable(pageBooks) {
  tableBody.innerHTML = '';
  pageBooks.forEach(book => {
    const borrowed = book.borrowed || 0;
    const available = Math.max(0, (book.total || 0) - borrowed);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title || '-'}</td><td>${book.author || '-'}</td><td>${book.year || '-'}</td>
      <td>${book.publisher || '-'}</td><td>${book.total || 0}</td><td>${available}</td><td>${borrowed}</td>
      <td><button class="edit-book-button" type="button" data-id="${book.id}" aria-label="Editar ${book.title || 'livro'}"></button></td>
    `;
    tableBody.appendChild(row);
  });
}

function renderPagination(totalBooks, firstBook) {
  const totalPages = Math.max(1, Math.ceil(totalBooks / BOOKS_PER_PAGE));
  const lastBook = Math.min(firstBook + BOOKS_PER_PAGE, totalBooks);
  booksCount.textContent = `Mostrando ${totalBooks ? firstBook + 1 : 0} a ${lastBook} de ${totalBooks} Livros`;
  pagination.innerHTML = '';

  const previous = document.createElement('button');
  previous.textContent = '← Voltar';
  previous.disabled = currentPage === 1;
  previous.onclick = () => changePage(currentPage - 1);
  pagination.appendChild(previous);

  for (let page = 1; page <= totalPages; page += 1) {
    if (totalPages > 3 && page > 1 && page < totalPages && page !== currentPage) {
      if (!pagination.querySelector('.ellipsis')) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'ellipsis';
        ellipsis.textContent = '...';
        pagination.appendChild(ellipsis);
      }
      continue;
    }
    const pageButton = document.createElement('button');
    pageButton.textContent = page;
    pageButton.setAttribute('aria-current', page === currentPage ? 'page' : 'false');
    pageButton.onclick = () => changePage(page);
    pagination.appendChild(pageButton);
  }

  const next = document.createElement('button');
  next.textContent = 'Próximo →';
  next.disabled = currentPage === totalPages;
  next.onclick = () => changePage(currentPage + 1);
  pagination.appendChild(next);
}

function renderBooks() {
  const search = searchInput.value.toLowerCase().trim();
  const filteredBooks = books.filter(book => (book.title || '').toLowerCase().includes(search));
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / BOOKS_PER_PAGE));
  currentPage = Math.min(currentPage, totalPages);
  const firstBook = (currentPage - 1) * BOOKS_PER_PAGE;
  renderTable(filteredBooks.slice(firstBook, firstBook + BOOKS_PER_PAGE));
  renderPagination(filteredBooks.length, firstBook);
}

function changePage(page) {
  if (page < 1) return;
  currentPage = page;
  renderBooks();
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
addBookButton.onclick = () => showModal();
closeModalButton.onclick = hideModal;
modal.onclick = event => { if (event.target === modal) hideModal(); };
document.addEventListener('keydown', event => { if (event.key === 'Escape') hideModal(); });

form.onsubmit = event => {
  event.preventDefault();
  const bookData = {
    title: form.titulo.value.trim(), author: form.autor.value.trim(), year: form.ano.value,
    publisher: form.editora.value.trim(), total: Number(form.quantidade.value),
  };
  if (!bookData.title) return alert('Digite o título do livro.');
  if (!bookData.author) return alert('Digite o autor do livro.');
  if (!bookData.publisher) return alert('Escolha uma editora cadastrada.');
  const publisherExists = publishers.some(publisher =>
    (publisher.name || '').toLowerCase() === bookData.publisher.toLowerCase()
  );
  if (!publisherExists) return alert('Escolha uma editora cadastrada.');
  if (!bookData.total || bookData.total < 1) return alert('Informe uma quantidade válida.');

  const saveBook = () => {
    if (editingBookId) Object.assign(books.find(book => book.id === editingBookId), bookData);
    else books.push({ id: Date.now(), borrowed: 0, ...bookData });
    saveBooks();
    renderBooks();
    hideModal();
  };
  if (editingBookId) askConfirmation('Você tem certeza que deseja realizar essas alterações?', saveBook);
  else { saveBook(); alert('Livro cadastrado com sucesso!'); }
};

deleteButton.onclick = () => {
  if (!editingBookId) return;
  askConfirmation('Você tem certeza que deseja excluir todos os dados?', () => {
    const loans = JSON.parse(localStorage.getItem('locbooksLoans')) || [];
    const relatedLoans = loans.some(loan => loan.bookId === editingBookId && !loan.returned);
    if (relatedLoans) {
      alert('Não é possível excluir este livro, pois existem empréstimos relacionados a ele.');
      return;
    }
    else {
      books = books.filter(book => book.id !== editingBookId);
      saveBooks();
      renderBooks();
      hideModal();
    }
  });
};

searchInput.oninput = () => { currentPage = 1; renderBooks(); };
tableBody.onclick = event => {
  const button = event.target.closest('.edit-book-button');
  if (!button) return;
  const book = books.find(item => item.id === Number(button.dataset.id));
  if (book) showModal(book);
};

saveBooks();
loadPublisherOptions();
renderBooks();
