var searchHistory = [];
var APIKey = "ae68c7eaef9e48c0d882f20378c62112"
function getItems() {
    var storedCities = JSON.parse(localStorage.getItem("searchHistory"));
    if (storedCities !== null) {
        searchHistory = storedCities;
    };
    for (i = 0; i < searchHistory.length; i++) {
        if (i == 4) {
            break;
          }
        cityListButton = $("<a>").attr({
            class: "list-group-item list-group-item-action",
            href: "#"
        });
        cityListButton.text(searchHistory[i]);
        $(".list-group").append(cityListButton);
    }
};
var city;
var mainCard = $(".card-body");
getItems();
function getData() { 
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ae68c7eaef9e48c0d882f20378c62112 "
    mainCard.empty();
    $("#weeklyForecast").empty();
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var date = moment().format("YYYY/MM/DD");
        var iconCode = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
        var name = $("<h3>").html(city + date);
        mainCard.prepend(name);
        mainCard.append($("<img>").attr("src", iconURL));
        var temp = (response.main.temp - 273.15) * 1.80 + 32;
        mainCard.append($("<p>").html("Temperature: " + temp + "&#8457"));
        var humidity = response.main.humidity;
        mainCard.append($("<p>").html("Humidity: " + humidity));
        var windSpeed = response.wind.speed;
        mainCard.append($("<p>").html("Wind Speed: " + windSpeed));
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=" + "ae68c7eaef9e48c0d882f20378c62112" +"&lat=" + lat + "&lon=" + lon,
            method: "GET"
        }).then(function (response) {
            mainCard.append($("<p>").html("UV Index: <span>" + response.value + "</span>"));
            // 
            if (response.value <= 2) {
                $("span").attr("class", "btn btn-outline-success");
            };
            if (response.value > 2 && response.value <= 5) {
                $("span").attr("class", "btn btn-outline-warning");
            };
            if (response.value > 5) {
                $("span").attr("class", "btn btn-outline-danger");
            };
        })
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=ae68c7eaef9e48c0d882f20378c62112",
            method: "GET"
        }).then(function (response) {
            for (i = 0; i < 5; i++) {
                var newCard = $("<div>").attr("class", "col five bg-dark text-white rounded-lg p-2");
                $("#weeklyForecast").append(newCard);
                var myDate = new Date(response.list[i * 4].dt * 1000);
                newCard.append($("<h4>").html(myDate.toLocaleDateString()));
                var iconCode = response.list[i * 4].weather[0].icon;
                var iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
                newCard.append($("<img>").attr("src", iconURL));
                var temp = Math.round((response.list[i * 4].main.temp - 273.15) * 1.80 + 32);
                newCard.append($("<p>").html("Temp: " + temp + "&#8457"));
                var humidity = response.list[i * 4].main.humidity;
                newCard.append($("<p>").html("Humidity: " + humidity));
            }
        })
    })
};
$("#searchCity").click(function() {
    city = $("#city").val();
    getData();
    var checkArray = searchHistory.includes(city);
    if (checkArray == true) {
        return
    }
    else {
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        var cityListButton = $("<a>").attr({
            class: "list-group-action-item",
            href: "#"
        });
        cityListButton.text(city);
        $(".list-group").append(cityListButton);
    };
});
$(".list-group-item").click(function() {
    city = $(this).text();
    getData();
});