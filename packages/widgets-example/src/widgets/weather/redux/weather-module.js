import { weatherReducer } from "./weather-reducer";
import { weatherSaga } from "./weather-saga";

export function getWeatherModule() {
    return {
        id: "weather",
        reducerMap: {
            weatherState: weatherReducer
        },
        sagas: [weatherSaga]
    };
}