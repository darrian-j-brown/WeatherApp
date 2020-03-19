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

export let getWeatherByMe = (data, update) => {
  const { lat, lng, city, zip } = data;
  let url = "http://localhost:8080/weather-api";
  if(lat && lng) {
    console.log('coor')
    url += "?lat=" + lat;
    url += "&lon=" + lng;
  } else if(city) {
    console.log('city')
    url += "?city=" + city;
  } else if(zip) {
    console.log('zip')
    url += "?zip=" + zip;
  }
  
  fetch(url)
    .then(res => res.json())
    .then(({ weather, forecast }) => {
      update({ weather, forecast });
    })
    .catch((error) => {
      console.log('error', error)
    })
};
