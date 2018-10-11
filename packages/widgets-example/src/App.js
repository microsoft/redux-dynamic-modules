import React, { Component } from 'react';
import { configureStore, DynamicModuleLoader } from "redux-dynamic-modules";
import { getObservableExtension } from "redux-dynamic-modules-observable";
import { getSagaExtension } from "redux-dynamic-modules-saga";
import { Provider } from "react-redux";
import logo from './logo.svg';
import './App.css';
import { ConnectedCounter } from "./widgets/observable-counter/component/observable-counter-component";
import { getObservableCounterModule } from "./widgets/observable-counter/redux/observable-counter-module";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hackerNews: false,
      counter: false,
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
          <input type="checkbox" onChange={this.onCounterToggled} />
          <label>Counter</label>
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
            this.state.counter && (
              <div>
                <DynamicModuleLoader modules={[getObservableCounterModule()]}>
                  <ConnectedCounter />
                </DynamicModuleLoader>
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

  onCounterToggled = () => {
    this.setState({ counter: !this.state.counter });
  }

  onWeatherToggled = () => {
    this.setState({ weather: !this.state.weather });
  }
}

export default App;
