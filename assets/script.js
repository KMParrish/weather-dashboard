function initPage() {
    const cityEl = document.getElementById("enter-city");
    const searchEl = document.getElementById("search-button");
    const clearEl = document.getElementById("clear-history");
    const nameEl = document.getElementById("city-name");
    const currentPicEl = document.getElementById("current-pic");
    const currentTempEl = document.getElementById("temperature");
    const currentHumidityEl = document.getElementById("humidity");
    const currentWindEl = document.getElementById("wind-speed");
    const currentUVEl = document.getElementById("UV-index");
    const historyEl = document.getElementById("history");
    var fivedayEl = document.getElementById("fiveday-header");
    var todayweatherEl = document.getElementById("today-weather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
}
let city;
let url;
const search = document.getElementById("search-button")
const APIKey = "981ead18d7328e5f3ebe8d665a0eeefd"
var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("https://api.openweathermap.org/data/2.5/forecast?q=San Antonio&units=imperial&appid=981ead18d7328e5f3ebe8d665a0eeefd", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error)); 

  search.addEventListener("click", function () {
    city = document.getElementById("enter-city").value
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=981ead18d7328e5f3ebe8d665a0eeefd`
    console.log(city)
  })
  