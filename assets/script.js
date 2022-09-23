let searchHistory = []
const historyEl = document.getElementById("history")
const search = document.getElementById("search-button")
let clearEl = document.getElementById("clear-history")
const APIKey = "981ead18d7328e5f3ebe8d665a0eeefd"
function getURL(city) {
    return `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=981ead18d7328e5f3ebe8d665a0eeefd`
}
var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  function getWindSpeed(data) {
    return data["wind"]["speed"]
  }
  function getWeatherMain(data) { 
    return data["weather"][0]["icon"]
  }
  function getHumidity(data){
    return data["main"]["humidity"]
  }
  function getTemp(data){
    return data["main"]["temp"]
  }
  function getDate(data) {
    var dateTime = data["dt_txt"]
    return dateTime.split(" ")[0]
  }
  async function fiveDaysApi(urlRequest) {
    const response = await fetch(urlRequest)
        .then(function (data) {
            return data.json();
        }).then(function (data) {
            const windSpeeds = []
            const weatherMains = []
            const humidities = []
            const temps = []
            const dates = []
            const recordCount = data["cnt"]
            for (let i = 0; i < recordCount; i += 1) {
                let record = data.list[i];
                windSpeeds.push(getWindSpeed(record))
                weatherMains.push(getWeatherMain(record))
                humidities.push(getHumidity(record))
                temps.push(getTemp(record))
                dates.push(getDate(record))
            }
            let days = propogateData(dates, windSpeeds, weatherMains, humidities, temps)
            return days
        })
    return await response
}
function propogateData(dates, windSpeeds, weatherMains, humidities, temps) {
    days = {}
    for (let i = 0; i < dates.length; i ++) {
        let currentDate = dates[i]
        let currentWindSpeed = windSpeeds[i]
        let currentWeatherMain= weatherMains[i]
        let currentHumidity = humidities[i]
        let currentTemp = temps[i]
        
        //if current date does not exist in days
        if (!(currentDate in days)){
            days[currentDate] = {"windSpeeds" : [currentWindSpeed],
                                 "weatherMains" :[currentWeatherMain],
                                 "humidities" : [currentHumidity],
                                 "temps" : [currentTemp]
                                }

            
        }
        else {
            //if current date does exist in days
            days[currentDate]["windSpeeds"].push(currentWindSpeed)
            days[currentDate]["weatherMains"].push(currentWeatherMain)
            days[currentDate]["humidities"].push(currentHumidity)
            days[currentDate]["temps"].push(currentTemp)
        }
    }
    days = calculateAverages(days)
    return days
}
function getAverage(arr) {
    let sum = 0
    for (let i = 0; i < arr.length; i ++){
        sum += arr[i]
    }
    let average = sum / arr.length
    return average.toFixed(2)
}
function calculateAverages(days) {
    for(let date in days){
       days[date]["temps"] = getAverage(days[date]["temps"])
       days[date]["windSpeeds"] = getAverage(days[date]["windSpeeds"])
       days[date]["humidities"] = getAverage(days[date]["humidities"])
       days[date]["weatherMains"] = days[date]["weatherMains"][0]
    }
    return days
}
function fetchAndRender(url, city) {
    const fiveDayParent = document.getElementById("fiveday-header")
    fiveDayParent.classList.remove("d-none")
    const fiveDayHeader = fiveDayParent.querySelector("h3")
    fiveDayHeader.innerText = `5 Day Forecast for ${city}`
    fiveDaysApi(url).then((data)=>{
        let firstKey = Object.keys(data)[0]
        const currentDay = data[firstKey]
        delete data[firstKey]
        renderCards(data)
    })
}
function renderCards(data) {
    const parentDiv = document.getElementById("5-day")
    removeAllChildNodes(parentDiv)
    let keys = Object.keys(data)
    for (let i = 1; i <= keys.length; i++) {
        const outerDiv = document.createElement("div")
        outerDiv.id = `day-${i}`
        let classList = "p-2 text-center col-md-2 forecast bg-primary text-white m-2 rounded".split(" ");
        classList.forEach(function (css) {
            outerDiv.classList.add(css)
        })
        parentDiv.appendChild(outerDiv)
    
        const record = data[keys[i-1]]
        const dateDiv = document.createElement("div")
        dateDiv.style.fontSize = "16px"
        dateDiv.style.fontWeight ="bold"
        dateDiv.innerText = keys[i-1]
        const weatherMainImg = document.createElement("img")
        weatherMainImg.setAttribute("src", "https://openweathermap.org/img/wn/" + record["weatherMains"] + "@2x.png");
        const tempDiv = document.createElement("div")
        tempDiv.innerText = `Temp: ${record["temps"]} °F`
        const windDiv = document.createElement("div")
        windDiv.innerText = `Wind: ${record["windSpeeds"]} MPH`
        const humidityDiv = document.createElement("div")
        humidityDiv.innerText = `Humidity: ${record["humidities"]} %`
        outerDiv.appendChild(dateDiv)
        outerDiv.appendChild(weatherMainImg)
        outerDiv.appendChild(tempDiv)
        outerDiv.appendChild(windDiv)
        outerDiv.appendChild(humidityDiv)
    }
}
function renderSearchHistory() {
    historyEl.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
        const historyItem = document.createElement("div");
        historyItem.setAttribute("class", "form-control d-block bg-white");
        historyItem.innerText = searchHistory[i]
        historyItem.addEventListener("click", function () {
            fetchAndRender(getURL(searchHistory[i]), searchHistory[i])
        })
        historyEl.appendChild(historyItem);
    }
}
search.addEventListener("click", function () {
    const city = document.getElementById("enter-city").value
    document.getElementById("enter-city").value = ""
    searchHistory.push(city)
    const url = getURL(city)
    fetchAndRender(url, city)
    renderSearchHistory()
})

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
clearEl.addEventListener("click", function () {
    searchHistory = [];
    renderSearchHistory();
})
