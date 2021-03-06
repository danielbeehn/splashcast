/* -------------------------------------------------------
GLOBAL VARIABLES
------------------------------------------------------- */

let image = "";
let forecast = "";
let imgSD = "";
let imgHD = "";
let isAlert = "";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
	document.querySelector("#intro img").classList.add("rotate");
	Promise.all([
		fetchData("https://api.unsplash.com/photos/random/?client_id=5DjUVQVPU9Qadwxu-t_7gVGyCRmRLk1rpKyntGLux5I"),
		fetchData("https://api.weatherapi.com/v1/forecast.json?key=f1263c7d49ab471fb6500307202805&q=" + loc + "&days=5")
	])
	.then (data => {
		image = {
			imgSD: data[0].urls.regular,
			imgHD: data[0].urls.full,
			imgAuthor: data[0].user.name,
			imgLink: data[0].links.html,
			authorLink: data[0].user.links.html,
			downloadLink: data[0].links.download_location
		};
		forecast = {
			currentF: Math.round(parseInt(data[1].current.temp_f)),
			currentC: Math.round(parseInt(data[1].current.temp_c)),
			currentFeelsF: Math.round(parseInt(data[1].current.feelslike_f)),
			currentFeelsC: Math.round(parseInt(data[1].current.feelslike_c)),
			precipIn: `${data[1].current.precip_in} in.`,
			precipMm: `${data[1].current.precip_mm} mm`,
			windMPH: `${Math.round(parseInt(data[1].current.wind_mph))} MPH`,
			windKPH: `${Math.round(parseInt(data[1].current.wind_kph))} kph`,
			windDir: data[1].current.wind_dir,
			pressureIn: `${data[1].current.pressure_in} in.`,
			pressureMb: `${data[1].current.pressure_mb} mB`,
			currentCond: data[1].current.condition.text,
			wxIcon: `https:${data[1].current.condition.icon}`,
			curLocation: `${data[1].location.name}, ${data[1].location.region}`,
			alert: (function checkAlert() {
				if (data[1].alerts === undefined) {
					isAlert = false;
				}
				else {
					return data[1].alerts
				}
			})
		};
		day1Forecast = {
			wxIcon: `https:${data[1].forecast.forecastday[0].day.condition.icon}`,
			wxCond: data[1].forecast.forecastday[0].day.condition.text,
			highF: Math.round(parseInt(data[1].forecast.forecastday[0].day.maxtemp_f)),
			highC: Math.round(parseInt(data[1].forecast.forecastday[0].day.maxtemp_c)),
			lowF: Math.round(parseInt(data[1].forecast.forecastday[0].day.mintemp_f)),
			lowC: Math.round(parseInt(data[1].forecast.forecastday[0].day.mintemp_c)),
		}
		day2Forecast = {
			wxIcon: `https:${data[1].forecast.forecastday[1].day.condition.icon}`,
			wxCond: data[1].forecast.forecastday[1].day.condition.text,
			highF: Math.round(parseInt(data[1].forecast.forecastday[1].day.maxtemp_f)),
			highC: Math.round(parseInt(data[1].forecast.forecastday[1].day.maxtemp_c)),
			lowF: Math.round(parseInt(data[1].forecast.forecastday[1].day.mintemp_f)),
			lowC: Math.round(parseInt(data[1].forecast.forecastday[1].day.mintemp_c)),
		}
		day3Forecast = {
			wxIcon: `https:${data[1].forecast.forecastday[2].day.condition.icon}`,
			wxCond: data[1].forecast.forecastday[2].day.condition.text,
			highF: Math.round(parseInt(data[1].forecast.forecastday[2].day.maxtemp_f)),
			highC: Math.round(parseInt(data[1].forecast.forecastday[2].day.maxtemp_c)),
			lowF: Math.round(parseInt(data[1].forecast.forecastday[2].day.mintemp_f)),
			lowC: Math.round(parseInt(data[1].forecast.forecastday[2].day.mintemp_c)),
		}
		day4Forecast = {
			wxIcon: `https:${data[1].forecast.forecastday[3].day.condition.icon}`,
			wxCond: data[1].forecast.forecastday[3].day.condition.text,
			highF: Math.round(parseInt(data[1].forecast.forecastday[3].day.maxtemp_f)),
			highC: Math.round(parseInt(data[1].forecast.forecastday[3].day.maxtemp_c)),
			lowF: Math.round(parseInt(data[1].forecast.forecastday[3].day.mintemp_f)),
			lowC: Math.round(parseInt(data[1].forecast.forecastday[3].day.mintemp_c)),
		}
		day5Forecast = {
			wxIcon: `https:${data[1].forecast.forecastday[4].day.condition.icon}`,
			wxCond: data[1].forecast.forecastday[4].day.condition.text,
			highF: Math.round(parseInt(data[1].forecast.forecastday[4].day.maxtemp_f)),
			highC: Math.round(parseInt(data[1].forecast.forecastday[4].day.maxtemp_c)),
			lowF: Math.round(parseInt(data[1].forecast.forecastday[4].day.mintemp_f)),
			lowC: Math.round(parseInt(data[1].forecast.forecastday[4].day.mintemp_c)),
		}
		displayContent();
	})
	.catch (error => {
		localStorage.removeItem("location");
		document.querySelector("#intro img").classList.remove("rotate");
		document.querySelector("#intro form").className = "hide-elem";
		document.querySelector("#intro").className = "show-elem";
		document.querySelector("#intro p").style.display = "inherit";
		document.querySelector("#intro p").innerHTML = `There was an error fetching the content. Please try again later.<br>${error}`;
	});
}

