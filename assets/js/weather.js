var recentSearchArr = [];
var currentDate = moment().format("YYYY-MM-DD kk:mm:ss");

var duplicate = false;
function loadRecent() {
    var loadedRecent = JSON.parse(localStorage.getItem("recentCities"));
    console.log(loadedRecent);
    $(loadedRecent).each(function (index, value) {
        console.log("Thsi is the value " + value);
        saveRecent(value);
    });
}
// inital call to load dom elements
loadRecent();
function getWeather() {
    // reinitiallize duplicate to false to check to see if there are dups
    duplicate = false;
    var searchCity = $("#searchCity").val();

    //fetch api
    fetch(
        "http://api.openweathermap.org/data/2.5/forecast?q=" +
            searchCity +
            "&appid=9b35244b1b7b8578e6c231fd7654c186&units=imperial"
    )
        .then(function (response) {
            if (response.ok) {
                saveRecent(searchCity);
                return response.json();
            } else {
                alert("Invalid City name");
                return;
            }
        })
        .then(function (response) {
            var currentCityLat = response.city.coord.lat;
            var currentCityLon = response.city.coord.lon;

            return fetch(
                "https://api.openweathermap.org/data/2.5/onecall?lat=" +
                    currentCityLat +
                    "&lon=" +
                    currentCityLon +
                    "&appid=9b35244b1b7b8578e6c231fd7654c186&units=imperial"
            );
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            // This is for the current temp/ humidity/ wind speed/ uv index
            $("#currentTemp").text(parseInt(response.current.temp) + "°");
            // searched city label
            $("#currentCity").text(searchCity);
            // main data
            $("#currentHumidity").text(
                "Humidity: " + response.current.humidity + "%"
            );
            $("#currentWindSpeed").text(
                "Wind Speed: " +
                    parseInt(response.current.wind_speed) +
                    "mph at " +
                    response.current.wind_deg +
                    "°"
            );
            $("#currentUvIndex").text("UV Index: " + response.current.uvi);
            console.log("This is the current uvi " + response.current.uvi);

            // this is for the 5 day temp
            console.log(response.list);

            let newCard = $("#dailyForecastContainer").empty();
            for (var i = 0; i < 5; i++) {
                $(newCard).append(
                    $("<div/>", {
                        class: "col-xl-2 col-md-4 col-12 m-2",
                    }).append(
                        $("<div/>", {
                            class: "card",
                            id: `futureDay${i}`,
                        })
                            .append(
                                $("<img>", {
                                    src: ` http://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}@2x.png`,
                                    class: "card-img-top pt-4 pb-4",
                                    alt: response.daily[i].weather.description,
                                })
                            )

                            .append(
                                $("<div/>", { class: "card-body" }).append(
                                    $("<span/>", {
                                        class: "card-title",
                                        id: `futureDay${i}temp`,
                                        text: Math.floor(
                                            response.daily[i].temp.day
                                        ),
                                    })
                                )
                            )
                            .append(
                                $("<ul>", {
                                    class: "list-group list-group-flush",
                                })
                                    .append(
                                        $("<li>", {
                                            class: "list-group-item",
                                            text: `Wind Speed: ${response.daily[i].wind_speed}`,
                                        })
                                    )
                                    .append(
                                        $("<li>", {
                                            class: "list-group-item",
                                            text: `Humidity:  ${response.daily[i].humidity}`,
                                        })
                                    )
                            )
                    )
                );
                console.log(newCard);
            }
        });
}
$("#button-addon2").on("click", function () {
    getWeather();
    $("#searchCity").val("").trigger("focus");
});
$("#recentSearches").on("click", ".btn", function (btn) {
    var clickedRecentCity = $(this).val();
    $("#searchCity").val(clickedRecentCity);
    getWeather();
    $("#searchCity").val("").trigger("focus");
});

function saveRecent(cityName) {
    var recentSearchBtn = $("<input>", {
        type: "button",
        value: cityName,
        class: "btn btn-lg",
    });
    verifyNoDup(cityName);

    console.log("are there any duplicates" + duplicate);
    if (!duplicate) {
        $("#recentSearches").append(recentSearchBtn);
        recentSearchArr.push(cityName);
        localStorage.setItem("recentCities", JSON.stringify(recentSearchArr));
        return;
    }

    function verifyNoDup(cityName) {
        for (var i = 0; i < recentSearchArr.length; i++) {
            console.log("recent search item " + recentSearchArr[i]);
            if (cityName === recentSearchArr[i] || cityName == "undefined") {
                return (duplicate = true);
            } else {
                dublicate = false;
            }
        }
    }
}

// if moment equals dt display current temp
