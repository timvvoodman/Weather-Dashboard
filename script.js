//GIVEN a weather dashboard with form inputs

//WHEN I search for a city
//THEN I am presented with current and future conditions for that city and that city is added to the search history
//After reaching 8 searches the oldest seash is removed from the search history list
$("#search").click(function () {
  let searchField = $("#searchField").val();
  let listLength = $(".searchList").length;
  const newDiv = $(`<div class="row, searchList">${searchField}</div>`);
  console.log(listLength);
  console.log(searchField);

  $("#history").prepend(newDiv);
  if (listLength > 8) {
    $("#history").slice(8).remove();
  }
});

//WHEN I view current weather conditions for that city
//THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed,
// and the UV index

//WHEN I view the UV index
//THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

//WHEN I view future weather conditions for that city
//THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature,
// and the humidity

//WHEN I click on a city in the search history
//THEN I am again presented with current and future conditions for that city

//WHEN I open the weather dashboard
//THEN I am presented with the last searched city forecast
