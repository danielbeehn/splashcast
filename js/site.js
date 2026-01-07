/* --------------------
STATE & CONSTANTS
-------------------- */

const state = {
	image: {},
	forecast: {},
	days: [],
	images: { sd: null, hd: null }
  };
  
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  
  const round = n => Math.round(Number(n));
  
/* --------------------
DOM CACHE
-------------------- */
  
  const dom = {
	intro: document.querySelector("#intro"),
	content: document.querySelector("#content"),
	topBar: document.querySelector("#top-bar"),
	forecast: document.querySelector("#forecast"),
	background: document.querySelector("#background"),
	loadingText: document.querySelector("#loading-text"),
	loadingIcon: document.querySelector("#loading-text img"),
	tempValue: document.querySelector("#temp h2"),
	tempIcon: document.querySelector("#temp img"),
	tempDate: document.querySelector("#temp p span"),
	textCond: document.querySelector("#text-cond"),
	locationLabels: document.querySelectorAll("#current-loc, #top-bar h3"),
	days: [...document.querySelectorAll("#fiveday li")],
	alerts: document.querySelector("#alerts"),
	alertText: document.querySelector("#alert-text"),
	alertButton: document.querySelector("#alerts button"),
	caret: document.querySelector(".caret"),
	locInput: document.querySelector("#intro input"),
	locContainer: document.querySelector("#autocomplete-container"),
	locForm: document.querySelector("#intro form"),
	searchText: document.querySelector("#search-text"),
	menuOpen: document.querySelector("#menu-toggle"),
	menuClose: document.querySelector("#menu-close-btn"),
	menu: document.querySelector("#menu"),
	useMetric: document.querySelector("#use-metric"),
	useHD: document.querySelector("#use-hd"),
	changeLoc: document.querySelector("#change-loc"),
	openSearch: document.querySelector("#search-open"),
	closeSearch: document.querySelector("#search-close"),
	refreshBtn: document.querySelector("#refresh-toggle")
  };
  
/* --------------------
FETCH HELPERS
-------------------- */
  
  async function fetchJSON(url) {
	const res = await fetch(url);
	return res.json();
  }
  
/* --------------------
LOAD CONTENT
-------------------- */
  
  async function loadContent(location) {
	dom.loadingIcon.classList.add("rotate");
  
	try {
	  const [img, wx] = await Promise.all([
		fetchJSON("https://api.unsplash.com/photos/random/?query=nature&client_id=5DjUVQVPU9Qadwxu-t_7gVGyCRmRLk1rpKyntGLux5I"),
		fetchJSON(`https://api.weatherapi.com/v1/forecast.json?key=f1263c7d49ab471fb6500307202805&q=${location}&days=7`)
	  ]);
  
	  state.image = {
		sd: img.urls.regular,
		hd: img.urls.full,
		author: img.user.name,
		authorLink: img.user.links.html,
		link: img.links.html,
		download: img.links.download_location
	  };
  
	  state.forecast = {
		cond: wx.current.condition.text,
		icon: `https:${wx.current.condition.icon}`,
		location: `${wx.location.name}, ${wx.location.region}`,
		temp: { f: round(wx.current.temp_f), c: round(wx.current.temp_c) },
		feels: { f: round(wx.current.feelslike_f), c: round(wx.current.feelslike_c) },
		wind: { f: `${round(wx.current.wind_mph)} MPH`, c: `${round(wx.current.wind_kph)} kph`, dir: wx.current.wind_dir },
		precip: { f: `${wx.current.precip_in} in.`, c: `${wx.current.precip_mm} mm` },
		pressure: { f: `${wx.current.pressure_in} in.`, c: `${wx.current.pressure_mb} mB` },
		alerts: wx.alerts?.alert || null
	  };
  
	  state.days = wx.forecast.forecastday.slice(0,5).map(d => ({
		icon: `https:${d.day.condition.icon}`,
		cond: d.day.condition.text,
		high: { f: round(d.day.maxtemp_f), c: round(d.day.maxtemp_c) },
		low: { f: round(d.day.mintemp_f), c: round(d.day.mintemp_c) }
	  }));
  
	  displayContent();
	} catch (err) {
	  localStorage.removeItem("location");
	  dom.loadingIcon.classList.remove("rotate");
	  dom.loadingText.className = "show-elem";
	  dom.loadingText.querySelector("p").textContent = "Error loading content.";
	}
  }
  
