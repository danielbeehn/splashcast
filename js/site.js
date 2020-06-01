/* -------------------------------------------------------
JAVASCRIPT CHECK
------------------------------------------------------- */

document.querySelector("#error").style.display = "none";

/* -------------------------------------------------------
GLOBAL VARIABLES
------------------------------------------------------- */

let image = "";
let forecast = "";

/* -------------------------------------------------------
PAGE ELEMENTS
------------------------------------------------------- */

const menu = document.querySelector("#menu");
const menuContent = document.querySelector("#menu-content");
const menuCloseBtn = document.querySelector("#menu-close-btn");
const currentLoc = document.querySelector("#current-loc");
const changeLoc = document.querySelector("#change-loc");
const useMetric = document.querySelector("#use-metric");
const useHD = document.querySelector("#use-hd");
const forecastScrn = document.querySelector("#forecast");
const menuToggle = document.querySelector("#menu-toggle");
const alerts = document.querySelector("#alerts");
const alertCloseBtn = document.querySelector("#alert-close-btn");
const alertContent = document.querySelector("#alert-content p");
const forecastIcon = document.querySelector("#forecast-icon");
const mainHeading = document.querySelector("#main-heading span");
const feelsLike = document.querySelector("#feelslike span");
const wind = document.querySelector("#wind span");
const precip = document.querySelector("#precip span");
const pressure = document.querySelector("#pressure span");
const highTemp = document.querySelector("#high span");
const lowTemp = document.querySelector("#low span");
const imgCredits = document.querySelector("#img-credits");
const bgImage = document.querySelector("#background");
const intro = document.querySelector("#intro");
const errorMsg = document.querySelector("#error");
const usrLoc = document.querySelector("#usr-loc");
const locSubmit = document.querySelector("#loc-submit");
const introForm = document.querySelector("#intro form");


/* -------------------------------------------------------
FETCH CONTENT
------------------------------------------------------- */

async function fetchData(url) {
	const response = await fetch(url);
	const data = await response.json();
	return data;
}

/* -------------------------------------------------------
LOAD CONTENT
------------------------------------------------------- */

function loadContent(loc) {
	Promise.all([
		fetchData("https://api.unsplash.com/photos/random/?query=nature&client_id=5DjUVQVPU9Qadwxu-t_7gVGyCRmRLk1rpKyntGLux5I"),
		fetchData("http://api.weatherapi.com/v1/forecast.json?key=f1263c7d49ab471fb6500307202805&q=" + loc + "&days=1")
	])
	.then (data => {
		image = {
			imgSD: data[0].urls.regular,
			imgHD: data[0].urls.full,
			imgAuthor: data[0].user.name,
			imgLink: data[0].links.html,
			authorLink: data[0].user.username
		};
		forecast = {
			currentF: Math.round(parseInt(data[1].current.temp_f)),
			currentC: Math.round(parseInt(data[1].current.temp_c)),
			highF: Math.round(parseInt(data[1].forecast.forecastday[0].day.maxtemp_f)),
			highC: Math.round(parseInt(data[1].forecast.forecastday[0].day.maxtemp_c)),
			lowF: Math.round(parseInt(data[1].forecast.forecastday[0].day.mintemp_f)),
			lowC: Math.round(parseInt(data[1].forecast.forecastday[0].day.mintemp_c)),
			feelsF: Math.round(parseInt(data[1].current.feelslike_f)),
			feelsC: Math.round(parseInt(data[1].current.feelslike_c)),
			precipIn: `${data[1].current.precip_in} in.`,
			precipMm: `${data[1].current.precip_mm} mm`,
			windMPH: `${Math.round(parseInt(data[1].current.wind_mph))} MPH`,
			windKPH: `${Math.round(parseInt(data[1].current.wind_kph))} kph`,
			windDir: data[1].current.wind_dir,
			pressureIn: `${data[1].current.pressure_in} in.`,
			pressureMb: `${data[1].current.pressure_mb} mB`,
			wxIcon: `http:${data[1].current.condition.icon}`,
			curLocation: `${data[1].location.name}, ${data[1].location.region}`,
			alertHeadline: data[1].alert.headline
		};
		displayContent();
	})
	.catch (error => {
		localStorage.removeItem("location");
		introForm.className = "hide-elem";
		errorMsg.style.display = "inherit";
		intro.className = "show-elem";
		errorMsg.innerHTML = `There was an error fetching the content. Please try again later.<br>${error}`;
	});
}

