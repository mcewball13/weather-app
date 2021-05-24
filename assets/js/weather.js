var recentSearchArr = [];
var currentDate = new Date();
console.log(currentDate);
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
            return response.json();
        })
        .then(function (response) {
            let currentTime = "14:00:00";
            let dtText = response.list[0].dt_txt.split(" ")[1];

            // This is for the current temp/ humidity/ wind speed/ uv index
            var mainTemp = $("#currentTemp").text(
                parseInt(response.list[0].main.temp) + "°"
            );
            // parseInt(mainTemp[0].innerText);
            console.log(mainTemp);

            // this is for the 5 day
            for (var i = 0; i < response.list.length; i++)
                if (currentTime === dtText) {
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
