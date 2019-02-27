//Kelvin to Fahrenheit
export let fixTemp = temp => Math.round((temp * 9) / 5 - 459.67);

let dayArr = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
//new Date => Wednesday
export let getWeekDay = date => dayArr[date.getDay()];
//new Date => Wed
export let getShortWeekDay = date => getWeekDay(date).slice(0, 3);

//Get local date from timestamp
export let getDate = (timestamp, timeOffset) => {
  let offsetChange = 0;
  if (timeOffset !== null) {
    let now = new Date();
    let hereOffset = -now.getTimezoneOffset(); //Javascript does it wrong way

    offsetChange = (timeOffset - hereOffset) * 60;
  }
  return new Date((timestamp + offsetChange) * 1000);
};

// new Date => Wednesday 3:30 AM
export let getTimeString = date => {
  let weekday = getWeekDay(date);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  let isPM = false;
  if (hours > 11) {
    hours -= 12;
    isPM = true;
  }
  if (hours === 0) {
    isPM = !isPM;
  }
  let suffix = isPM ? "PM" : "AM";

  return weekday + " " + hours + ":" + minutes + " " + suffix;
};

// OpenWeatherAPI Conditions
export let getImgURL = iconType => {
  let base = "https://openweathermap.org/img/w/";
  return base + iconType + ".png";
};

// Figure out better location wording
let getLocation = componentArr => {
  let city = "";
  let state = "";
  let country = "";

  //Get city, state and country
  componentArr.map(comp => {
    let { long_name, short_name, types } = comp;
    if (types.includes("locality")) city = long_name;
    if (types.includes("administrative_area_level_1")) state = short_name;
    if (types.includes("country")) country = long_name;
  });

  //Only use two, use state if in US. Don't render empty word.
  if (country === "United States") {
    if (city) return city + ", " + state;
    else return state;
  } else {
    if (city) return city + ", " + country;
    else return country;
  }
};

//Get location and timeoffset from HTML Geolocation Data
export let getGeoInfo = geoData => {
  let { utc_offset, address_components } = geoData.gmaps;
  let location = getLocation(address_components);

  return {
    location,
    timeOffset: utc_offset
  };
};

//Separates list of 40 data points, into 6 different days
export let splitUpDays = (data, timeOffset) => {
  let { list } = data;

  let daysArr = [];
  let currDayIndex = -1;
  let currDayValue = -1;

  list.map(dataPoint => {
    let { dt } = dataPoint;

    //Get Local Time
    let time = getDate(dt, timeOffset);
    let day = time.getDay();

    //If new day, make new empty day
    if (day !== currDayValue) {
      currDayIndex += 1;
      currDayValue = day;
      daysArr.push([]);
    }

    //Append to curr day
    daysArr[currDayIndex].push(dataPoint);
  });

  return daysArr;
};

//Chop off first or last day
export let chopOffDays = days => {
  if (days.length === 5) return days;

  let firstDayLength = days[0].length;
  let lastDayLength = days[5].length;

  //If our first day has more datapoints choose it.
  if (firstDayLength >= lastDayLength) {
    return days.slice(0, 5);
  } else return days.slice(1);
};

//Get Mar 28, for list of datapoints.
let getDayString = (dataPointArr, timeOffset) => {
  let date = getDate(dataPointArr[0].dt, timeOffset);
  return getShortWeekDay(date) + " " + date.getDate();
};

//Takes Highest temp_max and lowest temp_min of the data ponints.
let getTemps = dataPointArr => {
  let tempHigh = -1000;
  let tempLow = 1000;

  dataPointArr.map(dataPoint => {
    let { temp_max, temp_min } = dataPoint.main;
    tempHigh = Math.max(tempHigh, temp_max);
    tempLow = Math.min(tempLow, temp_min);
  });

  return { tempHigh, tempLow };
};

//Add up all of the weather icons, and return the most used.
let getIcon = dataPointArr => {
  let iconDict = {};
  dataPointArr.map(dataPoint => {
    dataPoint.weather.map(weatherObj => {
      let { icon } = weatherObj;

      icon = icon.slice(0, 2); //10n => 10, Night/Day doesn't matter

      if (icon in iconDict) {
        iconDict[icon] += 1;
      } else {
        iconDict[icon] = 1;
      }
    });
  });

  let sorted = Object.keys(iconDict).sort((a, b) => iconDict[b] - iconDict[a]);
  return sorted[0] + "d"; //We chopped off day/night before
};

//Fill out needed data for our forecast, from a simple list of datapoints
export let formatDays = (daysArr, timeOffset) => {
  let newDaysArr = [];

  daysArr.map(dataPointArr => {
    // Mar 25
    let dayString = getDayString(dataPointArr, timeOffset);
    // 78 / 75
    let { tempHigh, tempLow } = getTemps(dataPointArr);
    // [cloudy icon]
    let icon = getIcon(dataPointArr);
    newDaysArr.push({ dayString, tempHigh, tempLow, icon });
  });
  return newDaysArr;
};
