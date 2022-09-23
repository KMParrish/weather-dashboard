let searchHistory = []
const historyEl = document.getElementById("history");
const search = document.getElementById("search-button")
const APIKey = "981ead18d7328e5f3ebe8d665a0eeefd"
var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  function getWindSpeed(data) {
    return data["wind"]["speed"]
  }
  function getWeatherMain(data) { 
    return data["weather"][0]["main"]
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
            console.log(data);
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
            var days = propogateData(dates, windSpeeds, weatherMains, humidities, temps)
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

search.addEventListener("click", function () {
    function renderSearchHistory() {
        historyEl.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click", function () {
                fiveDaysApi(historyItem.value);
            })
            historyEl.append(historyItem);
        }
    }
    function renderCards(data) {
        for (let i = 1; i <= data.length; i++) {
            const outerDiv = document.createElement("div")
            outerDiv.id = `day-${i}`
        }
    }
    const city = document.getElementById("enter-city").value
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=981ead18d7328e5f3ebe8d665a0eeefd`
    console.log(city)
    fiveDaysApi(url).then((data)=>{
        
    })
    console.log(data)
})
