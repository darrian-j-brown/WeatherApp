let axios = require("axios");

//Build our OpenWeatherAPI Url
let getUrl = (type, lat, lon) => {
  let url = "";
  url += "https://api.openweathermap.org/data/2.5/" + type;
  url += "?lat=" + lat;
  url += "&lon=" + lon;
  url += "&appid=b48bb8b80a8a300bdae80be70fa028d9";

  return url;
};

//Async API Call
let getData = (type, lat, lon) =>
  new Promise((resolve, reject) => {
    let url = getUrl(type, lat, lon);

    axios
      .get(url)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.message);
      });
  });

//Get Weather and Forecast Parallel, and send to client
module.exports = async (req, res) => {
  //Get coordinates from request
  let { lat, lon } = req.query;

  //Call APIs
  let weather = getData("weather", lat, lon);
  let forecast = getData("forecast", lat, lon);

  //Parallel API Await
  [weather, forecast] = [await weather, await forecast];

  //Send Data to client
  res.json({
    weather,
    forecast
  });

  console.log("Got Weather Data for", weather.name);
};
