import React from "react";

import { fixTemp, getDate, getTimeString, getImgURL } from "../Helpers/fixData";

let Weather = ({ info, data }) => {
  //Get New York, NY
  //Won't have location stored for HTML Geolocation
  //Will grab worse data from OpenWeatherAPI
  let { location, timeOffset } = info;
  if (!location) {
    let name = data.name;
    let country = data.sys.country;
    location = name + ", " + country;
  }

  //Get local timestamp, convert to readable string
  let date = getDate(data.dt, timeOffset);
  let currTime = getTimeString(date);

  //Mist / Cloudy
  let weatherType = data.weather[0].main;

  //10b [sunny night icon]
  let weatherIcon = data.weather[0].icon;
  let imgURL = getImgURL(weatherIcon);

  //Get fahrenheit converted temperature
  let { temp } = data.main;
  temp = fixTemp(temp);

  return (
    <div className="Weather">
      <div className="WeatherOverview">
        <div className="CityName"> {location} </div>
        <div className="Time"> {currTime} </div>
        <div className="WeatherType"> {weatherType}</div>
      </div>
      <img src={imgURL} alt={weatherType} />
      <div className="Temperature">{temp + "°"}</div>
    </div>
  );
};

export default Weather;
