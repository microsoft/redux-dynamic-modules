import { connect } from "react-redux";
import React from "react";
import "./weather-component.css";
import "../../widgets.css";

const Weather = ({ loading, name, temperature, description }) => {
    if (loading) {
        return <div className="weather-root widget">Loading Weather...</div>;
    }

    return (
        <div className="weather-root widget">
            <h2>{name}</h2>
            <div>{description}</div>
            <div>{temperature} °C</div>
        </div>
    );
};

const mapStateToProps = state => {
    if (!state.weatherState || !state.weatherState.weather) {
        return {
            loading: true,
        };
    }

    return {
        name: state.weatherState.weather.name,
        temperature: Math.round(state.weatherState.weather.main.temp - 273),
        description: state.weatherState.weather.weather[0].description,
    };
};

export const ConnectedWeather = connect(mapStateToProps)(Weather);
