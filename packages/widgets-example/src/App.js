import React, { Component } from 'react';
import { configureStore, DynamicModuleLoader } from "redux-dynamic-modules";
import { getObservableExtension } from "redux-dynamic-modules-observable";
import { getSagaExtension } from "redux-dynamic-modules-saga";
import { Provider } from "react-redux";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hackerNews: false,
      weather: false
    };

    this.store = configureStore({}, [getObservableExtension(), getSagaExtension()]);
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

  renderContent() {
    return (
      <Provider store={this.store}>
        <>
          {
            this.state.hackerNews && (
              <div>
                HackerNews
                </div>
            )
          }
          {
            this.state.weather && (
              <div>
                Weather
            </div>
            )
          }
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