/* --------------------
DISPLAY CONTENT
-------------------- */
  
  function displayContent() {
	console.log(state.forecast);
	fetch(state.image.download, { headers: { Authorization: "Client-ID 5DjUVQVPU9Qadwxu-t_7gVGyCRmRLk1rpKyntGLux5I" }});
  
	const now = new Date();
	dom.tempDate.textContent = `${months[now.getMonth()]} ${now.getDate()}, ${now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  
	dom.tempIcon.src = getWxIcon(state.forecast.icon);
	dom.tempIcon.alt = state.forecast.cond;
	dom.textCond.textContent = state.forecast.cond;
  
	dom.locationLabels.forEach(el => el.textContent = state.forecast.location);
  
	renderDays();
	renderUnits();
	renderAlerts();
	loadBackground();
  }
  
  function renderDays() {
	const today = new Date().getDay();
  
	dom.days.forEach((el, i) => {
	  const day = state.days[i];
	  el.querySelector("h4").textContent = daysOfWeek[(today + i) % 7];
	  const img = el.querySelector("img");
	  img.src = getWxIcon(day.icon);
	  img.alt = day.cond;
	});
  }
  
  function renderUnits() {
	const unit = localStorage.units === "c" ? "c" : "f";
  
	dom.tempValue.textContent = state.forecast.temp[unit];
	document.querySelector("#wind span").textContent = `${state.forecast.wind[unit]} ${state.forecast.wind.dir}`;
	document.querySelector("#precip span").textContent = state.forecast.precip[unit];
	document.querySelector("#pressure span").textContent = state.forecast.pressure[unit];
	document.querySelector("#feelslike span").textContent = state.forecast.feels[unit];
  
	dom.days.forEach((el, i) => {
	  const d = state.days[i];
	  el.querySelector("span").innerHTML = `${d.low[unit]}&#176; / ${d.high[unit]}&#176;`;
	});
  }
  
  function renderAlerts() {
	if (!state.forecast.alerts) return;
	dom.alerts.className = "show-elem";
	dom.alerts.querySelector("span").textContent = state.forecast.alerts[0].event;
	dom.alertText.textContent = state.forecast.alerts[0].desc;
  }
  
  function loadBackground() {
	const quality = localStorage.quality === "hd" ? "hd" : "sd";
	const img = new Image();
	img.src = state.image[quality];
  
	img.onload = () => {
	  dom.background.style.backgroundImage = `url(${img.src})`;
	  document.querySelector(".img-link").innerHTML = `<a href='${state.image.link}'>Image</a>`;
	  document.querySelector(".img-author").innerHTML = `<a href='${state.image.authorLink}'>${state.image.author}</a>`;
	  dom.background.className = "show-elem";
	  hidePreloader();
	};
  }
  
  function hidePreloader() {
	dom.intro.className = "hide-elem";
	dom.forecast.className = "show-elem";
	dom.loadingIcon.classList.remove("rotate");
	dom.loadingText.className = "hide-elem";
  }
  
/* --------------------
UTILS
-------------------- */
  
  const getWxIcon = icon => icon.replace("https://cdn.weatherapi.com/weather/64x64/", "img/forecast-icons/").replace("png", "svg");
  
/* --------------------
INIT
-------------------- */
  
document.addEventListener("DOMContentLoaded", () => {
	if (localStorage.location) {
		dom.loadingText.className = "show-elem";
		loadContent(localStorage.location);
	} else {
		document.querySelector("#intro-text").className = "show-elem";
	}
}); 

/* --------------------
EVENT LISTENERS
-------------------- */
  
function handleLocationSubmit(e) {
	e.preventDefault();

	const location = dom.locInput.value.trim();

	if (!location) {
		dom.locContainer.style.borderColor = "#cc0000";
		dom.locContainer.style.borderWidth = "1px";
		dom.locInput.value = "";
		dom.locInput.setAttribute("placeholder", "Please enter a location.");
		return;
	}

	dom.locForm.style.borderWidth = "0";
	localStorage.location = location;

	loadContent(location);

	dom.searchText.className = "hide-elem";
	dom.loadingText.className = "show-elem";

	e.stopPropagation();
	callback(null);
	closeDropDownList();
}

dom.locForm.addEventListener("submit", handleLocationSubmit);
dom.locForm.querySelector("button").addEventListener("click", handleLocationSubmit);

dom.menuOpen.addEventListener("click", () => {
	dom.menu.className = "menu-show";
});

dom.menuClose.addEventListener("click", () => {
	dom.menu.className = "menu-hide";
});

dom.useMetric.addEventListener("click", () => {
	localStorage.units = dom.useMetric.checked ? "c" : "f";
	displayContent();
});

dom.useHD.addEventListener("click", () => {
	localStorage.quality = dom.useHD.checked ? "hd" : "sd";
	displayContent();
});

dom.changeLoc.addEventListener("click", e => {
	e.preventDefault();

	dom.menu.className = "menu-hide";
	dom.forecast.className = "hide-elem";
	dom.background.className = "hide-elem";

	dom.searchText.className = "show-elem";
	dom.locForm.reset();
	dom.locInput.setAttribute("placeholder", "Search for your location...");
	dom.intro.className = "show-elem";
	dom.locInput.focus();
});

dom.refreshBtn.addEventListener('click', function() {
	loadContent(localStorage.location);
});

dom.alertButton.addEventListener("click", () => {
	const isHidden = dom.alertText.className === "hide-elem";

	dom.alertText.className = isHidden ? "show-elem" : "hide-elem";
	dom.alertText.style.display = isHidden ? "inherit" : "none";

	dom.caret.classList.toggle("fa-angle-down", !isHidden);
	dom.caret.classList.toggle("fa-angle-up", isHidden);
});

dom.openSearch.addEventListener("click", e => {
	e.preventDefault();
	document.querySelector("#intro-text").className = "hide-elem";
	dom.searchText.className = "show-elem";
	dom.locForm.reset();
	dom.locInput.setAttribute("placeholder", "Search for your location...");
	dom.locInput.focus();
});

dom.closeSearch.addEventListener("click", e => {
	e.preventDefault();
	document.querySelector("#intro-text").className = "show-elem";
	dom.searchText.className = "hide-elem";
});

dom.content.addEventListener("scroll", () => {
	dom.topBar.classList.toggle("has-scrolled", dom.content.scrollTop > 0);
});
