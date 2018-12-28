import React, { Component } from "react";
import "./App.css";
import { DynamicOrder } from "./Components/Order";
import { createStore, IModuleStore } from "redux-dynamic-modules";
import { getSagaExtension } from "redux-dynamic-modules-saga";
import { Provider } from "react-redux";

class App extends Component {
    private store: IModuleStore<any>;
    constructor(props: any, context: any) {
        super(props, context);
        this.store = createStore({}, [], [getSagaExtension()]);
    }
    render() {
        return (
            <div className="App">
                <Provider store={this.store}>
                    <DynamicOrder />
                </Provider>
            </div>
        );
    }
}

export default App;
