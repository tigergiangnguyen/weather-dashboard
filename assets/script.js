// Global variables used
var apiKey = "7fbebb5d92f6457238a211685bff8ea3";
var city= "";
var searchCity = $("#searchCity");
var searchButton = $("#searchButton");
var clearButton = $("#clearSearch");
var currentCity = $("#currentCity");
var currentTemperature = $("#temperature");
var currentHumidty= $("#humidity");
var currentWSpeed= $("#windSpeed");
var resultCity= [];

function currentWeather(city) {
// Retrieving weather forecast data for a specific city also using a JQuery fetch
    const queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey;
    $.ajax ({
        url: queryUrl,
        method: "GET",
    }).then(function(response) {

// Using JQuery to select and update an HTML element on the web page (To current weather(Big section of the display weather))
    const weatherIcon = response.weather[0].icon;
    const iconUrl = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
    const date = new Date(response.dt * 1000).toLocaleDateString();
    $(currentCity).html(response.name + "("+date+")" + "<img src=" + iconUrl + ">");

    const tempF = (response.main.temp - 273.15) * 1.80 + 32;
    $(currentTemperature).html((tempF).toFixed(2) + "&#8457");
    $(currentHumidty).html(response.main.humidity + "%");
    const wSpeed = response.wind.speed;
    const windsMph=(wSpeed * 2.237).toFixed(1);
    $(currentWSpeed).html(windsMph + "MPH");
    forecast(response.id);
    
// The search cities are store into local storage and sees If successful then returns the current cities data
    if (response.cod == 200) {
        resultCity = JSON.parse(localStorage.getItem("cityname"));
        if (resultCity == null) {
            resultCity = [];
            resultCity.push(city.toUpperCase());
            localStorage.setItem("cityname", JSON.stringify(resultCity));
            addToList(city);
    }
    else {
        if(find(city) > 0){
            resultCity.push(city.toUpperCase());
            localStorage.setItem("cityname", JSON.stringify(resultCity));
            addToList(city);
            }
        }
    }
});
};

// Find a search returns valid, all storage value is displayed upper case letters
function find(c) {
    for (var i = 0; i < resultCity.length; i++) {
        if (c.toUpperCase() === resultCity[i]) {
            return -1;
        }
    }
return 1;
};

// Displays current weather (Today) and displays 5 days weather conditions following after
function displayWeather(event) {
    event.preventDefault();
    if (searchCity.val().trim() !== "") {
        city = searchCity.val().trim();
        currentWeather(city);
    }
};


function forecast(cityid) {
// Retrieving weather forecast data for a specific city also using a JQuery fetch
    const queryForecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityid + "&appid=" + apiKey;
    $.ajax({
        url: queryForecastURL,
        method: "GET"
    }).then(function(response) {
        
// Creates a loop so each selector is created once and update each mutiple times starting at 0
    for (i = 0; i < 5; i++) {
        const date = new Date((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
        const iconcode = response.list[((i + 1) * 8) - 1].weather[0].icon;
        const iconUrl = "https://openweathermap.org/img/wn/" + iconcode + ".png";
        const tempK = response.list[((i + 1) * 8) - 1].main.temp;
        const tempF = (((tempK - 273.5) * 1.80) + 32).toFixed(2);
        const humidity = response.list[((i + 1) * 8) - 1].main.humidity;
        const ws = response.list[((i + 1) * 8) - 1].wind.speed;
        
        $("#date" + i).html(date);
        $("#image" + i).html("<img src=" + iconUrl + ">");
        $("#temper" + i).html(tempF + "&#8457");
        $("#hum" + i).html(humidity + "%");
        $("#wSpeed" + i).html(ws + "MPH");
    }    
    });
};

// Adding new cities to a list
function addToList(c) {
    const listEl = $("<li>" + c.toUpperCase() + "</li>");
    $(listEl).attr("class", "list-group-item");
    $(listEl).attr("data-value", c.toUpperCase());
    $(".list-group").append(listEl);
};

// Display for the user to click on the city again to run a search function with that value.
function invokePastSearch(event) {
    const liEl = event.target;
    if (event.target.matches("li")){
        city= liEl.textContent.trim();
        currentWeather(city);
    }
};

// Adds a list of the user's recent city search
function loadlastCity() {
    $("ul").empty();
    const resultCity = JSON.parse(localStorage.getItem("cityname"));
    if(resultCity !== null) {
        resultCity = JSON.parse(localStorage.getItem("cityname"));
        for(i = 0; i < resultCity.length; i++){
            addToList(resultCity[i]);
        }
        city = resultCity[i-1];
        currentWeather(city);
    }
};

// When the user clicks "Clear Search" button, removes all value from local storage
function clearSearch(event) {
    event.preventDefault();
    resultCity = [];
    localStorage.removeItem("cityname");
    document.location.reload();
};

// An event handler when user clicks
$("#searchButton").on("click", displayWeather);
$("#clearSearch").on("click", clearSearch);
$(document).on("click", invokePastSearch);
$(window).on("load", loadlastCity);