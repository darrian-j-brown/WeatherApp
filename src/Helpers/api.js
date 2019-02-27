// Call our server, and then send to updateState
export let getWeather = (lat, lng, update) => {
  let url = "http://localhost:8080/weather-api";
  url += "?lat=" + lat;
  url += "&lon=" + lng;

  fetch(url)
    .then(res => res.json())
    .then(({ weather, forecast }) => {
      update({ weather, forecast });
    });
};
