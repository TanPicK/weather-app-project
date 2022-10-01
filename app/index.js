function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Satuday",
  ];

  let day = days[date.getDay()];

  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  forecastDay = response.data.daily;
  console.log(response);
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecastDay.forEach(function (forecastInfo, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
        <div class="forecast-day">${formatDay(forecastInfo.dt)}</div>
        <img 
        src= "http://openweathermap.org/img/wn/${
          forecastInfo.weather[0].icon
        }@2x.png" 
        alt =${forecastInfo.weather[0].description}
        width="42"/>
          <div class="forecast-temperatures">
            <span class="forecast-temperature-max">${Math.round(
              forecastInfo.temp.max
            )}°</span>
            <span class="forecast-temperature-min">${Math.round(
              forecastInfo.temp.min
            )}°</span>
          </div>
        `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "215576bab28022db35e6e64f040e1b56";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function showWeatherCondition(response) {
  console.log(response);
  let city = response.data.name;
  if (
    city.includes("Zürich") ||
    city.includes("Zurich") ||
    city.includes("Letten")
  ) {
    city = "Zürich";
  }
  celsiusTemperature = response.data.main.temp;
  let dateElement = document.querySelector("#todays-date");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  let iconElement = document.querySelector("#main-icon");

  document.querySelector("#city").innerHTML = city;
  document.querySelector("#temperature").innerHTML =
    Math.round(celsiusTemperature);
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed * 3.6
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;

  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "c4802a79f2723af59e192ad373430b29";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "c4802a79f2723af59e192ad373430b29";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temperature");
  temperature.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temperature");
  temperature.innerHTML = Math.round(celsiusTemperature);
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

searchCity("New York");
