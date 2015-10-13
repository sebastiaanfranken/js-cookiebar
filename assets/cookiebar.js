
/**
 * Plugin options. Customize these to your hearts content
 *
 * @var array
 */
var defaults = {

	/*
	 * This is the banenr that's shown to the user. Put something useful here
	 */
	banner: "Deze site maakt gebruik van cookies. Gaat u hiermee akkoord?",

	/*
	 * The "yes" button label
	 */
	acceptButtonLabel: "Ja",

	/*
	 * The "no" button label
	 */
	declineButtonLabel: "Nee",

	/*
	 * Do you have a privacy policy?
	 */
	usePrivacyPolicy: true,

	/*
	 * Privacy policy label
	 */
	privacyPolicyLabel: "Privacybeleid",

	/*
	 * If so, where is it at?
	 */
	privacyPolicyURL: "/pagina/privacy"
};

/**
 * The states of the EU this is required in
 *
 * @var array
 */

var cookieLawStates = [
	'BE',
	'BG',
	'CZ',
	'DK',
	'DE',
	'EE',
	'IE',
	'EL',
	'ES',
	'FR',
	'IT',
	'CY',
	'LV',
	'LT',
	'LU',
	'HU',
	'MT',
	'NL',
	'AT',
	'PL',
	'PT',
	'RO',
	'SI',
	'SK',
	'FI',
	'SE',
	'GB'
];

function setupCookiebar()
{
	if(getCookie() == 'CookieDisallowed')
	{
		removeCookies();
		setCookie('cookiebar', 'CookieDisallowed');
	}

	/*
	 * Only show the bar when it's needed, so do a AJAX request to a 3rd party service
	 * to check where the user is from
	 */
	var checkEurope = new XMLHttpRequest();
	checkEurope.open("GET", "//www.telize.com/geoip", true);

	checkEurope.addEventListener('readystatechange', function() {
		if(checkEurope.readyState === 4 && checkEurope.status === 200)
		{
			clearTimeout(xmlHttpTimeout);

			var country = JSON.parse(checkEurope.responseText).country_code;

			if(cookieLawStates.indexOf(country) > -1 && (document.cookie.length >= 0 || window.localStorage.length >= 0))
			{
				var accepted = getCookie();

				if(accepted === undefined)
				{
					startup();
				}
			}
		}
	});

	checkEurope.send();

	/*
	 * Using an external service can take some time.
	 * If it takes > 1 second just start normally
	 */
	var xmlHttpTimeout = setTimeout(function() {
		checkEurope.abort();

		if(document.cookie.length >= 0 || window.localStorage.length >= 0)
		{
			var accepted = getCookie();
			if(accepted === undefined)
			{
				startup();
			}
		}
	}, 1500);

	/*
	 * Load all requires files and create the HTML
	 */
	function startup()
	{
		var body = document.querySelector('body');

		/*
		 * The outside wrapper div
		 */
		var cookiebarWrapper = document.createElement('div');
		cookiebarWrapper.classList.add('cookiebar-wrapper');

		/*
		 * The inner div
		 */
		var cookiebar = document.createElement('div');
		cookiebar.classList.add('cookiebar');

		/*
		 * The message
		 */
		var message = document.createElement('p');
		message.innerText = defaults.banner;

		/*
		 * Append the message to the cookiebar
		 */
		cookiebar.appendChild(message);

		/*
		 * Link to the privacy policy
		 */
		if(defaults.usePrivacyPolicy === true)
		{
			var privacyLink = document.createElement('a');
			privacyLink.innerText = defaults.privacyPolicyLabel;
			privacyLink.setAttribute('href', defaults.privacyPolicyURL);
		}

		/*
		 * The yes and no buttons
		 */
		var acceptButton = document.createElement('a');
		acceptButton.classList.add('cookiebar-accept');
		acceptButton.innerText = defaults.acceptButtonLabel;
		acceptButton.setAttribute('href', '#');

		var declineButton = document.createElement('a');
		declineButton.classList.add('cookiebar-decline');
		declineButton.innerText = defaults.declineButtonLabel;
		declineButton.setAttribute('href', '#');

		/*
		 * Create a button wrapper div
		 */
		var buttonWrapper = document.createElement('div');
		buttonWrapper.classList.add('cookiebar-button-wrapper');

		if(defaults.usePrivacyPolicy === true)
		{
			buttonWrapper.appendChild(privacyLink);
		}

		buttonWrapper.appendChild(acceptButton);
		buttonWrapper.appendChild(declineButton);

		/*
		 * Append the button wrapper to the cookiebar
		 */
		cookiebar.appendChild(buttonWrapper);

		/*
		 * Append the inner div to the outside wrapper div
		 */
		cookiebarWrapper.appendChild(cookiebar);

		/*
		 * Append the outside wrapper div to the body
		 */
		body.appendChild(cookiebarWrapper);

		/*
		 * Start listening to events
		 */
		setEventListeners();

		/*
		 * Reveal the bar
		 */
		setTimeout(function() {
			cookiebarWrapper.classList.add('cookiebar-visible');
		}, 250);
	}

	/*
	 * Removes the cookiebar after it's done
	 */
	function removeCookiebar()
	{
		var wrapper = document.querySelector('div.cookiebar-wrapper');

		wrapper.classList.remove('cookiebar-visible');

		setTimeout(function() {
			document.querySelector('body').removeChild(wrapper);
		}, 500);
	}

	/*
	 * Get cookiebars cookie if it's available
	 */
	function getCookie()
	{
		var cookieValue = document.cookie.match(/(;)?cookiebar=([^;]*);?/);

		if(cookieValue === null)
		{
			return undefined;
		}
		else
		{
			return decodeURI(cookieValue)[2];
		}
	}

	/*
	 * Set the cookie
	 */
	function setCookie(name, value)
	{
		var exdays = 30;
		var exdate = new Date();

		exdate.setDate(exdate.getDate() + parseInt(exdays));

		var cValue = encodeURI(value) + ((exdays === null) ? '' : '; expires=' + exdate.toUTCString() + ';path=/');
    	document.cookie = name + '=' + cValue;
	}

	/*
	 * Removes all cookies and empties the users' local storage
	 */
	function removeCookies()
	{
		document.cookie.split(';').forEach(function(c) {
			document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
		});

		localStorage.clear();
	}

	/*
	 * Listen to events
	 */
	function setEventListeners()
	{
		/*
		 * Accept button
		 */
		document.querySelector('a.cookiebar-accept').addEventListener('click', function(event) {
			setCookie('cookiebar', 'CookieAllowed');
			removeCookiebar();

			event.preventDefault();
		});


		/*
		 * Decline button
		 */
		document.querySelector('a.cookiebar-decline').addEventListener('click', function(event) {
			removeCookies();
			setCookie('cookiebar', 'CookieDisallowed');
			removeCookiebar();

			event.preventDefault();
		});
	}
}

document.addEventListener('DOMContentLoaded', function() {
	setupCookiebar();
});
