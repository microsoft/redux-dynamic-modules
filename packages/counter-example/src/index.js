import React from "react";
import ReactDOM from "react-dom";
import Counter from "./components/Counter";
import counter from "./reducers";
import { connect, Provider } from "react-redux";
import { DynamicModuleLoader, createStore } from "redux-dynamic-modules";

const rootEl = document.getElementById("root");
const counterModule = {
  id: "counter",
  reducerMap: {
    counter
  }
};
const store = createStore({}, [], [], []);

const render = () =>
  ReactDOM.render(
    <Provider store={store}>
      <DynamicCounter />
    </Provider>,
    rootEl
  );

const mapStateToProps = state => {
  if (state === undefined || state.counter === undefined) {
    debugger;
    console.log("Why is this undefined 2?");
  }
  return {
    value: state.counter
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onIncrement: () => dispatch({ type: "INCREMENT" }),
    onDecrement: () => dispatch({ type: "DECREMENT" })
  };
};

const ConnectedCounter = connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter);
const DynamicCounter = () => (
  <DynamicModuleLoader modules={[counterModule]}>
    <ConnectedCounter />
  </DynamicModuleLoader>
);
render();
