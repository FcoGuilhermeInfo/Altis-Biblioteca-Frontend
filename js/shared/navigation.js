function initializeNavigation(options = {}) {
  const settings = {
    buttonSelector: '.profile-menu',
    panelSelector: '.profile-panel',
    nameSelector: '.profile-name',
    logoutSelector: '.logout-button',
    logoutUrl: '../auth/login.html',
    ...options
  };

  const profileButton = document.querySelector(settings.buttonSelector);
  const profilePanel = document.querySelector(settings.panelSelector);
  const profileName = document.querySelector(settings.nameSelector);
  const logoutButton = document.querySelector(settings.logoutSelector);

  if (!profileButton || !profilePanel) return;

  const loggedUser = JSON.parse(localStorage.getItem('locbooksLoggedUser'));
  const users = JSON.parse(localStorage.getItem('locbooksUsers')) || [];
  const currentUser = loggedUser?.role === 'locatario'
    ? users.find(user => user.id === loggedUser.id || user.email === loggedUser.email) || loggedUser
    : loggedUser;

  if (profileName) {
    profileName.textContent = currentUser?.name || 'Usuário';
  }

  function closeProfilePanel() {
    profilePanel.classList.remove('open');
    profileButton.setAttribute('aria-expanded', 'false');
    profilePanel.setAttribute('aria-hidden', 'true');
  }

  profileButton.addEventListener('click', function () {
    const isOpen = profilePanel.classList.toggle('open');
    profileButton.setAttribute('aria-expanded', String(isOpen));
    profilePanel.setAttribute('aria-hidden', String(!isOpen));
  });

  document.addEventListener('click', function (event) {
    if (!profilePanel.contains(event.target) && !profileButton.contains(event.target)) {
      closeProfilePanel();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeProfilePanel();
  });

  if (logoutButton) {
    logoutButton.addEventListener('click', function () {
      localStorage.removeItem('locbooksLoggedUser');
      window.location.href = settings.logoutUrl;
    });
  }
}