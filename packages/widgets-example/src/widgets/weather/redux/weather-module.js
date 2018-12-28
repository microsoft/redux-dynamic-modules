import { weatherReducer } from "./weather-reducer";
import { weatherSaga } from "./weather-saga";

export function getWeatherModule() {
    return {
        // Unique id of the module
        id: "weather",
        // Maps the Store key to the reducer
        reducerMap: {
            weatherState: weatherReducer,
        },
        // This module uses redux-saga middleware
        // This property will be be used by the SagaExtension
        // to run sagas for the moduleD
        sagas: [weatherSaga],
    };
}
