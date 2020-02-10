import React from "react";
import ReactDOMServer from "react-dom/server";
import { AnyAction } from "redux";
import { connect, Provider } from "react-redux";
import { take, put } from "redux-saga/effects";
import { END, delay } from "redux-saga";

import { createStore } from "redux-dynamic-modules-core";
import { getSagaExtension, ISagaModule } from "redux-dynamic-modules-saga";

interface ValueState {
    value: number;
}

interface RootState {
    values: ValueState;
}

function reducer(state: ValueState = { value: 1 }, action: AnyAction) {
    switch (action.type) {
        case "GET_VALUE_SUCCESS":
            return {
                ...state,
                value: action.value,
            };
        default:
            return state;
    }
}

function* saga() {
    yield take("GET_VALUE_REQUEST");
    yield delay(1000);
    yield put({
        type: "GET_VALUE_SUCCESS",
        value: 5,
    });
}

function getValuesModule(): ISagaModule<RootState> {
    return {
        id: "values",
        reducerMap: {
            values: reducer,
        },
        sagas: [saga],
    };
}

const sagaExtension = getSagaExtension();

const store = createStore(
    {
        initialState: {
            values: {
                value: 1,
            },
        },
        extensions: [sagaExtension],
    },
    getValuesModule()
);

const Component: React.FC<ValueState> = ({ value }) => <div>{value}</div>;

const Container = connect((state: RootState) => state.values)(Component);

async function ssr() {
    console.log(
        "Initial state:",
        ReactDOMServer.renderToString(
            <Provider store={store}>
                <Container />
            </Provider>
        )
    );

    store.dispatch({ type: "GET_VALUE_REQUEST" });
    store.dispatch(END);
    await sagaExtension.done();
    console.log(
        "After waiting for sagas:",
        ReactDOMServer.renderToString(
            <Provider store={store}>
                <Container />
            </Provider>
        )
    );
}

ssr();
