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

  render() {
    return (

      <div className="App">
        <div>
          <input type="checkbox" onChange={this.onHackerNewsToggled} />
          <label>Hacker News</label>
          <input type="checkbox" onChange={this.onWeatherToggled} />
          <label>Weather</label>
        </div>
        <div>
          {this.renderContent()}
        </div>
      </div>
    );
  }

  renderContent = () => {
    const {
      hackerNews,
      weather
    } = this.state;

    const LoadableHackerNews = Loadable(
      {
        loader: () => import("./widgets/hacker-news"),
        loading: () => <div>Loading...</div>
      }
    );

    const HackerNewsComponent = hackerNews && <LoadableHackerNews />;
    const WeatherComponent = weather ? <div>Weather</div> : <div />;

    return (
      <Provider store={this.store}>
        <>
          {HackerNewsComponent}
          {WeatherComponent}
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
