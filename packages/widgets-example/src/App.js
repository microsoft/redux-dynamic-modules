import React, { Component } from 'react';
// We will load the widgets async using react-loadable.
import Loadable from "react-loadable";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import thunk from "redux-thunk";
import './App.css';
import { fetchStories } from './widgets/hacker-news/redux/hacker-news-actions';
import { hackerNewsReducer } from './widgets/hacker-news/redux/hacker-news-reducer';
import { weatherReducer } from './widgets/weather/redux/weather-reducer';
import { weatherSaga } from './widgets/weather/redux/weather-saga';

class App extends Component {
  constructor(props) {
    super(props);

    // define the initial state where none of the widgets are visible
    this.state = {
      hackerNews: false,
      weather: false
    };

    // WHAT IS NOT OPTIMAL HERE?
    // We need advance knowledge of all state keys and reducer
    // It is not modular and scalable
    const reducers = combineReducers({
      weatherState: weatherReducer,
      hackerNews: hackerNewsReducer
    })

    const sagaMiddleware = createSagaMiddleware();
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    this.store = createStore(reducers, composeEnhancers(applyMiddleware(thunk, sagaMiddleware)));

    // WHAT IS NOT OPTIMAL HERE?
    // We need to run all Sagas in advance, even though the component
    // needing them is not Mounted yet  
    sagaMiddleware.run(weatherSaga);
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

  onHackerNewsToggled = () => {
    const hackerNews = !this.state.hackerNews;
    if (hackerNews) {
      // WHAT IS NOT OPTIMAL HERE?
      // App knows about the actions needed by the HackerNews component
      this.store.dispatch(fetchStories())
    }
    this.setState({ hackerNews });
  };
  onWeatherToggled = () => {
    const weather = !this.state.weather;

    if (weather) {
      // WHAT IS NOT OPTIMAL HERE?
      // App knows about the actions needed by the Weather component
      this.store.dispatch({ type: "LoadWeatherData" });
    }
    this.setState({ weather });
  }

  renderContent = () => {
    return (
      // Pass the configured store to redux Provider 
      // and render the widgets based on the state
      <Provider store={this.store}>
        <>
          {this.getHackerNews()}
          {this.getWeather()}
        </>
      </Provider>
    );
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

}

export default App;
