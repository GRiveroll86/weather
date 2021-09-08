let cityName;
let cityLat;
let cityLon;
let searchBtnEl = document.getElementById("searchBtn");
let today = moment().format("M/D/YYYY");

function getCity() {

    let cityName = document.getElementById("searchInput").value;

    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=c17b02b3e52383eb9e3d41d0e52d5ea6")
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    cityLat = data.coord.lat;
                    cityLon = data.coord.lon;
                    document.getElementById("todayCityName").textContent = data.name + " " + "(" + today + ")";

                    // let img = document.createElement("img");
                    // img.src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png"
                    // let src = document.getElementById("todayCityName");
                    // src.appendChild(img);

                    let searchEl = document.createElement("p");
                    searchEl.setAttribute("class", "previousSearch");
                    searchEl.setAttribute("onclick", "searchPrevious()");
                    let searchText = document.createTextNode(cityName);
                    searchEl.appendChild(searchText);
                    let historyEl = document.getElementById("searchHistory");
                    historyEl.appendChild(searchEl)

                    localStorage.setItem("searched" + localStorage.length, cityName)
                    

                    getWeather();
                });
            } else {
                console.log('response', response);
                alert('Error: ' + response.statusText);

            }
        })
        .catch(function (error) {
            alert('Unable to connect' + error);
        });

}

function getWeather(){
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly&units=imperial&appid=c17b02b3e52383eb9e3d41d0e52d5ea6")
    .then(function (response) {
        if (response.ok) {
            console.log(response);
            response.json().then(function (data) {
                console.log(data);
                
                document.getElementById("todayTemp").textContent = "Temp: " + data.current.temp + " °F";
                document.getElementById("todayWind").textContent = "Wind: " + data.current.wind_speed + " MPH";
                document.getElementById("todayHum").textContent = "Humidity: " + data.current.humidity + " %";
                document.getElementById("todayUVI").textContent = "UV Index: " + data.current.uvi;

                for (let i = 0; i < 5; i++) {
                    let img = document.createElement("img");
                    img.src = "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png"
                    let src = document.getElementById("futureIcon" + (i + 1));
                    if (src.hasChildNodes()){
                        src.removeChild(src.firstChild)
                    }
                    src.appendChild(img);
                    document.getElementById("futureTemp" + (i + 1)).textContent = "Temp: " + data.daily[i].temp.day + " °F";
                    document.getElementById("futureWind" + (i + 1)).textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
                    document.getElementById("futureHum" + (i + 1)).textContent = "Humidity: " + data.daily[i].humidity + " %";
                }

                getFutureWeather();
                
            });
        } else {
            console.log('response', response);
            alert('Error: ' + response.statusText);

        }
    })
    .catch(function (error) {
        alert('Unable to connect' + error);
    });
}

// add class to future cards for styling, add date for next five days
function getFutureWeather() {

    for (let i = 0; i < 5; i++) {

        document.getElementById("futureContainer").getElementsByTagName("div")[i].className = "futureDay";

        let nextFiveDays = moment().add(i + 1, "d").format("M/D/YYYY");
        document.getElementById("futureDate" + (i + 1)).textContent = nextFiveDays;

    }

}

// create dom elements from local storage
function generateSearchHistory() {

    for (let i = 0; i < localStorage.length; i++) {
        let searchEl = document.createElement("p");
        searchEl.setAttribute("class", "previousSearch");
        searchEl.setAttribute("onclick", "searchPrevious()");
        let searchText = document.createTextNode(localStorage.getItem("searched" + i));
        searchEl.appendChild(searchText);
        let historyEl = document.getElementById("searchHistory");
        historyEl.appendChild(searchEl)
    }
}

function searchPrevious() {
    let searchText = document.querySelector(".previousSearch").innerText;
    console.log(searchText);
}


searchBtnEl.addEventListener("click", getCity)
document.addEventListener("DOMContentLoaded", generateSearchHistory)