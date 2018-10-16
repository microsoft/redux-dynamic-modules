import React, { Component } from 'react';
import Loadable from "react-loadable";
import { Provider } from "react-redux";
import { configureStore } from "redux-dynamic-modules";
import { getSagaExtension } from "redux-dynamic-modules-saga";
import { getThunkExtension } from "redux-dynamic-modules-thunk";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hackerNews: false,
      weather: false
    };

    this.store = configureStore({}, [getThunkExtension(), getSagaExtension()]);
  }

  _hackerNews = null;
  getHackerNews() {
    if (!this.state.hackerNews) {
      return null;
    }
    if (this._hackerNews) {
      return this._hackerNews;
    }

    const LoadableHackerNews = Loadable(
      {
        loader: () => import("./widgets/hacker-news"),
        loading: () => <div>Loading Scripts...</div>
      }
    );
    this._hackerNews = <LoadableHackerNews />;
    return this._hackerNews;
  }

  getWeather() {
    if (!this.state.weather) {
      return null;
    }
    if (this._weather) {
      return this._weather;
    }

    const LoadableWeather = Loadable(
      {
        loader: () => import("./widgets/weather"),
        loading: () => <div>Loading Scripts...</div>
      }
    );
    this._weather = <LoadableWeather />;
    return this._weather;
  }

  render() {
    return (

      <div className="App">
        <h1>Widgets</h1>
        <div className="checkboxes">
          <input type="checkbox" onChange={this.onHackerNewsToggled} />
          <label>Hacker News</label>
          <input type="checkbox" onChange={this.onWeatherToggled} />
          <label>Weather</label>
        </div>
        <div className="widgets">
          {this.renderContent()}
        </div>
      </div>
    );
  }

  renderContent = () => {
    const {
      weather
    } = this.state;

    return (
      <Provider store={this.store}>
        <>
          {this.getHackerNews()}
          {this.getWeather()}
        </>
      </Provider>
    );
  }

  onHackerNewsToggled = () => {
    this.setState({ hackerNews: !this.state.hackerNews });
  };
  onWeatherToggled = () => {
    this.setState({ weather: !this.state.weather });
  }
}

export default App;
