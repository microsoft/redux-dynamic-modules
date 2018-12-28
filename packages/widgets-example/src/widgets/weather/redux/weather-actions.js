export const WeatherLoaded = "weather/weatherLoaded";

export const weatherLoaded = weather => {
    return {
        type: WeatherLoaded,
        payload: weather,
    };
};
