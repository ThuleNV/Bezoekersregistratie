/* =========================
   Translations (kept)
   ========================= */
const translations = {
  nl: {
    clearData:         "Opgeslagen gegevens wissen",
    welcome1:          "Welkom terug",
    welcome2:          "van",
    newConcept:        "Verzend het formulier om uw (in-/uit)schrijving af te ronden.",
    cookies:           "Cookies toestaan om uw gegevens voor toekomstige bezoeken te onthouden?",
    firstName:         "VOORNAAM:*",
    lastName:          "NAAM:*",
    company:           "BEDRIJF:*",
    forTheAttnOf:      "AFSPRAAK MET:*",
    mobilePhone:       "GSM:*\r\nVoor uw en onze veiligheid, vul uw mobiele nummer correct in! Bedankt.",
    licensePlate:      "NUMMERPLAAT*",
    safetyInstructions:"Ik verklaar dat ik de veiligheids- en brandveiligheidsinstructies heb gelezen en hiermee akkoord ga.",
    denySafetyInstructions:"Je ging niet akkoord met de veiligheids- en brandveiligheidsinstructies.\r\nRegistratie werd niet voltooid.",
    notCompleted:      "Registratie werd niet voltooid.",
    fillFieldCorrectly:"Vul het veld correct in",
    alertClearData:    "Bent u zeker dat u de opgeslagen gegevens wenst te wissen?",
    alertDataCleared:  "Opgeslagen gegevens gewist."
  },
  fr: {
    clearData:         "Effacer les données enregistrées",
    welcome1:          "Bienvenu de retour",
    welcome2:          "de",
    newConcept:        "Veuillez envoyer le formulaire pour finaliser votre inscription/désinscription.",
    cookies:           "Autoriser les cookies pour mémoriser vos données lors de prochaines visites ?",
    firstName:         "PRENOM:*",
    lastName:          "NOM:*",
    company:           "SOCIETE:*",
    forTheAttnOf:      "RENDEZ-VOUS AVEC:*",
    mobilePhone:       "TELEPHONE PORTABLE:*\r\nPour votre sécurité et la nôtre, veuillez renseigner correctement votre numéro de portable ! Merci.",
    licensePlate:      "PLAQUE D'IMMATRICULATION:*",
    safetyInstructions:"Je déclare avoir pris connaissance des consignes de sécurité et de prévention incendie, et de les accepter.",
    denySafetyInstructions:"Vous n'avez pas accepté les consignes de sécurité et de prévention incendie.\r\nL'enregistrement n'a pas été complété.",
    notCompleted:      "L'enregistrement n'a pas été complété.",
    fillFieldCorrectly:"Veuillez remplir correctement le champ",
    alertClearData:    "Êtes-vous sûr de vouloir effacer les données enregistrées ?",
    alertDataCleared:  "Données sauvegardées effacées."
  },
  en: {
    clearData:         "Clear saved data",
    welcome1:          "Welcome back",
    welcome2:          "from",
    newConcept:        "Please submit the form to complete your check-in/check-out.",
    cookies:           "Allow cookies to remember your data for future visits?",
    firstName:         "FIRST NAME:*",
    lastName:          "LAST NAME:*",
    company:           "COMPANY:*",
    forTheAttnOf:      "FOR THE ATTN OF:*",
    mobilePhone:       "MOBILE PHONE:*\r\nFor your and our safety, please fill out your mobile number correctly! Thanks.",
    licensePlate:      "LICENSE PLATE:*",
    safetyInstructions:"I hereby declare that I have read and understood the safety and fire safety instructions, and I agree to comply with them.",
    denySafetyInstructions:"You didn't accept the safety and fire safety instructions.\r\nRegistration was not completed.",
    notCompleted:      "Registration was not completed.",
    fillFieldCorrectly:"Please fill in the field correctly",
    alertClearData:    "Are you sure you want to delete the stored data?",
    alertDataCleared:  "Saved data cleared."
  }
};

// Detect language (default to 'en' if unknown).
const sUserLang = (navigator.language || navigator.userLanguage || "en").toLowerCase();
const langCode  = sUserLang.startsWith("nl") ? "nl" : sUserLang.startsWith("fr") ? "fr" : "en";
const t = translations[langCode];

/* =========================
   Minimal modal + toast UI
   (alert, confirm, prompt)
   ========================= */
