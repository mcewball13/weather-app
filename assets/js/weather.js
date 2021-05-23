var recentSearchArr = [];
var currentDate = moment();
console.log(currentDate);

function getWeather() {
    var searchCity = $("#searchCity").val();
    saveRecent(searchCity);

    //fetch api
    fetch(
        "http://api.openweathermap.org/data/2.5/forecast?q=" +
            searchCity +
            "&appid=9b35244b1b7b8578e6c231fd7654c186"
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            let currentTime = "14:00:00";
            let dtText = response.list[0].dt_txt.split(" ")[1];
            let localTime = parseInt(dtText) - 7;
            console.log("this is local time " + localTime);
            console.log("this is the dt text " + dtText);
            console.log("api response", response);
        });
}
$("#button-addon2").on("click", function () {
    getWeather();
});
$("#recentSearches").on("click", ".btn", function (btn) {
    var clickedRecentCity = $(this).val();
    $("#searchCity").val(clickedRecentCity);
    getWeather();
});

function saveRecent(cityName) {
    var recentSearchBtn = $("<input>", {
        type: "button",
        value: cityName,
        class: "btn btn-lg",
    });
    var duplicate = verifyNoDup(cityName);
    console.log("are there any duplicates" + duplicate);
    if (!duplicate) {
        $("#recentSearches").append(recentSearchBtn);
        recentSearchArr.push(cityName);
        localStorage.setItem("recentCities", JSON.stringify(recentSearchArr));
        return;
    }

    function verifyNoDup(cityName) {
        for (var i = 0; i < recentSearchArr.length; i++) {
            console.log("recent search item" + recentSearchArr[i]);
            if (cityName === recentSearchArr[i] || cityName == "undefined") {
                return true;
            } else {
                return false;
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
