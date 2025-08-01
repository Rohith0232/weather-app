import { API_KEY } from './config.js';

//Data-Time Element
const dateTime = document.querySelector(".date-time");

// Element selectors
const searchInput = document.querySelector(".search-bar input");
const searchBtn = document.querySelector("button");

const currImg = document.querySelector("#currImg");
const temp = document.querySelector(".temp-value");
const tempBio = document.querySelector(".temp-bio");
const cityText = document.querySelector(".city");
const humidityVal = document.querySelector(".humidity-value");
const windVal = document.querySelector(".wind-speed-value");

// Forecast selectors
const forecastDates = document.querySelectorAll("[class^='forecast-date']");
const forecastImgs = document.querySelectorAll("[class^='forecast-img']");
const forecastTemps = document.querySelectorAll("[class^='forecast-temps']");

const updateTemp = async () => {
    let city = searchInput;
    let cityVal = city.value.trim();
    if (cityVal === "") {
        cityVal = "Vijayawada";
    }

    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityVal}&days=4&aqi=no&alerts=no`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.error) {
            alert("Error! City not found.");
            city.value = "";
            return;
        }

        // Current weather
        currImg.setAttribute("src", data.current.condition.icon);
        temp.innerHTML = `${data.current.temp_c}°<span class="celsius">C</span>`;
        tempBio.innerText = data.current.condition.text;
        cityText.innerText = data.location.name;
        humidityVal.innerText = `${data.current.humidity}%`;
        windVal.innerText = `${data.current.wind_kph} km/h`;

        // Forecast
        for (let i = 1; i <= 3; i++) {
            const dayData = data.forecast.forecastday[i];
            const forecastIndex = i - 1;

            const dateObj = new Date(dayData.date);
            const day = dateObj.toLocaleDateString("en-US", { weekday: "short" });
            const month = dateObj.toLocaleDateString("en-US", { month: "short" });
            const dayNum = String(dateObj.getDate()).padStart(2, '0');
            const year = dateObj.getFullYear();

            const formattedDate = `${day}, ${month} ${dayNum} ${year}`;

            forecastDates[forecastIndex].innerText = formattedDate;
            forecastImgs[forecastIndex].setAttribute("src", dayData.day.condition.icon);
            forecastTemps[forecastIndex].innerHTML = `${dayData.day.avgtemp_c}<span class="celsius-forecast">C</span>`;
        }


    } catch (error) {
        alert("Something went wrong while fetching data.");
        console.error(error);
    }
};

const updateDateTime = () => {
    const now = new Date();
    const day = now.toLocaleDateString("en-US", { weekday: "short" });
    const month = now.toLocaleString("en-US", { month: "short" });
    const date = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formatted = `${day}, ${month} ${date} ${year} — ${time}`;
    dateTime.innerText = formatted;
};

// Trigger on button click and Enter key
searchBtn.addEventListener("click", updateTemp);
searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        updateTemp();
    }
});

setInterval(updateDateTime, 1000);
updateDateTime();
updateTemp();