/* -------------------------------------------------------
DISPLAY CONTENT
------------------------------------------------------- */

function displayContent() {
	fetch(image.downloadLink, {
		headers: {
			'Authorization': 'Client-ID 5DjUVQVPU9Qadwxu-t_7gVGyCRmRLk1rpKyntGLux5I'
		}
	});

	let thisDate = new Date();
	let currentHour = thisDate.getHours();
	let currentMins = thisDate.getMinutes();
	let currentMonth = thisDate.getMonth();
	let currentDay = thisDate.getDate();
	let dayName = thisDate.getDay();
	let ampm = "AM";

	if (currentHour >= 12) {
		ampm = "PM";
	}

	if (currentHour > 12) {
		currentHour = currentHour % 12;
	} else if (currentHour === 0) {
		currentHour = 12;
	}

	if (currentMins < 10) {
		currentMins = "0" + currentMins;
	}

	document.querySelector("#temp h3").textContent = forecast.currentCond;
	document.querySelector("#temp p span").textContent = `${currentDay} ${months[currentMonth]} ${currentHour}:${currentMins} ${ampm}`;

	document.querySelector("#temp img").src = getWxIcon(forecast.wxIcon);
	document.querySelector("#temp img").alt = forecast.currentCond;

	document.querySelector("#current-loc").textContent = forecast.curLocation;
	document.querySelector(".top-bar-left h4").textContent = forecast.curLocation;
	  
	document.querySelector("#day1 h4").textContent = getDayName(dayName);
	document.querySelector("#day1 img").src = getWxIcon(day1Forecast.wxIcon);
	document.querySelector("#day1 img").alt = day1Forecast.wxCond;

	document.querySelector("#day2 h4").textContent = getDayName(dayName + 1);
	document.querySelector("#day2 img").src = getWxIcon(day2Forecast.wxIcon);
	document.querySelector("#day2 img").alt = day2Forecast.wxCond;

	document.querySelector("#day3 h4").textContent = getDayName(dayName + 2);
	document.querySelector("#day3 img").src = getWxIcon(day3Forecast.wxIcon);
	document.querySelector("#day3 img").alt = day3Forecast.wxCond;

	document.querySelector("#day4 h4").textContent = getDayName(dayName + 3);
	document.querySelector("#day4 img").src = getWxIcon(day4Forecast.wxIcon);
	document.querySelector("#day4 img").alt = day4Forecast.wxCond;

	document.querySelector("#day5 h4").textContent = getDayName(dayName + 4);
	document.querySelector("#day5 img").src = getWxIcon(day5Forecast.wxIcon);
	document.querySelector("#day5 img").alt = day5Forecast.wxCond;

  	if (isAlert === false) {
		document.querySelector("#alerts button span").textContent = forecast.alert.alert.event;
		document.querySelector("#alerts").className = "show-elem"; 
		document.querySelector("#alert-text").textContent = forecast.alert.alert.event;
 	}

 	if (localStorage.units === "f" || localStorage.units === undefined) {
		document.querySelector("#temp h2 span").textContent = forecast.currentF;
		document.querySelector("#wind span").textContent = `${forecast.windMPH} ${forecast.windDir}`;
		document.querySelector("#precip span").textContent = forecast.precipIn;
		document.querySelector("#pressure span").textContent = forecast.pressureIn;
		document.querySelector("#feelslike span").textContent = forecast.currentFeelsF;
		document.querySelector("#day1 span").innerHTML = `${day1Forecast.highF}&#176; / ${day1Forecast.lowF}&#176;`;
		document.querySelector("#day2 span").innerHTML = `${day2Forecast.highF}&#176; / ${day2Forecast.lowF}&#176;`;
		document.querySelector("#day3 span").innerHTML = `${day3Forecast.highF}&#176; / ${day3Forecast.lowF}&#176;`;
		document.querySelector("#day4 span").innerHTML = `${day4Forecast.highF}&#176; / ${day4Forecast.lowF}&#176;`;
		document.querySelector("#day5 span").innerHTML= `${day5Forecast.highF}&#176; / ${day5Forecast.lowF}&#176;`;
  	} else {
		document.querySelector("#temp h2 span").textContent = forecast.currentC;
		document.querySelector("#wind span").textContent  = `${forecast.windKPH} ${forecast.windDir}`;
		document.querySelector("#precip span").textContent = forecast.precipMm;
		document.querySelector("#pressure span").textContent = forecast.pressureMb;
		document.querySelector("#feelslike span").textContent = forecast.currentFeelsC;
		document.querySelector("#day1 span").innerHTML = `${day1Forecast.highC}&#176; / ${day1Forecast.lowC}&#176;`;
		document.querySelector("#day2 span").innerHTML = `${day2Forecast.highC}&#176; / ${day2Forecast.lowC}&#176;`;
		document.querySelector("#day3 span").innerHTML = `${day3Forecast.highC}&#176; / ${day3Forecast.lowC}&#176;`;
		document.querySelector("#day4 span").innerHTML = `${day4Forecast.highC}&#176; / ${day4Forecast.lowC}&#176;`;
		document.querySelector("#day5 span").innerHTML = `${day5Forecast.highC}&#176; / ${day5Forecast.lowC}&#176;`;
	}

	document.querySelector("#refresh-toggle").classList.remove("rotate");

	if (document.querySelector("#background").style.backgroundImage === "") {
		loadImage();
	}
	else {
		document.querySelector("#background").className = "show-elem";
		setTimeout(hidePreloader, 200);
	}

	function loadImage() {
		if (localStorage.quality === "sd" || localStorage.quality === undefined) {
			imgSD = new Image();
			imgSD.src = image.imgSD;
			document.querySelector("#background").style.backgroundImage = `url(${imgSD.src})`;
			imageLoaded();
		 } else {
			imgHD = new Image();
			imgHD.src = image.imgHD;
			document.querySelector("#background").style.backgroundImage = `url(${imgHD.src})`;
			imageLoaded();
		}
	}

}

