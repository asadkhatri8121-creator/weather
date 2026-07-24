/*=====================================
 SKYCAST PRO - PART 1
 API + SEARCH + CURRENT LOCATION
=====================================*/

const API_KEY = "2190d4059cdc449c88e73303261507";
const BASE_URL = "https://api.weatherapi.com/v1/forecast.json";

const city = document.getElementById("city");
const date = document.getElementById("date");
const temp = document.getElementById("temp");
const condition = document.getElementById("condition");
const weatherIcon = document.getElementById("weatherIcon");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const hourlyContainer = document.getElementById("hourlyContainer");
const weeklyContainer = document.getElementById("weeklyContainer");

let weatherData = null;

/*==========================
GET WEATHER
==========================*/

async function getWeather(query){

    try{

        const response = await fetch(

        `${BASE_URL}?key=${API_KEY}&q=${query}&days=7&aqi=yes&alerts=yes`

        );

        const data = await response.json();

        if(data.error){

            alert(data.error.message);
            return;

        }

        weatherData = data;

        updateCurrentWeather(data);

        updateHourlyForecast(data);

        updateWeeklyForecast(data);

        updateTheme(data);

    }

    catch(error){

        console.log(error);

        alert("Weather not found.");

    }

}

/*==========================
CURRENT WEATHER
==========================*/

function updateCurrentWeather(data){

    city.innerHTML =
    data.location.name +
    ", " +
    data.location.country;

    date.innerHTML =
    data.location.localtime;

    temp.innerHTML =
    Math.round(
    data.current.temp_c
    ) + "°";

    condition.innerHTML =
    data.current.condition.text;

    weatherIcon.src =
    "https:" +
    data.current.condition.icon;

    humidity.innerHTML =
    data.current.humidity + "%";

    wind.innerHTML =
    data.current.wind_kph + " km/h";

    pressure.innerHTML =
    data.current.pressure_mb + " mb";

    visibility.innerHTML =
    data.current.vis_km + " km";

}

/*==========================
SEARCH
==========================*/

searchBtn.onclick = ()=>{

    const value =
    searchInput.value.trim();

    if(value==="") return;

    getWeather(value);

};

searchInput.addEventListener(

"keypress",

function(e){

if(e.key==="Enter"){

const value=
searchInput.value.trim();

if(value==="") return;

getWeather(value);

}

}

);

/*==========================
CURRENT LOCATION
==========================*/

locationBtn.onclick=function(){

navigator.geolocation.getCurrentPosition(

async(position)=>{

const lat=
position.coords.latitude;

const lon=
position.coords.longitude;

getWeather(lat+","+lon);

},

()=>{

alert("Location permission denied.");

}

);

}

/*==========================
DEFAULT LOAD
==========================*/

window.onload=function(){

getWeather("Karachi");

};
/*=====================================
 SKYCAST PRO - PART 2
 HOURLY + 7 DAY FORECAST
======================================*/

/*==========================
TODAY HOURLY FORECAST
==========================*/

function updateHourlyForecast(data){

    hourlyContainer.innerHTML = "";

    const currentHour = new Date(
        data.location.localtime
    ).getHours();

    const hours =
    data.forecast.forecastday[0].hour;

    for(let i=currentHour;i<24;i++){

        const hour = hours[i];

        hourlyContainer.innerHTML += `

        <div class="hour-card glass">

            <p>${hour.time.split(" ")[1]}</p>

            <img
            src="https:${hour.condition.icon}">

            <h3>${Math.round(hour.temp_c)}°</h3>

            <small>${hour.condition.text}</small>

            <span>💧 ${hour.chance_of_rain}%</span>

        </div>

        `;

    }

}

/*==========================
PREMIUM 7 DAY FORECAST
==========================*/

function updateWeeklyForecast(data){

    weeklyContainer.innerHTML = "";

    data.forecast.forecastday.forEach(day=>{

        const dayName =
        new Date(day.date).toLocaleDateString(
            "en-US",
            {
                weekday:"long"
            }
        );

        weeklyContainer.innerHTML += `

        <div class="week-card glass">

            <div class="week-header">

                <div>

                    <h3>${dayName}</h3>

                    <p>${day.date}</p>

                </div>

                <img
                src="https:${day.day.condition.icon}">

            </div>

            <h4>${day.day.condition.text}</h4>

            <div class="week-temp">

                <span>
                🌡 ${Math.round(day.day.maxtemp_c)}°
                </span>

                <span>
                ❄ ${Math.round(day.day.mintemp_c)}°
                </span>

            </div>

            <div class="week-details">

                <div>

                💧 ${day.day.daily_chance_of_rain}%

                </div>

                <div>

                💨 ${day.day.maxwind_kph} km/h

                </div>

                <div>

                💦 ${day.day.avghumidity}%

                </div>

                <div>

                ☀ UV ${day.day.uv}

                </div>

            </div>

        </div>

        `;

    });

}

/*==========================
EXTRA WEATHER DETAILS
==========================*/

function updateExtraDetails(data){

    const feels =
    document.getElementById("feelsLike");

    const uv =
    document.getElementById("uv");

    const aqi =
    document.getElementById("aqi");

    const sunrise =
    document.getElementById("sunrise");

    const sunset =
    document.getElementById("sunset");

    if(feels){

        feels.innerHTML =
        Math.round(
        data.current.feelslike_c
        ) + "°";

    }

    if(uv){

        uv.innerHTML =
        data.current.uv;

    }

    if(aqi){

        aqi.innerHTML =
        Math.round(
        data.current.air_quality["us-epa-index"]
        );

    }

    if(sunrise){

        sunrise.innerHTML =
        data.forecast.forecastday[0].astro.sunrise;

    }

    if(sunset){

        sunset.innerHTML =
        data.forecast.forecastday[0].astro.sunset;

    }

}

