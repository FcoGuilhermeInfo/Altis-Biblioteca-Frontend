const addPublisherButton = document.querySelector('.add-publisher-button');
const modal = document.querySelector('.publisher-modal-overlay');
const closeModalButton = document.querySelector('.publisher-modal-close');
const form = document.querySelector('.publisher-form');
const tableBody = document.querySelector('#publishers-table-body');
const publishersCount = document.querySelector('.publishers-count');
const pagination = document.querySelector('.pagination');
const searchInput = document.querySelector('.search-box input');
const modalTitle = document.querySelector('#publisher-modal-title');
const submitButton = document.querySelector('.save-publisher-button');
const deleteButton = document.querySelector('.delete-publisher-button');
const confirmation = document.querySelector('.confirmation-overlay');
const confirmationMessage = document.querySelector('#confirmation-message');
const cancelConfirmation = document.querySelector('.cancel-confirmation');
const acceptConfirmation = document.querySelector('.accept-confirmation');

const PUBLISHERS_PER_PAGE = 10;
let currentPage = 1;
let editingPublisherId = null;
let publishers = JSON.parse(localStorage.getItem('locbooksPublishers')) || [];

publishers = publishers.map((publisher, index) => ({
  ...publisher,
  id: publisher.id || Date.now() + index,
}));

function savePublishers() {
  localStorage.setItem('locbooksPublishers', JSON.stringify(publishers));
}

function showModal(publisher) {
  form.reset();
  editingPublisherId = publisher ? publisher.id : null;
  document.querySelector('.publisher-modal').classList.toggle('editing', Boolean(publisher));
  modalTitle.textContent = publisher ? 'Editar Editora' : 'Cadastrar Editora';
  submitButton.textContent = publisher ? 'Salvar' : 'Cadastrar';

  if (publisher) {
    form.nome.value = publisher.name || '';
    form.email.value = publisher.email || '';
    form.telefone.value = publisher.telefone || '';
    form.site.value = publisher.site || '';
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function hideModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function renderTable(pagePublishers) {
  tableBody.innerHTML = '';

  pagePublishers.forEach(publisher => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${publisher.name || '-'}</td>
      <td>${publisher.email || '-'}</td>
      <td>${publisher.telefone || '-'}</td>
      <td>${publisher.site || '-'}</td>
      <td>
        <button class="edit-publisher-button" type="button" data-id="${publisher.id}"
          aria-label="Editar ${publisher.name || 'editora'}"></button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function renderPagination(totalPublishers, firstPublisher) {
  const totalPages = Math.max(1, Math.ceil(totalPublishers / PUBLISHERS_PER_PAGE));
  const lastPublisher = Math.min(firstPublisher + PUBLISHERS_PER_PAGE, totalPublishers);

  publishersCount.textContent = `Mostrando ${totalPublishers ? firstPublisher + 1 : 0} a ${lastPublisher} de ${totalPublishers} Editoras`;
  pagination.innerHTML = '';

  const previous = document.createElement('button');
  previous.textContent = '← Voltar';
  previous.disabled = currentPage === 1;
  previous.addEventListener('click', () => changePage(currentPage - 1));
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
    pageButton.addEventListener('click', () => changePage(page));
    pagination.appendChild(pageButton);
  }

  const next = document.createElement('button');
  next.textContent = 'Próximo →';
  next.disabled = currentPage === totalPages;
  next.addEventListener('click', () => changePage(currentPage + 1));
  pagination.appendChild(next);
}

function renderPublishers() {
  const search = searchInput.value.toLowerCase().trim();
  const filteredPublishers = publishers.filter(publisher =>
    (publisher.name || '').toLowerCase().includes(search)
  );
  const totalPages = Math.max(1, Math.ceil(filteredPublishers.length / PUBLISHERS_PER_PAGE));
  currentPage = Math.min(currentPage, totalPages);
  const firstPublisher = (currentPage - 1) * PUBLISHERS_PER_PAGE;
  const pagePublishers = filteredPublishers.slice(firstPublisher, firstPublisher + PUBLISHERS_PER_PAGE);

  renderTable(pagePublishers);
  renderPagination(filteredPublishers.length, firstPublisher);
}

function changePage(page) {
  if (page < 1) return;
  currentPage = page;
  renderPublishers();
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

cancelConfirmation.addEventListener('click', () => {
  confirmation.classList.remove('open');
  confirmation.setAttribute('aria-hidden', 'true');
});

addPublisherButton.addEventListener('click', () => showModal());
closeModalButton.addEventListener('click', hideModal);
modal.addEventListener('click', event => {
  if (event.target === modal) hideModal();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') hideModal();
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const name = form.nome.value.trim();
  const email = form.email.value.trim();
  const telefone = form.telefone.value.trim();
  const site = form.site.value.trim();

  if (!name) return alert('Digite o nome da editora.');
  if (!email) return alert('Digite o e-mail da editora.');

  const emailExists = publishers.some(publisher =>
    publisher.id !== editingPublisherId &&
    (publisher.email || '').toLowerCase() === email.toLowerCase()
  );
  if (emailExists) return alert('Este e-mail já está cadastrado.');

  const savePublisher = () => {
    const publisherData = { name, email, telefone, site };
    if (editingPublisherId) {
      const publisher = publishers.find(item => item.id === editingPublisherId);
      Object.assign(publisher, publisherData);
    } else {
      publishers.push({ id: Date.now(), ...publisherData });
    }
    savePublishers();
    renderPublishers();
    hideModal();
  };

  if (editingPublisherId) {
    askConfirmation('Você tem certeza que deseja realizar essas alterações?', savePublisher);
  } else {
    savePublisher();
    alert('Editora cadastrada com sucesso!');
  }
});

deleteButton.addEventListener('click', () => {
  if (!editingPublisherId) 
    return;
  askConfirmation('Você tem certeza que deseja excluir todos os dados?', () => {
    const relatedBooks = books.some(book => book.publisherId === editingPublisherId);
    if (relatedBooks) {
      alert('Não é possível excluir esta editora, pois existem livros relacionados a ela.');
      return;
    }
    publishers = publishers.filter(publisher => publisher.id !== editingPublisherId);
    savePublishers();
    renderPublishers();
    hideModal();
  });
});

searchInput.addEventListener('input', () => {
  currentPage = 1;
  renderPublishers();
});

tableBody.addEventListener('click', event => {
  const button = event.target.closest('.edit-publisher-button');
  if (!button) return;

  const publisher = publishers.find(item => item.id === Number(button.dataset.id));
  if (publisher) showModal(publisher);
});

savePublishers();
renderPublishers();
