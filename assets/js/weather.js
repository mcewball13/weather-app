var recentSearchArr = [];
var currentDate = moment().format("MMM Do");
var loadedRecent = [];
var duplicate = false;
function loadRecent() {
    // initalize date
    $("#currentDate").text(currentDate);
    // load from local storage
    loadedRecent = JSON.parse(localStorage.getItem("recentCities"));
    if (loadedRecent !== null) {
        $(loadedRecent).each(function (index, value) {
            saveRecent(value);
        });
    } else {
        recentSearchArr = [];
        return $("#recentSearches").empty();
    }
}
// inital call to load dom elements
loadRecent();
function getWeather() {
    // reinitiallize duplicate to false to check to see if there are dups
    duplicate = false;
    var searchCity = $("#searchCity").val();

    //fetch api
    fetch(
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
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
            if (response.current.weather[0].icon === "04d") {
                $("body").css(
                    "background-image",
                    "url(assets/images/background-images/JPEG/cloudy.jpg)"
                );
            }
            if (
                response.current.weather[0].icon === "03d" ||
                response.current.weather[0].icon === "02d"
            ) {
                $("body").css(
                    "background-image",
                    "url(assets/images/background-images/JPEG/partly-cloudy.jpg)"
                );
            }
            if (response.current.weather[0].icon === "01d") {
                $("body").css(
                    "background-image",
                    "url(assets/images/background-images/JPEG/sunny.jpg)"
                );
            }
            if (
                response.current.weather[0].icon === "09d" ||
                response.current.weather[0].icon === "10d" ||
                response.current.weather[0].icon === "50d"
            ) {
                $("body").css(
                    "background-image",
                    "url(assets/images/background-images/JPEG/rainy.jpg)"
                );
            }
            if (response.current.weather[0].icon === "11d") {
                $("body").css(
                    "background-image",
                    "url(assets/images/background-images/JPEG/thunder-storm.jpg)"
                );
            }
            if (response.current.weather[0].icon === "13d") {
                $("body").css(
                    "background-image",
                    "url(assets/images/background-images/JPEG/snowy.jpg)"
                );
            }

            // this is for the 5 day temp

            let newCard = $("#dailyForecastContainer").empty();
            for (var i = 0; i < 5; i++) {
                // Loops through and creat all the plates
                $(newCard).append(
                    $("<div/>", {
                        class: "col-xl-2 col-md-4 col-12 m-2",
                    }).append(
                        $("<div/>", {
                            class: "card",
                            id: `futureDay${i}`,
                        })
                            .append(
                                $("<p>", {
                                    text: moment
                                        .unix(response.daily[i].dt)
                                        .format("MMM Do"),
                                    class: "text-center",
                                })
                            )

                            .append(
                                $("<img>", {
                                    src: ` http://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}@2x.png`,
                                    class: "card-img-top pt-4 pb-4",
                                    alt: response.daily[i].weather.description,
                                })
                            )

                            .append(
                                $("<div/>", {
                                    class: "card-body d-flex justify-content-around no-wrap",
                                }).append(
                                    $("<span/>", {
                                        class: "card-title",
                                        id: `futureDay${i}HighTemp`,
                                        text:
                                            "High: " +
                                            Math.floor(
                                                response.daily[i].temp.max
                                            ),
                                    }),
                                    $("<span/>", {
                                        class: "card-title",
                                        id: `futureDay${i}LowTemp`,
                                        text:
                                            "Low: " +
                                            Math.floor(
                                                response.daily[i].temp.min
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
                                            text: `Wind Speed: ${Math.floor(
                                                response.daily[i].wind_speed
                                            )}mph`,
                                        })
                                    )
                                    .append(
                                        $("<li>", {
                                            class: "list-group-item",
                                            text: `Humidity:  ${response.daily[i].humidity}% `,
                                        })
                                    )
                            )
                    )
                );
            }
        });
}
// event Listeners
$("#clearRecent").on("click", function () {
    localStorage.removeItem("recentCities");
    loadRecent();
});

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
// functions
function saveRecent(cityName) {
    var recentSearchBtn = $("<input>", {
        type: "button",
        value: cityName,
        class: "btn btn-lg",
    });
    verifyNoDup(cityName);

    if (!duplicate) {
        $("#recentSearches").append(recentSearchBtn);
        recentSearchArr.push(cityName);
        localStorage.setItem("recentCities", JSON.stringify(recentSearchArr));
        return;
    }

    function verifyNoDup(cityName) {
        for (var i = 0; i < recentSearchArr.length; i++) {
            if (cityName === recentSearchArr[i] || cityName == "undefined") {
                return (duplicate = true);
            } else {
                dublicate = false;
            }
        }
    }
}
function clearRecent() {
    localStorage.removeItem("recentCities");
    loadRecent();
}