/*==========================
REFRESH UI
==========================*/

function refreshUI(data){

    updateCurrentWeather(data);

    updateHourlyForecast(data);

    updateWeeklyForecast(data);

    updateExtraDetails(data);

    updateTheme(data);

}
/*=====================================
 SKYCAST PRO - PART 3
 THEME + BACKGROUND + CLOCK
======================================*/

/*==========================
LIVE CLOCK
==========================*/

let clock;

function updateClock(data){

    clearInterval(clock);

    function startClock(){

        const now = new Date();

        const time =
        now.toLocaleTimeString("en-US",{
            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit"
        });

        const clockElement =
        document.getElementById("liveClock");

        if(clockElement){

            clockElement.innerHTML = time;

        }

    }

    startClock();

    clock = setInterval(startClock,1000);

}

/*==========================
GREETING
==========================*/

function updateGreeting(data){

    const greeting =
    document.getElementById("greeting");

    if(!greeting) return;

    const hour =
    new Date(data.location.localtime).getHours();

    if(hour>=5 && hour<12){

        greeting.innerHTML="☀️ Good Morning";

    }

    else if(hour>=12 && hour<17){

        greeting.innerHTML="🌤 Good Afternoon";

    }

    else if(hour>=17 && hour<20){

        greeting.innerHTML="🌇 Good Evening";

    }

    else{

        greeting.innerHTML="🌙 Good Night";

    }

}

/*==========================
TIME THEME
==========================*/

function updateTheme(data){

    document.body.className="";

    const hour =
    new Date(data.location.localtime).getHours();

    if(hour>=5 && hour<10){

        document.body.classList.add("morning");

    }

    else if(hour>=10 && hour<17){

        document.body.classList.add("day");

    }

    else if(hour>=17 && hour<19){

        document.body.classList.add("evening");

    }

    else{

        document.body.classList.add("night");

    }

    updateWeatherEffects(data);

}

/*==========================
WEATHER EFFECTS
==========================*/

function updateWeatherEffects(data){

    const weather =
    data.current.condition.text.toLowerCase();

    document.body.classList.remove(
        "rainy",
        "snowy",
        "cloudy",
        "foggy",
        "thunder"
    );

    if(weather.includes("cloud")){

        document.body.classList.add("cloudy");

    }

    if(weather.includes("rain")){

        document.body.classList.add("rainy");

    }

    if(weather.includes("snow")){

        document.body.classList.add("snowy");

    }

    if(weather.includes("mist") ||
       weather.includes("fog")){

        document.body.classList.add("foggy");

    }

    if(weather.includes("thunder")){

        document.body.classList.add("thunder");

    }

}

/*==========================
ANIMATE CARDS
==========================*/

function animateCards(){

    const cards =
    document.querySelectorAll(

        ".glass,.card,.hour-card,.week-card"

    );

    cards.forEach((card,index)=>{

        card.style.opacity="0";

        card.style.transform="translateY(40px)";

        setTimeout(()=>{

            card.style.transition=".5s";

            card.style.opacity="1";

            card.style.transform="translateY(0)";

        },index*70);

    });

}

/*==========================
UPDATE UI
==========================*/

function refreshUI(data){

    updateCurrentWeather(data);

    updateHourlyForecast(data);

    updateWeeklyForecast(data);

    updateExtraDetails(data);

    updateTheme(data);

    updateGreeting(data);

    updateClock(data);

    animateCards();

}
/*=====================================
 SKYCAST PRO - PART 4
 FINAL FEATURES
======================================*/

/*==========================
TEMPERATURE UNIT
==========================*/

let unit = "C";

const unitBtn = document.getElementById("unitBtn");

if(unitBtn){

unitBtn.addEventListener("click",()=>{

if(!weatherData) return;

if(unit==="C"){

unit="F";

temp.innerHTML=
Math.round(weatherData.current.temp_f)+"°F";

unitBtn.innerHTML="°F";

}else{

unit="C";

temp.innerHTML=
Math.round(weatherData.current.temp_c)+"°C";

unitBtn.innerHTML="°C";

}

});

}

/*==========================
RECENT SEARCH
==========================*/

function saveRecent(cityName){

let history=
JSON.parse(
localStorage.getItem("recentCities")
)||[];

history=history.filter(
item=>item!==cityName
);

history.unshift(cityName);

history=history.slice(0,8);

localStorage.setItem(
"recentCities",
JSON.stringify(history)
);

}

/*==========================
FAVOURITE CITY
==========================*/

function addFavourite(){

if(!weatherData) return;

localStorage.setItem(

"favCity",

weatherData.location.name

);

}

const favBtn=
document.getElementById("favBtn");

if(favBtn){

favBtn.onclick=addFavourite;

}

/*==========================
AUTO LOAD FAVOURITE
==========================*/

window.addEventListener("load",()=>{

const fav=
localStorage.getItem("favCity");

if(fav){

getWeather(fav);

}

});

/*==========================
AUTO REFRESH
==========================*/

setInterval(()=>{

if(weatherData){

getWeather(

weatherData.location.name

);

}

},600000);

/*==========================
SEARCH HISTORY SAVE
==========================*/

searchBtn.addEventListener("click",()=>{

const value=
searchInput.value.trim();

if(value){

saveRecent(value);

}

});

/*==========================
ERROR IMAGE
==========================*/

weatherIcon.onerror=function(){

weatherIcon.src=

"https://cdn-icons-png.flaticon.com/512/1779/1779940.png";

};

/*==========================
SMOOTH SCROLL
==========================*/

document.documentElement.style.scrollBehavior="smooth";

/*==========================
END
==========================*/

console.log(

"SkyCast Pro Loaded Successfully"

);