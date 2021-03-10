$(document).ready(function () {
  //grabs value in seach input
  $("#search").on("click", function () {
    var searchParams = $("#searchField").val();

    // clear search box
    $("#searchField").val("");

    //executes with seachfield value
    getCurrentWeather(searchParams);
  });

  //Applies search weather on click to zip search History list
  $(".searchHistory").on("click", "li", function () {
    getCurrentWeather($(this).text());
  });

  var APIKEY = "2bffc64c25674c9a8bfe824aa46e4aed";

  //Creates a new search searchHistory item
  function makeHistItem(text) {
    var li = $("<li>")
      .addClass("list-group-item list-group-item-action")
      .text(text);
    $(".searchHistory").append(li);
  }

  function getCurrentWeather(searchParams) {
    $.ajax({
      type: "GET",
      url:
        "http://api.openweathermap.org/data/2.5/weather?q=" +
        searchParams +
        "&appid=" +
        APIKEY +
        "&units=imperial",
      dataType: "json",
      success: function (data) {
        //create searchHistory link for this search and set to local storage
        if (searchHistory.indexOf(searchParams) === -1) {
          searchHistory.push(searchParams);
          window.localStorage.setItem(
            "searchHistory",
            JSON.stringify(searchHistory)
          );

          makeHistItem(searchParams);
        }

        // clear any old content
        $(".currentWeatheContainer").empty();

        //create city date & icon elements
        var title = $("<h2>").text(
          data.name + " " + new Date().toLocaleDateString()
        );
        var img = $("<img>").attr(
          "src",
          "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
        );
        //add to page
        $("#todayWeather").append(title, img);

        //create current weather elements
        var tempLabel = $("<h4>").text("Temperature");
        var temp = $("<h5>").text(data.main.temp + " °F");
        var windLabel = $("<h4>").text("Wind Speed");
        var wind = $("<h5>").text(data.wind.speed + "mph");
        var humidLabel = $("<h4>").text("Humidity");
        var humidity = $("<h5>").text(data.main.humidity + "%");

        //add to page
        $("#currentTemp").append(tempLabel, temp);
        $("#currentHumid").append(humidLabel, humidity);
        $("#currentWind").append(windLabel, wind);
        $;

        // call remaining two api endpoints
        getForecast(searchParams);
        getUVIndex(data.coord.lat, data.coord.lon);
      },
    });
  }
  //API call to get forcast
  function getForecast(searchParams) {
    $.ajax({
      type: "GET",
      url:
        "http://api.openweathermap.org/data/2.5/forecast?q=" +
        searchParams +
        "&appid=" +
        APIKEY +
        "&units=imperial",
      dataType: "json",
      success: function (data) {
        // overwrite any existing content with title and empty row
        $("#forecast")
          .html('<h4 class="mt-3">5-Day Forecast:</h4>')
          .append('<div class="row">');

        // loop over all forecasts (by 3-hour increments)
        for (var i = 0; i < data.list.length; i++) {
          // only look at forecasts around 3:00pm
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            // create html elements for a bootstrap card
            var col = $("<div>").addClass("col-md-2");
            var card = $("<div>").addClass("card bg-primary text-white");
            var body = $("<div>").addClass("card-body p-2");

            var title = $("<h5>")
              .addClass("card-title")
              .text(new Date(data.list[i].dt_txt).toLocaleDateString());

            var img = $("<img>").attr(
              "src",
              "http://openweathermap.org/img/w/" +
                data.list[i].weather[0].icon +
                ".png"
            );

            var p1 = $("<p>")
              .addClass("card-text")
              .text("Temp: " + data.list[i].main.temp_max + " °F");
            var p2 = $("<p>")
              .addClass("card-text")
              .text("Humidity: " + data.list[i].main.humidity + "%");

            // merge together and put on page
            col.append(card.append(body.append(title, img, p1, p2)));
            $("#forecast .row").append(col);
          }
        }
      },
    });
  }
  //retreive and append UV
  function getUVIndex(lat, lon) {
    $.ajax({
      type: "GET",
      url:
        "http://api.openweathermap.org/data/2.5/uvi?appid=" +
        APIKEY +
        "&lat=" +
        lat +
        "&lon=" +
        lon,
      dataType: "json",
      success: function (data) {
        var uv = $("<p>").text("UV Index: ");
        var btn = $("<span>").addClass("btn btn-sm").text(data.value);

        // change color depending on uv value
        if (data.value < 3) {
          btn.addClass("btn-success");
        } else if (data.value < 7) {
          btn.addClass("btn-warning");
        } else {
          btn.addClass("btn-danger");
        }

        $("#today .card-body").append(uv.append(btn));
      },
    });
  }

  // if there is a search hostory get current searchHistory
  var searchHistory =
    JSON.parse(window.localStorage.getItem("searchHistory")) || [];

  if (searchHistory.length > 0) {
    getCurrentWeather(searchHistory[searchHistory.length - 1]);
  }

  for (var i = 0; i < searchHistory.length; i++) {
    makeHistItem(searchHistory[i]);
  }
});
