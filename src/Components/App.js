import React from "react";
import Geosuggest from "react-geosuggest";

import { getWeather, getWeatherByMe } from "../Helpers/api";
import { getGeoInfo } from "../Helpers/fixData";
import Weather from "./Weather";
import Forecast from "./Forecast";

class App extends React.Component {
  state = {
    input: null,
    info: {
      location: null,
      timeOffset: null
    },
    weather: null, // Easier empty object checking
    forecast: null,
    news: null
  };

  //Callback to update weather and forecast
  updateWeatherState = ({ weather, forecast, news }) => {
    this.setState(state => ({
      ...state,
      weather,
      forecast,
      news
    }));
  };

  //Pings api with latitude and longitude
  updateWeatherByCoords = (data) =>
    getWeatherByMe(data, this.updateWeatherState);


  chechInput = (input) => {
    let data = {};
    let array;
    if(isNaN(input)) {
      console.log('string');
      // check to see if the string includes a ',' this verifies that input must be cooridnates
      if(input.includes(',')) {
        console.log('this must be coordinates');
        if(input.includes(', ')) {
          array = input.split(', ')
        } else {
          array = input.split(',')
        }
        // let array = input.split(', ') || input.split(',');
        console.log(array);
        data.lat = array[0];
        data.lng = array[1];
      } else {
        data.city = input;
      }
      
   } else if(!isNaN(input)) {
     console.log('number');
     data.zip = input;
   }
   return data;
  }


  //geo-suggest on-select update
  onSuggestSelect = geoData => {
    if (geoData) {
      this._geoSuggest.clear();
      this._geoSuggest.blur();
      console.log('geoData', geoData)
      let { lat, lng } = geoData.location;
      let data = {
        lat: lat,
        lng: lng,
      }
      this.updateWeatherByCoords(data);

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

  // onSuggestSelect = geoData => {
  //   if (geoData) {
  //     this._geoSuggest.clear();
  //     this._geoSuggest.blur();

  //     let { lat, lng } = geoData.location;
  //     this.updateWeatherByCoords(lat, lng);

  //     let { location, timeOffset } = getGeoInfo(geoData);
  //     this.setState(state => ({
  //       ...state,
  //       info: {
  //         location,
  //         timeOffset
  //       }
  //     }));
  //   }
  // };

  //Get geolocation position, and update
  getCurrentPos = data => {
    console.log('getCurrentPos', data);
    let { latitude, longitude } = data.coords;
    data = {lat: latitude, lng: longitude};

    this.updateWeatherByCoords(data);
  };

  // getCurrentPos = data => {
  //   console.log('getCurrentPos', data);
  //   let { latitude, longitude } = data.coords;
    
  //   this.updateWeatherByCoords(latitude, longitude);
  // };

  // Grabs the value from the input bar
  handleGeosuggestChange = value => {
    this.setState({
      input: value 
    });
    console.log('input', isNaN(this.state.input));
  }
  // Send input to ...
  handleOnSubmit = (e) => {
    e.preventDefault();
    console.log('darrian', this.state.input);
    let data = this.chechInput(this.state.input);
    console.log('after check input', data);
    getWeatherByMe(data, this.updateWeatherState);
   }

   displayNews = (news) => {
    return (
      <div className="newsDiv">
        News Headlines:
        <h5>{news.author}</h5>
        <p><span><a href={news.url}>{news.description}</a></span></p>
      </div>
    )
   }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(this.getCurrentPos);
  }

  render() {
    let { info, weather, forecast, news } = this.state;

    let showWeather = weather !== null;
    let showForecast = forecast !== null;
    let showNews = news !== null;

    return (
      <div className="App">
        <form onSubmit={this.handleOnSubmit}>
        <Geosuggest
          placeholder="Search by City, Zipcode, or Coordinates!"
          ref={el => (this._geoSuggest = el)}
          onSuggestSelect={this.onSuggestSelect}
          autoActivateFirstSuggest={true}
          maxFixtures={5}
          onChange={this.handleGeosuggestChange}
        />
        <button type="submit">Search</button>
        </form>
        
        {showWeather && <Weather info={info} data={weather} />}
        {showForecast && <Forecast info={info} data={forecast} />}
        <div className="News">
          {showNews 
          ? this.displayNews(news)
          : 'Getting news...'}
        </div>
      </div>
    );
  }
}

export default App;
