import React, { useEffect, useState } from "react";
import WeatherStatsNavBar from "./weatherStatsNavBar";

function WeatherNavbar() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const apiKey = "0c0dcdc7e9b2975a7e115ed4ec2ae3ab";
   const latitude = 39.1377; // Sabit enlem değeri
    const longitude = 43.9244; // Sabit boylam değeri
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("API request failed");
        }
        const data = await response.json();
        const dailyData = data.list.filter((reading, index) => index == 0);
        const formattedData = dailyData.map((reading) => ({
          date: new Date(reading.dt * 1000),
          temperature: Math.floor(reading.main.temp),
          weatherType: reading.weather[0].main,
          day: new Intl.DateTimeFormat("tr-TR", { weekday: "long" }).format(
            new Date(reading.dt * 1000)
          ),
        }));
        setWeatherData(formattedData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <flex>
      {weatherData && 
        weatherData.map((data, index) => (
          <WeatherStatsNavBar
            key={index}
            value={data.temperature}
            weatherType={data.weatherType}
            day={data.day}
          /> 
        ))}
    </flex>
  );
}

export default WeatherNavbar;