const languageButton = document.querySelector(".language-button");

if (languageButton) {
  let languageOverlay = document.querySelector(".language-overlay");

  if (!languageOverlay) {
    languageOverlay = document.createElement("div");
    languageOverlay.className = "language-overlay";
    languageOverlay.setAttribute("aria-hidden", "true");
    languageOverlay.innerHTML = `
      <section class="language-modal" role="dialog" aria-modal="true" aria-labelledby="language-title">
        <button class="language-close" type="button" aria-label="Fechar idiomas">&times;</button>
        <h2 id="language-title">Idiomas</h2>
        <label class="language-option"><input type="radio" name="language" checked><span class="language-flag" aria-hidden="true"><img src="../../assets/icon-bra.svg" alt=""></span><strong>Português</strong></label>
        <label class="language-option"><input type="radio" name="language"><span class="language-flag" aria-hidden="true"><img src="../../assets/icon-eua.svg" alt=""></span><strong>Inglês</strong></label>
        <label class="language-option"><input type="radio" name="language"><span class="language-flag" aria-hidden="true"><img src="../../assets/icon-spa.svg" alt=""></span><strong>Espanhol</strong></label>
        <button class="language-save" type="button">Salvar</button>
      </section>
    `;
    document.body.appendChild(languageOverlay);
  }

  const languageClose = languageOverlay.querySelector(".language-close");
  const languageSave = languageOverlay.querySelector(".language-save");
  const flags = {
    Português: "icon-bra.svg",
    Inglês: "icon-eua.svg",
    Espanhol: "icon-spa.svg",
  };

  languageOverlay.querySelectorAll(".language-option").forEach((option) => {
    const label = option.querySelector("strong")?.textContent.trim();
    const flag = option.querySelector(".language-flag");
    if (flag && flags[label]) {
      flag.innerHTML = `<img src="../../assets/${flags[label]}" alt="" />`;
    }
  });

  function closeLanguageModal() {
    languageOverlay.classList.remove("open");
    languageOverlay.setAttribute("aria-hidden", "true");
  }

  function openLanguageModal() {
    languageOverlay.classList.add("open");
    languageOverlay.setAttribute("aria-hidden", "false");
  }

  languageButton.addEventListener("click", openLanguageModal);
  languageClose.addEventListener("click", closeLanguageModal);
  languageSave.addEventListener("click", closeLanguageModal);

  languageOverlay.addEventListener("click", (event) => {
    if (event.target === languageOverlay) closeLanguageModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLanguageModal();
  });
}
