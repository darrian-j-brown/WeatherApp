import React from "react";

import {
  splitUpDays,
  formatDays,
  getImgURL,
  fixTemp,
  chopOffDays
} from "../Helpers/fixData";

let ForecastDay = ({ dayString, tempHigh, tempLow, icon }) => {
  let imgURL = getImgURL(icon);
  tempHigh = fixTemp(tempHigh); //From Kelvin
  tempLow = fixTemp(tempLow);

  return (
    <div className="ForecastDay">
      <div className="ForecastDayString">{dayString}</div>
      <img src={imgURL} alt="Missing Icon" />
      <div className="ForecastTemps">
        <span className="High">{tempHigh + "°"}</span>
        {"/"}
        <span className="Low">{tempLow + "°"}</span>
      </div>
    </div>
  );
};

let Forecast = ({ info, data }) => {
  let { timeOffset } = info;

  let days = splitUpDays(data, timeOffset); //Separate Into Different days of week
  days = chopOffDays(days); //Can only have 5 days
  days = formatDays(days, timeOffset); //Combine each data into formattted data

  return (
    <div className="Forecast">
      <div className="ForecastHeader">5 Day Forecast</div>
      <div className="ForecastDays">
        {days.map(data => (
          <ForecastDay {...data} />
        ))}
      </div>
    </div>
  );
};

export default Forecast;
