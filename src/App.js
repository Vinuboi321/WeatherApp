import "./App.css";
import { useState } from "react";

const OpenWeatherAPI = {
  key: "7b7d8060cba578a94a4bd7baa36202c7",
  base: "https://api.openweathermap.org/data/2.5/",
};

// Open Meteo weather descriptions
const weatherDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

// Function to get weather description based on the weather code
const getWeatherDescription = (code) => weatherDescriptions[code] || "Unknown weather code";

function App() {
  const [search, setSearch] = useState(""); // State to store the search input
  const [weather, setWeather] = useState({}); // State to store the current weather data
  const [dates, setDates] = useState([]); // State to store the forecast dates
  const [maxTemps, setMaxTemps] = useState([]); // State to store the max temperatures of the forecast
  const [weatherCodes, setWeatherCodes] = useState([]); // State to store the weather codes of the forecast

  const searchPressed = async () => {
    // Fetch current weather data based on the search input
    const weatherResponse = await fetch(`${OpenWeatherAPI.base}weather?q=${search}&units=imperial&APPID=${OpenWeatherAPI.key}`);
    const result = await weatherResponse.json();
    //Current weather set
    setWeather(result);
    fetchForecast(result.coord.lat, result.coord.lon);
  };
  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      // Fetch current weather data based on latitude and longitude
      const weatherResponse = await fetch(`${OpenWeatherAPI.base}weather?lat=${lat}&lon=${lon}&units=imperial&APPID=${OpenWeatherAPI.key}`);
      const result = await weatherResponse.json();
      setWeather(result);
      fetchForecast(lat, lon);
    });
  };
  const fetchForecast = async (latitude, longitude) => {
    // Construct API URL using given latitude and longitude coords
    const apiurl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max&temperature_unit=fahrenheit&wind_speed_unit=mph`;
    
    const forecastResponse = await fetch(apiurl);
    if (!forecastResponse.ok) {
      throw new Error("Network response was not ok");
    }

    const forecastData = await forecastResponse.json();
    setDates(forecastData.daily.time); // Set the dates from the forecast data
    setMaxTemps(forecastData.daily.temperature_2m_max); // Set the max temperatures from the forecast data
    setWeatherCodes(forecastData.daily.weather_code); // Set the weather codes from the forecast data
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>
        <div>
          <input
            type="text"
            placeholder="Enter postal code"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={searchPressed}>Search</button>
        </div>
        <div>
          <button onClick={handleGetLocation}>Get Weather for My Location</button>
        </div>

        {/* Display current weather */}
        {typeof weather.main !== "undefined" ? (
          <div>
            <h2>Current Weather</h2>
            <p>{weather.name}</p>
            <p>{weather.main.temp}°F</p>
            <p>{weather.weather[0].main}</p>
            <p>({weather.weather[0].description})</p>
          </div>
        ) : (
          ""
        )}

        {/* Display forecast for next seven days 
        - Postal code specific(per country, could use user's country)
        - Capture user location using browser loc(client loc data)
        - Accomadte week's weather return into react accordian component
        - Add weather icon for each weather description
         - */}
        <div>
          <h2>Next 7 Days Forecast:</h2>
          {dates.map((date, index) => (
            <div key={index}>
              <p>Date: {new Date(date).toLocaleDateString()}</p>
              <p>Max Temperature: {maxTemps[index]}°F</p>
              <p>Weather: {getWeatherDescription(weatherCodes[index])}</p>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;