import React from "react";
import Geosuggest from "react-geosuggest";

import { getWeather } from "../Helpers/api";
import { getGeoInfo } from "../Helpers/fixData";
import Weather from "./Weather";
import Forecast from "./Forecast";

class App extends React.Component {
  state = {
    info: {
      location: null,
      timeOffset: null
    },
    weather: null, // Easier empty object checking
    forecast: null
  };

  //Callback to update weather and forecast
  updateWeatherState = ({ weather, forecast }) => {
    console.log(weather, forecast);
    this.setState(state => ({
      ...state,
      weather,
      forecast
    }));
  };

  //Pings api with latitude and longitude
  updateWeatherByCoords = (lat, lng) =>
    getWeather(lat, lng, this.updateWeatherState);


  //geo-suggest on-select update
  onSuggestSelect = geoData => {
    if (geoData) {
      this._geoSuggest.clear();
      this._geoSuggest.blur();

      let { lat, lng } = geoData.location;
      this.updateWeatherByCoords(lat, lng);

      let { location, timeOffset } = getGeoInfo(geoData);
      this.setState(state => ({
        ...state,
        info: {
          location,
          timeOffset
        }
      }));
    }
  };

  //Get geolocation position, and update
  getCurrentPos = data => {
    console.log(data);
    let { latitude, longitude } = data.coords;
    this.updateWeatherByCoords(latitude, longitude);
  };

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(this.getCurrentPos);
  }

  render() {
    let { info, weather, forecast } = this.state;

    let showWeather = weather !== null;
    let showForecast = forecast !== null;

    return (
      <div className="App">
        <Geosuggest
          ref={el => (this._geoSuggest = el)}
          onSuggestSelect={this.onSuggestSelect}
          autoActivateFirstSuggest={true}
          maxFixtures={5}
        />
        {showWeather && <Weather info={info} data={weather} />}
        {showForecast && <Forecast info={info} data={forecast} />}
      </div>
    );
  }
}

export default App;
