import { useState, useEffect } from "react";
import "./App.css";

const apiKey = "53a1fabbd6724c45a17123101240812";

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!query.trim()) {
        setWeather(null);
        setError("");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setWeather(data.current);
        setError("");
      } catch (err) {
        setWeather(null);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [query]);

  return (
    <div className="app">
      <h1>Weather App</h1>
      <WeatherInput query={query} setQuery={setQuery} />
      <WeatherDisplay
        weather={weather}
        error={error}
        isLoading={isLoading}
        location={query}
      />
    </div>
  );
}

function WeatherInput({ query, setQuery }) {
  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Enter location"
    />
  );
}

function WeatherDisplay({ weather, error, isLoading, location }) {
  if (isLoading) {
    return <p>Loading weather data...</p>;
  }

  if (!weather && !error) {
    return <p>Please enter a location to fetch weather data.</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="weather-info">
      <img
        src={weather.condition?.icon}
        alt={weather.condition?.text || "Weather icon"}
      />
      <p>{weather.condition?.text}</p>
      <h2>Location: {location}</h2>
      <p>Temperature: {weather.temp_c} °C</p>
      <p>Humidity: {weather.humidity} %</p>
      <p>Wind: {weather.wind_kph} km/h</p>
    </div>
  );
}

export default App;