function imageLoaded() {
	if (imgSD.complete || imgHD.complete) {
		document.querySelector(".img-link").innerHTML = `<a href="${image.imgLink}">Image</a>`;
		document.querySelector(".img-author").innerHTML = `<a href="${image.authorLink}">${image.imgAuthor}</a>`;
		document.querySelector("#background").className = "show-elem";
		setTimeout(hidePreloader, 200);
	} else {
		setTimeout(imageLoaded, 2000);
	}
}

function hidePreloader() {
	document.querySelector("#intro").className = "hide-elem"; 
	document.querySelector("#forecast").className = "show-elem";
	document.querySelector("#intro img").classList.remove("rotate");
}

function getDayName(calc) {
	if (calc > 6) {
		calc = calc - 7;
		return days[calc];
	}
	else {
		return days[calc];
	}
}

function getWxIcon(iconAddr) {
	return iconAddr.replace("https://cdn.weatherapi.com/weather/64x64/", "img/forecast-icons/")
}

/* -------------------------------------------------------
EVENT LISTENERS
------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", function() {
	if(localStorage.location !== undefined) {
		document.querySelector("#intro p").style.display = "inherit";
		document.querySelector("#intro p").innerHTML = `Fetching your forecast...`;
		loadContent(localStorage.location);
	} else {
		document.querySelector("#intro form").className = "show-elem";
	}
});

document.querySelector("#intro form button").addEventListener('click', function(e) {
	e.preventDefault();
	const location = document.querySelector("#intro form input").value;
	if (location === "") {
		document.querySelector("#intro form").style.borderColor = "#cc0000";
		document.querySelector("#intro form").value = "";
		document.querySelector("#intro form input").setAttribute("placeholder", "Please enter a location.");
	} else {
		document.querySelector("#intro form").style.borderColor = "#222";
		localStorage.location = location;
		loadContent(location);
		document.querySelector("#intro p").style.display = "inherit";
		document.querySelector("#intro p").innerHTML = `Fetching your forecast...`;
		document.querySelector("#intro form").className = "hide-elem";
	}
});

document.querySelector("#menu-toggle").addEventListener('click', function() {
	document.querySelector("#menu").className = "menu-show";
});

document.querySelector("#menu-close-btn").addEventListener('click', function() {
	document.querySelector("#menu").className = "menu-hide";
});

document.querySelector("#use-metric").addEventListener('click', function() {
	if(document.querySelector("#use-metric").checked) {
		localStorage.units = "c";
	} else {
		localStorage.units = "f";
	}
	displayContent();
});

document.querySelector("#use-hd").addEventListener('click', function() {
	if(document.querySelector("#use-hd").checked) {
		localStorage.quality = "hd";

	} else {
		localStorage.quality = "sd";
	}
	displayContent();
});

document.querySelector("#change-loc").addEventListener('click', function(e) {
	e.preventDefault();
	document.querySelector("#intro p").style.display = "none";
	document.querySelector("#menu").className = "menu-hide";
	document.querySelector("#forecast").className = "hide-elem";
	document.querySelector("#background").className = "hide-elem";
	document.querySelector("#intro").className = "show-elem";
	document.querySelector("#intro form").className = "show-elem";
});

document.querySelector("#refresh-toggle").addEventListener('click', function() {
	this.classList.add("rotate");
	loadContent(localStorage.location);
});

document.querySelector("#alerts button").addEventListener('click', function() {
	if (document.querySelector("#alert-text").className === "hide-elem") {
		document.querySelector("#alert-text").className = "show-elem";
		document.querySelector("#alert-text").style.display = "inherit";
		document.querySelector(".caret").classList.remove("fa-angle-down");
		document.querySelector(".caret").classList.add("fa-angle-up");
	} else if (document.querySelector("#alert-text").className === "show-elem") {
		document.querySelector("#alert-text").className = "hide-elem";
		document.querySelector("#alert-text").style.display = "none";
		document.querySelector(".caret").classList.remove("fa-angle-up");
		document.querySelector(".caret").classList.add("fa-angle-down");
	}
});

