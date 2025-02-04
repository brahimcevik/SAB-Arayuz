import React, { useEffect, useState } from "react";
import WeatherStats from "./WeatherStats";
import { Flex } from "antd";
import { useSelector } from "react-redux";
import { selectSelectedId } from "../../redux/ugvSlice";

function Weather({ selectedCarNo, cityCoordinates }) {
  const selectedId = useSelector(selectSelectedId);
  const [weatherData, setWeatherData] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: 39.1377, lon: 43.9244 }); // Default coordinates

  const fetchWeatherData = async () => {
    const apiKey = "0c0dcdc7e9b2975a7e115ed4ec2ae3ab";

    // alert(selectedId);
    let lat = 39.5
    let lon = 40
    if (selectedId == null) {
      if (cityCoordinates && cityCoordinates.latitude && cityCoordinates.longitude) {
        lat = cityCoordinates.latitude;
        lon = cityCoordinates.longitude;
      } else {
        console.error("cityCoordinates is undefined or does not have latitude/longitude");
        return; // Exit the function if coordinates are not available
      }
    } else {
      lat = coordinates.lat
      lon = coordinates.lon
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

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
        day: new Intl.DateTimeFormat("tr-TR", { weekday: "long" }).format(
          new Date(reading.dt * 1000)
        ),
        humidity: reading.main.humidity,
        windSpeed: reading.wind.speed,
      }));

      setWeatherData(formattedData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {

    // setCoordinates(cityCoordinates);
    fetchWeatherData();

  }, [selectedId, cityCoordinates]);

  useEffect(() => {
    const fetchRobotData = async () => {
      try {
        const response = await fetch(`https://localhost:44315/api/UgvRobot/mod/${selectedCarNo}`);
        if (!response.ok) {
          throw new Error("Failed to fetch robot data");
        }
        const robotData = await response.json();
        setCoordinates({ lat: robotData.carLat, lon: robotData.carLong });
      } catch (error) {
        console.error("Error fetching robot data:", error);
      }
    };

    if (selectedCarNo) {
      fetchRobotData();
    }
  }, [selectedCarNo]);

  useEffect(() => {
    fetchWeatherData();
  }, [coordinates]);

  return (
    <div>
      <Flex justify="space-evenly" align="center" gap={24}>
        {weatherData &&
          weatherData
            .filter((_, index) => index % 8 === 0)
            .map((data, index) => (
              <WeatherStats
                key={index}
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

export default Weather;