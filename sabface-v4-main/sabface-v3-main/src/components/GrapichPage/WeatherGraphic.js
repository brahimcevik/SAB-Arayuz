
import React, { useEffect, useState } from "react";
import { Flex } from "antd";
import Graphic from "./Graphic";

function WeatherGraphic() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const apiKey = "0c0dcdc7e9b2975a7e115ed4ec2ae3ab";
    const latitude = 40.828955150025024; // Sabit enlem değeri
    const longitude = 29.802852888259416; // Sabit boylam değeri
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("API request failed");
        }
        const data = await response.json();
        const formattedData = data.list.map((reading) => ({
          date: new Date(reading.dt * 1000),
          temperature: Math.floor(reading.main.temp),
          weatherType: reading.weather[0].main,
          day: new Intl.DateTimeFormat("tr-TR", {
            weekday: "long",
            timeZone: "Europe/Istanbul",
          }).format(new Date(reading.dt * 1000)),
          humidity: reading.main.humidity,
          windSpeed: reading.wind.speed,
        }));

        setWeatherData(formattedData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Flex justify="space-evenly" align="center" gap={24}>
        {weatherData &&
          weatherData
            .filter((_, index) => index % 8 === 0 && index != [32])
            .map((data, index) => (
              <Graphic
                value={data.temperature}
                weatherType={data.weatherType}
                weatherData={weatherData.slice(index * 8, index * 8 + 8)}
                day={data.day}
              />
            ))}
      </Flex>
    </div>
  );
}

export default WeatherGraphic;
