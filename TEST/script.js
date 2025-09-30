// Module variables.
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
    denySafetyInstructions: "Je ging niet akkoord met de veiligheids- en brandveiligheidsinstructies.\r\nRegistratie werd niet voltooid.",
    notCompleted:      "Registratie werd niet voltooid.",
    fillFieldCorrectly:"Vul het veld correct in",
    alertClearData:    "Bent u zeker dat u de opgeslagen gegevens wenst te wissen?",
    alertDataCleared:  "Opgeslagen gegevens gewist.",
    ok:                "OK",
    cancel:            "Annuleren"
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
    denySafetyInstructions: "Vous n'avez pas accepté les consignes de sécurité et de prévention incendie.\r\nL'enregistrement n'a pas été complété.",
    notCompleted:      "L'enregistrement n'a pas été complété.",
    fillFieldCorrectly:"Veuillez remplir correctement le champ",
    alertClearData:    "Êtes-vous sûr de vouloir effacer les données enregistrées ?",
    alertDataCleared:  "Données sauvegardées effacées.",
    ok:                "OK",
    cancel:            "Annuler"
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
    denySafetyInstructions: "You didn't accept the safety and fire safety instructions.\r\nRegistration was not completed.",
    notCompleted:      "Registration was not completed.",
    fillFieldCorrectly:"Please fill in the field correctly",
    alertClearData:    "Are you sure you want to delete the stored data?",
    alertDataCleared:  "Saved data cleared.",
    ok:                "OK",
    cancel:            "Cancel"
  }
};

// Detect language (default to 'en' if unknown).
const sUserLang = (navigator.language || navigator.userLanguage || "en").toLowerCase();
const langCode = sUserLang.startsWith("nl") ? "nl" : sUserLang.startsWith("fr") ? "fr" : "en";
const t = translations[langCode];

/* ------------------------------------------------------------------ */
/* Reusable modal helpers: alert/confirm/prompt with focus trap        */
/* ------------------------------------------------------------------ */
const modalEl = document.getElementById("modalAlert");
const msgEl = document.getElementById("modalAlertMsg");
const actionsEl = document.getElementById("modalActions");
const promptFieldEl = document.getElementById("modalPromptField");
const promptInputEl = document.getElementById("modalPromptInput");

function getFocusableElements(root) {
  const focusables = root.querySelectorAll(
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), ' +
    'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  return Array.from(focusables).filter(el => {
    // Filter invisible elements
    const style = window.getComputedStyle(el);
    return style.visibility !== "hidden" && style.display !== "none";
  });
}

function openModal({ message, type = "alert", defaultValue = "" }) {
  msgEl.textContent = String(message ?? "");

  // Reset prompt field
  promptFieldEl.hidden = true;
  promptInputEl.value = "";

  // Build actions
  actionsEl.innerHTML = "";

  // Track previously focused element to restore after close
  const previouslyFocused = document.activeElement;

  return new Promise((resolve) => {
    let resolved = false;

    const close = (value) => {
      if (resolved) return;
      resolved = true;

      document.removeEventListener("keydown", onKey);
      modalEl.classList.remove("active");
      actionsEl.innerHTML = "";

      // Restore focus
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        setTimeout(() => previouslyFocused.focus(), 0);
      }

      resolve(value);
    };

    const onKey = (e) => {
      // Focus trap: keep Tab navigation within the modal
      if (e.key === "Tab") {
        const focusables = getFocusableElements(modalEl);
        if (focusables.length > 0) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          const active = document.activeElement;

          if (e.shiftKey) {
            if (active === first || !modalEl.contains(active)) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (active === last) {
              e.preventDefault();
              first.focus();
            }
          }
        } else {
          // If nothing focusable, swallow Tab
          e.preventDefault();
        }
        return;
      }

      // Behavior keys (Enter/Escape/Space)
      if (type === "prompt") {
        if (e.key === "Enter") { e.preventDefault(); close(promptInputEl.value); }
        else if (e.key === "Escape") { e.preventDefault(); close(null); }
        return;
      }
      if (type === "confirm") {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); close(true); }
        else if (e.key === "Escape") { e.preventDefault(); close(false); }
        return;
      }
      // alert
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        close();
      }
    };

    // Create buttons (anchors used so we don't affect global `button{...}` CSS)
    const okBtn = document.createElement("a");
    okBtn.href = "#";
    okBtn.className = "modal-btn";
    okBtn.role = "button";
    okBtn.textContent = t.ok;

    const cancelBtn = document.createElement("a");
    cancelBtn.href = "#";
    cancelBtn.className = "modal-btn outline";
    cancelBtn.role = "button";
    cancelBtn.textContent = t.cancel;

    if (type === "alert") {
      actionsEl.appendChild(okBtn);
      okBtn.addEventListener("click", (e) => { e.preventDefault(); close(); });
    } else if (type === "confirm") {
      actionsEl.appendChild(cancelBtn);
      actionsEl.appendChild(okBtn);
      okBtn.addEventListener("click", (e) => { e.preventDefault(); close(true); });
      cancelBtn.addEventListener("click", (e) => { e.preventDefault(); close(false); });
    } else if (type === "prompt") {
      promptFieldEl.hidden = false;
      promptInputEl.value = defaultValue || "";
      actionsEl.appendChild(cancelBtn);
      actionsEl.appendChild(okBtn);
      okBtn.addEventListener("click", (e) => { e.preventDefault(); close(promptInputEl.value); });
      cancelBtn.addEventListener("click", (e) => { e.preventDefault(); close(null); });
    }

    document.addEventListener("keydown", onKey);

    // Show the modal
    modalEl.classList.add("active");

    // Initial focus target
    setTimeout(() => {
      if (type === "prompt") {
        promptInputEl.focus();
        // place caret at end
        const len = promptInputEl.value.length;
        try { promptInputEl.setSelectionRange(len, len); } catch (_) {}
      } else {
        // Prefer the first focusable action; fallback to container for safety
        const focusables = getFocusableElements(modalEl);
        if (focusables.length) focusables[0].focus();
        else modalEl.focus({ preventScroll: true });
      }
    }, 10);
  });
}

