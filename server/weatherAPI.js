let axios = require("axios");

//Build our OpenWeatherAPI Url
// let getUrl = (type, lat, lon) => {
//   let url = "";
//   url += "https://api.openweathermap.org/data/2.5/" + type;
//   url += "?lat=" + lat;
//   url += "&lon=" + lon;
//   url += "&appid=b48bb8b80a8a300bdae80be70fa028d9";

//   return url;
// };

let getUrl = (type, data) => {
  console.log('data', data);
  const { lat, lon, city, zip} = data;
  let url = "";
  url += "https://api.openweathermap.org/data/2.5/" + type;
  if(lat && lon) {
    url += "?lat=" + lat;
    url += "&lon=" + lon;
  } else if(city) {
    url += "?q=" + city;
  } else if(zip) {
    url += "?zip=" + zip;
  }
  url += "&appid=b48bb8b80a8a300bdae80be70fa028d9";
  return url;
};

//Async API Call
// let getData = (type, lat, lon) =>
//   new Promise((resolve, reject) => {
//     let url = getUrl(type, lat, lon);

//     axios
//       .get(url)
//       .then(res => {
//         resolve(res.data);
//       })
//       .catch(err => {
//         reject(err.message);
//       });
//   });

  let getData = (type, data) =>
  new Promise((resolve, reject) => {
    let url = getUrl(type, data);
    console.log('url', url);

    axios
      .get(url)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject('server error ', err.message);
      });
  });

//Get Weather and Forecast Parallel, and send to client
module.exports = async (req, res) => {
  //Get coordinates from request
  let { lat, lon, city, zip } = req.query;
  let data = req.query;


  //Call APIs
  let weather = getData("weather", data);
  let forecast = getData("forecast", data);

  //Parallel API Await
  [weather, forecast] = [await weather, await forecast];

  //Send Data to client
  res.json({
    weather,
    forecast
  });

  console.log("Got Weather Data for", forecast);
};