const ui = (() => {
  const modal = document.getElementById("modal");
  const content = document.getElementById("modalContent");
  const backdropOrClose = () => modal.querySelectorAll("[data-close]");
  let restoreFocusTo = null;

  function open(inner, {dismissible = true} = {}) {
    return new Promise(resolve => {
      restoreFocusTo = document.activeElement;
      content.innerHTML = inner;
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");

      // Focusables & trap
      const focusables = modal.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
      const first = focusables[0], last = focusables[focusables.length - 1];
      (first || modal).focus({preventScroll: true});

      function trap(e) {
        if (e.key === "Escape" && dismissible) done(null);
        if (e.key === "Tab" && focusables.length) {
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
      function done(val) {
        modal.classList.add("hidden");
        modal.setAttribute("aria-hidden", "true");
        document.removeEventListener("keydown", trap);
        backdropOrClose().forEach(el => el.removeEventListener("click", onBackdrop));
        if (restoreFocusTo) restoreFocusTo.focus({preventScroll: true});
        resolve(val);
      }
      function onBackdrop(e) { if (dismissible && (e.target.hasAttribute("data-close") || e.currentTarget === e.target)) done(null); }

      document.addEventListener("keydown", trap);
      backdropOrClose().forEach(el => el.addEventListener("click", onBackdrop));

      // Wire [data-value] buttons
      content.querySelectorAll("[data-value]").forEach(btn =>
        btn.addEventListener("click", () => done(btn.getAttribute("data-value")))
      );

      // Wire form submission (for prompt)
      const form = content.querySelector("form");
      if (form) form.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const obj = Object.fromEntries(fd.entries());
        done(obj);
      });
    });
  }

  function alert(message, {title = "Info"} = {}) {
    return open(`
      <h2 id="modalTitle" class="modal__title">${title}</h2>
      <div class="modal__body">${nl2br(message)}</div>
      <div class="modal__actions">
        <button class="btn btn--primary" data-value="ok">OK</button>
      </div>
    `);
  }

  function confirm(message, {title = "Confirm"} = {}) {
    return open(`
      <h2 id="modalTitle" class="modal__title">${title}</h2>
      <div class="modal__body">${nl2br(message)}</div>
      <div class="modal__actions">
        <button class="btn btn--ghost"   data-value="no">Cancel</button>
        <button class="btn btn--primary" data-value="yes">OK</button>
      </div>
    `).then(v => v === "yes");
  }

  // Single-field prompt (per-item popup)
  function prompt(labelText, {defaultValue = "", inputMode = "text", pattern = "", placeholder = "", title = "Input"} = {}) {
    const patternAttr = pattern ? `pattern="${escapeAttr(pattern)}"` : "";
    return open(`
      <h2 id="modalTitle" class="modal__title">${escapeHtml(title)}</h2>
      <form novalidate>
        <div class="form-field">
          <label for="promptInput">${nl2br(labelText)}</label>
          <input id="promptInput" name="value" required
                 inputmode="${escapeAttr(inputMode)}"
                 ${patternAttr}
                 placeholder="${escapeAttr(placeholder)}"
                 value="${escapeAttr(defaultValue)}">
        </div>
        <div class="modal__actions">
          <button type="button" class="btn btn--ghost" data-value="cancel">Cancel</button>
          <button type="submit" class="btn btn--primary">OK</button>
        </div>
      </form>
    `, { dismissible: true }).then(result => {
      if (!result || result === "cancel") return null;
      return (result.value ?? "").trim();
    });
  }

  function toast(message, ms = 2500) {
    const wrap = document.getElementById("toastContainer");
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message.replace(/\s+/g, " ").trim();
    wrap.appendChild(el);
    setTimeout(() => { el.style.opacity = "0"; setTimeout(() => el.remove(), 300); }, ms);
  }

  function nl2br(s){ return escapeHtml(String(s)).replace(/\r?\n/g,"<br>"); }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function escapeAttr(s){ return escapeHtml(s).replace(/"/g,'&quot;'); }

  return { alert, confirm, prompt, toast };
})();

/* =========================
   Cookies (kept)
   ========================= */
function setCookie(cname, cvalue, exdays) {
  const d = new Date(); d.setTime(d.getTime() + (exdays*24*60*60*1000));
  const expires = "expires=" + d.toUTCString();
  const value = typeof cvalue === 'object' ? JSON.stringify(cvalue) : cvalue;
  document.cookie = `${cname}=${value};${expires};path=/;SameSite=Lax;Secure`;
}
function getCookie(cCookieName) {
  const name = cCookieName + "=";
  const decoded = decodeURIComponent(document.cookie);
  const parts = decoded.split(';');
  for (let c of parts) {
    c = c.trim();
    if (c.indexOf(name) === 0) {
      const value = c.substring(name.length);
      try { return JSON.parse(value); } catch { return value; }
    }
  }
  return null;
}

/* =========================
   Helpers mirroring old flow
   ========================= */
async function promptUntilFilled(labelText, options = {}) {
  while (true) {
    const input = await ui.prompt(labelText, options);
    if (input === null) { // user canceled
      await ui.alert(t.notCompleted);
      return null;
    }
    if (input) return input;
    await ui.alert(`${t.fillFieldCorrectly}:\n${labelText}`);
  }
}

/* =========================
   App flow (per-item popups)
   ========================= */
async function init() {
  // Language on html tag + button label
  document.documentElement.lang = langCode;
  const clearBtn = document.getElementById('clearData');
  clearBtn.textContent = t.clearData;

  // Clear data flow
  clearBtn.addEventListener('click', async () => {
    if (await ui.confirm(t.alertClearData)) {
      const user = getCookie('cVisitorThule');
      if (user) document.cookie = "cVisitorThule=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      ui.toast(t.alertDataCleared);
      location.replace('https://ThuleNV.github.io/Bezoekersregistratie/');
    }
  });

  await checkCookie(); // main flow
}

async function checkCookie() {
  const user = getCookie("cVisitorThule");
  if (user && user.sFirstName && user.sLastName && user.sCompany && user.sForTheAttnOf && user.sMobilePhone && user.sLicensePlate) {
    ui.toast(`${t.welcome1} ${user.sFirstName} ${user.sLastName} ${t.welcome2} ${user.sCompany}!`, 3000);
    await ui.alert(t.newConcept);
    changeUrl(user.sFirstName, user.sLastName, user.sCompany, user.sForTheAttnOf, user.sMobilePhone, user.sLicensePlate);
    return;
  }

  const consent = await ui.confirm(t.cookies);
  if (!consent) {
    location.replace("https://forms.office.com/e/SGMqF3SbVq");
    return;
  }

  // Per-item prompts (sequential)
  const sFirstName    = await promptUntilFilled(t.firstName,    { title: "Visitor" });
  if (sFirstName === null) return;

  const sLastName     = await promptUntilFilled(t.lastName,     { title: "Visitor" });
  if (sLastName === null) return;

  const sCompany      = await promptUntilFilled(t.company,      { title: "Company" });
  if (sCompany === null) return;

  const sForTheAttnOf = await promptUntilFilled(t.forTheAttnOf, { title: "Appointment" });
  if (sForTheAttnOf === null) return;

  const sMobilePhone  = await promptUntilFilled(t.mobilePhone,  {
    title: "Contact",
    inputMode: "tel",
    pattern: "[0-9+()\\s-]{6,}",
    placeholder: "+32 470 12 34 56"
  });
  if (sMobilePhone === null) return;

  const sLicensePlate = await promptUntilFilled(t.licensePlate, { title: "Vehicle" });
  if (sLicensePlate === null) return;

  // Safety confirmation (per item: confirm popup)
  const accepted = await ui.confirm(t.safetyInstructions, { title: "Safety" });
  if (!accepted) {
    await ui.alert(t.denySafetyInstructions);
    return;
  }

  // Save and continue
  const userInfo = { sFirstName, sLastName, sCompany, sForTheAttnOf, sMobilePhone, sLicensePlate };
  setCookie("cVisitorThule", userInfo, 365);

  await ui.alert(t.newConcept);
  changeUrl(sFirstName, sLastName, sCompany, sForTheAttnOf, sMobilePhone, sLicensePlate);
}

/* =========================
   Keep your existing changeUrl()
   ========================= */
function changeUrl(sFirstName, sLastName, sCompany, sForTheAttnOf, sMobilePhone, sLicensePlate) {
  const site =
    `https://forms.office.com/Pages/ResponsePage.aspx?` +
    `id=ywyDZZ504kyYh6YE7U14LllFM_ieRV5LvHCLjFnpjx5UMk04VFBDWU1RMUQySzQwOUpHQlQ2SUxCSi4u` +
    `&r01b953a9917c4a25aaa3ef7ebbb3d364=${encodeURIComponent(sFirstName)}` +
    `&r6518a57c214949849e5edf358e5704d8=${encodeURIComponent(sLastName)}` +
    `&r1be4e3ea76f9416cad65f84e718880ef=${encodeURIComponent(sCompany)}` +
    `&re49fd0ad20d34430b025601c16a9d57e=${encodeURIComponent(sForTheAttnOf)}` +
    `&r21fd90a5337d4eaa8d962be8942e194c=${encodeURIComponent(sMobilePhone)}` +
    `&r315d8eb127c640588a49c28f0cc1eb5d=${encodeURIComponent(sLicensePlate)}` +
    `&r6027fdc8f9d4412e93d99ef17c6dcb2b=%22Ik%20verklaar%20dat%20ik%20de%C2%A0veiligheids-%20en%20brandveiligheidsinstructies%20heb%20gelezen%20en%20hiermee%20akkoord%20ga.%22` +
    `&embed=true`;
  document.getElementsByName('ifrVisitorRegistration')[0].src = site;
}

// Start the app
init();