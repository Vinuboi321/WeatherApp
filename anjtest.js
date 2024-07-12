import { useState } from "react";

const api = {
  key: "7b7d8060cba578a94a4bd7baa36202c7",
  base: "https://api.openweathermap.org/data/2.5/"
};

function App() {
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [long, setLon] = useState("");
  const [lat, setLat] = useState("");
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);

const getForecast =  async () => {
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=11.3749&longitude=43.3022&current=temperature_2m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max&temperature_unit=fahrenheit&wind_speed_unit=mph`;
    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) {
        throw new Error("Network response was not ok");
    }
    const forecastData = await forecastResponse.json();
    setForecast(forecastData);
}

const searchWeatherDetails  = async (location) => {
        const response = await fetch(`${api.base}weather?q=${search}&units=imperial&APPID=${api.key}`)
        const data = await response.json();
        setWeather(data);
        setLon(data.coord.lon);
        setLat(data.coord.lat);
        console.log(data.coord.lat, data.coord.lon)
        getForecast();
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
          <button onClick={searchWeatherDetails}>Search</button>
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
        {forecast.length}
        {/* Display forecast for next seven days */}
        {forecast.length > 0 ? (
        <div>
        <h2>Next 7 Days Forecast:</h2>
        {forecast.map((day) => (
            <div key={day.dt}>
            <p>Date: {new Date(day.dt * 1000).toLocaleDateString()}</p>
            <p>Temperature: {day.main.temp}°F</p>
            <p>{day.weather[0].main}</p>
            <p>({day.weather[0].description})</p>
            </div>
        ))}
        </div>
        ) : (
          ""
        )}
      </header>
    </div>
  );
}

export default App;