function showAlert(message) {
  return openModal({ message, type: "alert" });
}
function showConfirm(message) {
  return openModal({ message, type: "confirm" });
}
function showPrompt(message, defaultValue = "") {
  return openModal({ message, type: "prompt", defaultValue });
}

/* ------------------------------------------------------------------ */
/* Core logic (native dialogs fully replaced; behavior preserved)      */
/* ------------------------------------------------------------------ */

// Function that starts when the page is loaded.
async function init() {
  // Bind the function deleteCookie to the Button clearData.
  const clearBtn = document.getElementById('clearData');
  if (clearBtn) {
    clearBtn.addEventListener('click', async () => { await deleteCookie('cVisitorThule'); });
  }

  // Change the document and button language.
  document.documentElement.lang = langCode;
  document.getElementById("clearData").innerHTML = t.clearData;

  await checkCookie();
}

// Set the Cookie (synchronous).
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  const expires = "expires=" + d.toUTCString();
  const value = typeof cvalue === 'object' ? JSON.stringify(cvalue) : cvalue;
  document.cookie = `${cname}=${value};${expires};path=/;SameSite=Lax;Secure`;
}

// Retrieve the Cookie.
function getCookie(cCookieName) {
  const name = cCookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      const value = c.substring(name.length, c.length);
      try {
        // If it's a JSON string.
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
  }
  return null;
}

// Check if the Cookie exists, if it doesn't create it.
async function checkCookie() {
  const user = getCookie("cVisitorThule");
  if (user && user.sFirstName && user.sLastName && user.sCompany && user.sForTheAttnOf && user.sMobilePhone && user.sLicensePlate) {
    await showAlert(`${t.welcome1} ${user.sFirstName} ${user.sLastName} ${t.welcome2} ${user.sCompany}!`);
    await showAlert(t.newConcept);
    changeUrl(user.sFirstName, user.sLastName, user.sCompany, user.sForTheAttnOf, user.sMobilePhone, user.sLicensePlate);
  } else {
    const consent = await showConfirm(t.cookies);
    if (consent) {
      const sFirstName     = await promptUntilFilled(t.firstName);      if (sFirstName === null) return;
      const sLastName      = await promptUntilFilled(t.lastName);       if (sLastName === null) return;
      const sCompany       = await promptUntilFilled(t.company);        if (sCompany === null) return;
      const sForTheAttnOf  = await promptUntilFilled(t.forTheAttnOf);   if (sForTheAttnOf === null) return;
      const sMobilePhone   = await promptUntilFilled(t.mobilePhone);    if (sMobilePhone === null) return;
      const sLicensePlate  = await promptUntilFilled(t.licensePlate);   if (sLicensePlate === null) return;

      const accepted = await showConfirm(t.safetyInstructions);
      if (accepted) {
        const userInfo = { sFirstName, sLastName, sCompany, sForTheAttnOf, sMobilePhone, sLicensePlate };
        setCookie("cVisitorThule", userInfo, 365);

        // No cookie delay needed — document.cookie is synchronous.
        await showAlert(t.newConcept);
        changeUrl(sFirstName, sLastName, sCompany, sForTheAttnOf, sMobilePhone, sLicensePlate);
      } else {
        await showAlert(t.denySafetyInstructions);
      }
    } else {
      location.replace("https://forms.office.com/e/SGMqF3SbVq");
    }
  }
}

// Keep prompting until the data is filled in correctly.
async function promptUntilFilled(message) {
  let input;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    input = await showPrompt(message);
    // user canceled
    if (input === null) {
      await showAlert(t.notCompleted);  // Inform user registration not completed.
      return null;
    }
    input = String(input).trim();
    if (input) return input;

    // Inform user that input was empty or invalid.
    await showAlert(`${t.fillFieldCorrectly}:\n${message}`);
  }
}

async function deleteCookie(cname) {
  const proceed = await showConfirm(t.alertClearData);
  if (proceed) {
    const user = getCookie(cname);
    if (user) {
      document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    await showAlert(t.alertDataCleared);
    location.replace('https://ThuleNV.github.io/Bezoekersregistratie/');
  }
}

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

  const iframe = document.getElementsByName('ifrVisitorRegistration')[0];
  if (iframe) {
    iframe.src = site;
  } else {
    // Fallback: navigate if iframe not found
    location.replace(site);
  }
}

init();