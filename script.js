//Module variables.
const translations = {
  nl: {
	clearData: 		"Opgeslagen gegevens wissen",
	welcome1: 		"Welkom terug",
   	welcome2: 		"van",
    	newConcept: 		"Kies altijd 'Nieuw concept' wanneer gevraagd.\r\nScan de QR code en verzend het formulier bij zowel aankomst als bij vertrek.",
    	cookies: 		"Cookies toestaan om uw gegevens voor toekomstige bezoeken te onthouden?",
    	firstName: 		"VOORNAAM:*",
    	lastName: 		"NAAM:*",
    	company: 		"BEDRIJF:*",
    	forTheAttnOf:		"AFSPRAAK MET:*",
    	mobilePhone:		"GSM:*\r\nVoor uw en onze veiligheid, vul uw mobiele nummer correct in! Bedankt.",
    	licensePlate:		"NUMMERPLAAT*",
    	safetyInstructions: 	"Ik verklaar dat ik de veiligheids- en brandveiligheidsinstructies heb gelezen en hiermee akkoord ga.",
    	denySafetyInstructions:	"Je ging niet akkoord met de veiligheids- en brandveiligheidsinstructies.\r\nRegistratie werd niet voltooid.",
	notCompleted:		"Registratie werd niet voltooid.",
	fillFieldCorrectly:	"Vul het veld correct in",
	alertDataCleared:	"Opgeslagen gegevens gewist."
  },
  fr: {
	clearData:		"Effacer les données enregistrées",
    	welcome1:		"Bienvenu de retour",
    	welcome2:		"de",
    	newConcept:		"Choisissez toujours 'Nouveau concept' lorsqu'on vous le demande.\r\nScannez le code QR et soumettez le formulaire à la fois à l'arrivée et au départ.",
    	cookies:		"Autoriser les cookies pour mémoriser vos données lors de prochaines visites ?",
    	firstName:		"PRENOM:*",
    	lastName:		"NOM:*",
    	company:		"SOCIETE:*",
    	forTheAttnOf:		"RENDEZ-VOUS AVEC:*",
    	mobilePhone:		"TELEPHONE PORTABLE:*\r\nPour votre sécurité et la nôtre, veuillez renseigner correctement votre numéro de portable ! Merci.",
    	licensePlate:		"PLAQUE D'IMMATRICULATION:*",
    	safetyInstructions:	"Je déclare avoir pris connaissance des consignes de sécurité et de prévention incendie, et de les accepter.",
    	denySafetyInstructions:	"Vous n'avez pas accepté les consignes de sécurité et de prévention incendie.\r\nL'enregistrement n'a pas été complété.",
	notCompleted:		"L'enregistrement n'a pas été complété.",
	fillFieldCorrectly:	"Veuillez remplir correctement le champ",
	alertDataCleared:	"Données sauvegardées effacées."
  },
  en: {
	clearData:		"Clear saved data",
    	welcome1:		"Welcome back",
    	welcome2:		"from",
    	newConcept:		"Always choose 'New concept' when asked.\r\nScan the QR code and submit the form both upon arrival and departure.",
    	cookies:		"Allow cookies to remember your data for future visits?",
    	firstName:		"FIRST NAME:*",
    	lastName:		"LAST NAME:*",
    	company:		"COMPANY:*",
    	forTheAttnOf:		"FOR THE ATTN OF:*",
    	mobilePhone:		"MOBILE PHONE:*\r\nFor your and our safety, please fill out your mobile number correctly! Thanks.",
    	licensePlate:		"LICENSE PLATE:*",
    	safetyInstructions:	"I hereby declare that I have read and understood the safety and fire safety instructions, and I agree to comply with them.",
    	denySafetyInstructions:	"You didn't accept the safety and fire safety instructions.\r\nRegistration was not completed.",
	notCompleted:		"Registration was not completed.",
	fillFieldCorrectly:	"Please fill in the field correctly",
	alertDataCleared:	"Saved data cleared."
  }
};

//Detect language (default to 'en' if unknown).
const sUserLang = (navigator.language || navigator.userLanguage || "en").toLowerCase();
const langCode = sUserLang.startsWith("nl") ? "nl" : sUserLang.startsWith("fr") ? "fr" : "en";
const t = translations[langCode];

