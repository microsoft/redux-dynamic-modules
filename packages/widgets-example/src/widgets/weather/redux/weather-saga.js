import { call, put } from "redux-saga/effects";
import { weatherLoaded } from "./weather-actions";

export function* weatherSaga() {
    yield call(loadWeatherData);
}

function* loadWeatherData() {
    const url =
        "https://api.openweathermap.org/data/2.5/weather?q=Seattle&APPID=1362c34423375d167d694489b1c74080";

    const response = yield call(fetch, url);
    const json = yield call([response, response.json]);

    yield put(weatherLoaded(json));
}
