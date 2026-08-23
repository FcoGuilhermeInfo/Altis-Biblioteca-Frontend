const languageButton = document.querySelector('.language-button');
const languageOverlay = document.querySelector('.language-overlay');
const languageClose = document.querySelector('.language-close');
const languageSave = document.querySelector('.language-save');

function closeLanguageModal() {
  languageOverlay.classList.remove('open');
  languageOverlay.setAttribute('aria-hidden', 'true');
}

function openLanguageModal() {
  languageOverlay.classList.add('open');
  languageOverlay.setAttribute('aria-hidden', 'false');
}

languageButton.addEventListener('click', openLanguageModal);
languageClose.addEventListener('click', closeLanguageModal);
languageSave.addEventListener('click', closeLanguageModal);

languageOverlay.addEventListener('click', event => {
  if (event.target === languageOverlay) closeLanguageModal();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeLanguageModal();
});
