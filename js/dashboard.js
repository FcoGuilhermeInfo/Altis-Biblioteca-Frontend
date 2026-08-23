const books = JSON.parse(localStorage.getItem('locbooksBooks')) || [];
const publishers = JSON.parse(localStorage.getItem('locbooksPublishers')) || [];
const users = JSON.parse(localStorage.getItem('locbooksUsers')) || [];
const loans = JSON.parse(localStorage.getItem('locbooksLoans')) || [];

function formatDate(date) {
  if (!date) return '-';
  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR');
}

function getUserName(id) {
  return users.find(user => user.id === id)?.name || '-';
}

function getBook(bookId) {
  return books.find(book => book.id === bookId);
}

function isThisMonth(date) {
  if (!date) return false;
  const value = new Date(`${date}T00:00:00`);
  const now = new Date();
  return value.getMonth() === now.getMonth() && value.getFullYear() === now.getFullYear();
}

function setSummary(name, title, value, description) {
  const card = document.querySelector(`[data-summary="${name}"]`);
  card.querySelector('.summary-title').textContent = title;
  card.querySelector('.summary-copy strong').textContent = value;
  card.querySelector('.summary-copy small').textContent = description;
}

function renderSummary() {
  const monthlyLoans = loans.filter(loan => isThisMonth(loan.startDate));
  setSummary('books', 'Total de Livros', books.length, 'livros cadastrados');
  setSummary('publishers', 'Total de Editoras', publishers.length, 'editoras cadastradas');
  setSummary('loans', 'Total de Empréstimos', monthlyLoans.length, 'este mês');
  setSummary('users', 'Total de Usuários', users.length, 'usuários cadastrados');
}

function getMonthlyRanking() {
  const totals = {};
  loans.filter(loan => isThisMonth(loan.startDate)).forEach(loan => {
    totals[loan.bookId] = (totals[loan.bookId] || 0) + 1;
  });
  return Object.entries(totals)
    .map(([bookId, count]) => ({ book: getBook(Number(bookId)), count }))
    .filter(item => item.book)
    .sort((first, second) => second.count - first.count)
    .slice(0, 3);
}

function renderLatestLoan() {
  const latestLoan = [...loans].sort((first, second) =>
    (second.startDate || '').localeCompare(first.startDate || '')
  )[0];
  if (!latestLoan) return;

  const book = getBook(latestLoan.bookId);
  document.querySelector('.latest-book-title').textContent = book?.title || '-';
  document.querySelector('.latest-book-author').textContent = getUserName(latestLoan.userId);
  document.querySelector('.latest-loan-date').textContent = formatDate(latestLoan.startDate);
  document.querySelector('.latest-due-date').textContent = formatDate(latestLoan.dueDate);
}

function renderPopularBook(ranking) {
  if (!ranking.length) return;
  const mostPopular = ranking[0];
  document.querySelector('.popular-book-title').textContent = mostPopular.book.title;
  document.querySelector('.popular-book-author').textContent = mostPopular.book.author || '';
  document.querySelector('.popular-book-count').textContent = mostPopular.count;
}

function renderChart(ranking) {
  const chart = document.querySelector('.books-chart');
  const max = ranking[0]?.count || 1;
  if (!ranking.length) {
    chart.textContent = 'Nenhum empréstimo neste mês';
    return;
  }

  ranking.forEach(item => {
    const line = document.createElement('div');
    line.className = 'chart-line';
    line.innerHTML = `<strong>${item.book.title}</strong><span class="chart-bar" style="width: ${(item.count / max) * 100}%"></span><b>${item.count}</b>`;
    chart.appendChild(line);
  });
}

renderSummary();
renderLatestLoan();
const ranking = getMonthlyRanking();
renderPopularBook(ranking);
renderChart(ranking);
