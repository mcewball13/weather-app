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
function checkTime5Day(data) {}
function getWeather() {
    // reinitiallize duplicate to false to check to see if there are dups
    duplicate = false;
    var searchCity = $("#searchCity").val();
    saveRecent(searchCity);

    //fetch api
    fetch(
        "http://api.openweathermap.org/data/2.5/forecast?q=" +
            searchCity +
            "&appid=9b35244b1b7b8578e6c231fd7654c186&units=imperial"
    )
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                alert("Invalid City name");
                return;
            }
        })
        .then(function (response) {
            let currentTime = "14:00:00";

            // This is for the current temp/ humidity/ wind speed/ uv index
            var mainTemp = $("#currentTemp").text(
                parseInt(response.list[0].main.temp) + "°"
            );
            // searched city label
            $("#currentCity").text(searchCity);
            // main data
            $("#currentHumidity").text(
                "Humidity: " + response.list[0].main.humidity + "%"
            );
            $("#currentWindSpeed").text(
                "Wind Speed: " +
                    parseInt(response.list[0].wind.speed) +
                    "mph at " +
                    response.list[0].wind.deg +
                    "°"
            );
            // this is for the 5 day temp
            console.log(response.list);
            var nextDay = moment().add(1, "d").format("YYYY-MM-DD 14:00:00");
            for (var i = 0; i < response.list.length; i++) {
                let dtText = response.list[i].dt_txt;
                if (dtText === nextDay)
                    console.log(
                        "This is all the dt-text's" + response.list[i].dt_txt
                    );
            }

            // if ( === "14:00:00") {
            //     console.log("This is all the 2 oclocks");
            // }
            // console.log("This is the moment time " + nextDay);

            // for (var i = 0; i < response.list.length; i++) {
            //     console.log("This is dt Text " + dtText);
            //     if (nextDay === dtText) {
            //     }
            // }
            // var fiveDayDt = response.list[i].main.temp;
            // if (currentTime === fiveDayDt) {
            // }

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
            // print UV index
            $("#currentUvIndex").text("UV Index: " + response.current.uvi);
            console.log("This is the current uvi " + response.current.uvi);
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

    // console.log($("#recentSearches").children()[0].value);

    // if (recentSearchArr.length <= 6) {
    //     var i = 0;
    //     $("#recentSearches").each(function (btn) {
    //         recentSearchArr.push($("#recentSearches").children()[i].value);
    //         i++;
    //     });
    //     localStorage.setItem("recentCities", JSON.stringify(recentSearchArr));
    // }
}

// if moment equals dt display current temp