//Function that starts when the page is loaded.
function init()
{
	//Bind the function deleteCookie to the Button clearData.
	document.getElementById('clearData').addEventListener('click', ()=> {deleteCookie('cVisitorThule');});
    	
	//Change the document and button language.
	document.documentElement.lang = langCode;
	document.getElementById("clearData").innerHTML = t.clearData;
	    
    	checkCookie();
}

//Set the Cookie.
function setCookie(cname,cvalue,exdays)
{
	const d = new Date();
  	d.setTime(d.getTime() + (exdays*24*60*60*1000));
  	let expires = "expires=" + d.toUTCString();
  	let value = typeof cvalue === 'object' ? JSON.stringify(cvalue) : cvalue;
  	document.cookie = `${cname}=${value};${expires};path=/`;
}

//Retrieve the Cookie.
function getCookie(cCookieName)
{
	let name = cCookieName + "=";
  	let decodedCookie = decodeURIComponent(document.cookie);
 	let ca = decodedCookie.split(';');
  	for(let i = 0; i < ca.length; i++)
    	{
    		let c = ca[i].trim();
		if (c.indexOf(name) === 0)
        	{
      			let value = c.substring(name.length, c.length);
        		try
        		{
            			//If it's a JSON string.
        			return JSON.parse(value);
			}
            		catch (e)
            		{
        			return value;
      			}
    		}
  	}
	return null;
}

//Check if the Cookie exists, if it doesn't create it.
function checkCookie()
{
	let user = getCookie("cVisitorThule");

  	if (user && user.sFirstName && user.sLastName && user.sCompany && user.sForTheAttnOf && user.sMobilePhone && user.sLicensePlate)
    	{
    		alert(`${t.welcome1} ${user.sFirstName} ${user.sLastName} ${t.welcome2} ${user.sCompany}!`);
        	alert(t.newConcept);
        	changeUrl(user.sFirstName, user.sLastName, user.sCompany, user.sForTheAttnOf, user.sMobilePhone, user.sLicensePlate);
  	}
    	else
    	{
   		let consent = confirm(t.cookies);

        	if (consent)
        	{
    			let sFirstName = promptUntilFilled(t.firstName);
    			if (sFirstName === null) return;

    			let sLastName = promptUntilFilled(t.lastName);
    			if (sLastName === null) return;

   			let sCompany = promptUntilFilled(t.company);
    			if (sCompany === null) return;

    			let sForTheAttnOf = promptUntilFilled(t.forTheAttnOf);
    			if (sForTheAttnOf === null) return;

    			let sMobilePhone = promptUntilFilled(t.mobilePhone);
    			if (sMobilePhone === null) return;

    			let sLicensePlate = promptUntilFilled(t.licensePlate);
    			if (sLicensePlate === null) return;
            
            		if (confirm(t.safetyInstructions))
            		{
    				let userInfo = {sFirstName, sLastName, sCompany, sForTheAttnOf, sMobilePhone, sLicensePlate};

    				setCookie("cVisitorThule", userInfo, 365);

        			alert(t.newConcept);
        			changeUrl(sFirstName, sLastName, sCompany, sForTheAttnOf, sMobilePhone, sLicensePlate);
            		}
            		else
            		{
                		alert(t.denySafetyInstructions);
            		}
        	}
        	else
        	{
            		location.replace("https://forms.office.com/e/SGMqF3SbVq");
        	}
  	}
}

//Keep prompting untill the data is filled in correctly.
function promptUntilFilled(message)
{
    let input;
    while (true)
    {
        input = prompt(message);
        // user canceled
        if (input === null)
	{
		//Alert user that he did not complete the registration.
		alert(t.notCompleted);
		return null;
	}
        input = input.trim();
        if (input) return input;

	// Alert user that input was empty or invalid.
        alert(`${t.fillFieldCorrectly}:\n${message}`);
    }
}

function deleteCookie(cname)
{
	let user = getCookie(""+cname);

  	if (user)
    	{
    		document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    	}
	
	alert(t.alertDataCleared);
    
  	location.replace('https://ThuleNV.github.io/Bezoekersregistratie/');
}

function changeUrl(sFirstName, sLastName, sCompany, sForTheAttnOf, sMobilePhone, sLicensePlate)
{
	let site = 
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

init();