/* -------------------------------------------------------
DISPLAY CONTENT
------------------------------------------------------- */

function displayContent() {
	forecastIcon.src = forecast.wxIcon;
	currentLoc.textContent = forecast.curLocation;
  	imgCredits.innerHTML = `<p><a href="http://www.unsplash.com/@${image.authorLink}">${image.imgAuthor}</a> on <a href="${image.imgLink}">Unsplash</a></p>`;

	if (localStorage.quality === "sd" || localStorage.quality === undefined) {
		bgImage.style.backgroundImage = `url(${image.imgSD})`;
 	} else {
		bgImage.style.backgroundImage = `url(${image.imgHD})`;
	}

  	if (forecast.alertHeadline !== undefined) {
		alertContent.textContent = forecast.alertHeadline;
		setTimeout( function() {
			alerts.className = "alert-show";
		}, 5000);
 	} else {
		 alerts.style.visibility = "collapse";
	 }

 	if (localStorage.units === "f" || localStorage.units === undefined) {
		mainHeading.textContent = forecast.currentF;
		feelsLike.textContent = `${forecast.feelsF}°`;
		wind.textContent = `${forecast.windMPH} ${forecast.windDir}`;
		precip.textContent = forecast.precipIn;
		pressure.textContent = forecast.pressureIn;
		highTemp.textContent = `${forecast.highF}°`;
		lowTemp.textContent = `${forecast.lowF}°`;
  	} else {
		mainHeading.textContent = forecast.currentC;
		feelsLike.textContent = `${forecast.feelsC}°`;
		wind.textContent  = `${forecast.windKPH} ${forecast.windDir}`;
		precip.textContent = forecast.precipMm;
		pressure.textContent = forecast.pressureMb;
		highTemp.textContent = `${forecast.highC}°`;
		lowTemp.textContent = `${forecast.lowC}°`;
	  }

	bgImage.className = "show-elem"; 
	forecastScrn.className = "show-elem";

}

/* -------------------------------------------------------
EVENT LISTENERS
------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", function() {
	if(localStorage.location !== undefined) {
		intro.className = "hide-elem";
		loadContent(localStorage.location);
	} else {
		introForm.className = "show-elem";
	}
});

locSubmit.addEventListener('click', function(e) {
	e.preventDefault();
	const location = usrLoc.value;
	if (location === "") {
		introForm.style.borderColor = "#cc0000";
		introForm.value = "";
		usrLoc.setAttribute("placeholder", "Please enter a location.");
	} else {
		introForm.style.borderColor = "#222";
		intro.className = "hide-elem";
		localStorage.location = location;
		loadContent(location);
	}
});

menuToggle.addEventListener('click', function() {
	menu.className = "menu-show";
});

alertCloseBtn.addEventListener('click', function() {
	alerts.className = "alert-hide";
	alerts.style.visibility = "collapse";
});

menuCloseBtn.addEventListener('click', function() {
	menu.className = "menu-hide";
});

useMetric.addEventListener('click', function() {
	if(useMetric.checked) {
		localStorage.units = "c";
	} else {
		localStorage.units = "f";
	}
	displayContent();
});

useHD.addEventListener('click', function() {
	if(useHD.checked) {
		localStorage.quality = "hd";

	} else {
		localStorage.quality = "sd";
	}
	displayContent();
});

changeLoc.addEventListener('click', function(e) {
	e.preventDefault();
	menu.className = "menu-hide";
	forecastScrn.className = "hide-elem";
	bgImage.className = "hide-elem";
	alerts.className = "alert-hide";
	intro.className = "show-elem";
	introForm.className = "show-elem";
});

