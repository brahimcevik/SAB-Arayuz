import React, { useState } from "react";
import { Card, Modal, Flex, Statistic, notification } from "antd";
import Lottie from "lottie-react";
import Cloudy from "../../img/cloudy.json";
import sunny from "../../img/sunny.json";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ReactComponent as Clear } from "../../img/sun.svg";
import { ReactComponent as Clouds } from "../../img/clouds.svg";
import { ReactComponent as Rain } from "../../img/rainy-2.svg";
import { ReactComponent as Snow } from "../../img/snow.svg";
import { ReactComponent as Mist } from "../../img/mist.svg";
import { ReactComponent as Thunderstorm } from "../../img/thunderstorm.svg";
import { ReactComponent as Fog } from "../../img/fog.svg";
import { ReactComponent as Drizzle } from "../../img/drizzle.svg";

function WeatherStats({ weatherData, day, value }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  let WeatherIcon;
  const weatherType = weatherData[0].weatherType;
  if (weatherType === "Clear") {
    WeatherIcon = (
      <Lottie animationData={sunny} style={{ width: "50px", height: "50px" }} />
    );
  } else if (weatherType === "Clouds") {
    WeatherIcon = (
      <Lottie
        animationData={Cloudy}
        style={{ width: "50px", height: "50px" }}
      />
    );
  } else if (weatherType === "Rain") {
    WeatherIcon = (
      <Rain style={{ width: "50px", height: "50px", fill: "#4793AF" }} />
    );
  } else if (weatherType === "Snow") {
    WeatherIcon = (
      <Snow style={{ width: "50px", height: "50px", fill: "#ADD8E6" }} />
    );
  } else if (weatherType === "Mist") {
    WeatherIcon = (
      <Mist style={{ width: "50px", height: "50px", fill: "#B0C4DE" }} />
    );
  } else if (weatherType === "Thunderstorm") {
    WeatherIcon = (
      <Thunderstorm
        style={{ width: "50px", height: "50px", fill: "#A9A9A9" }}
      />
    );
  } else if (weatherType === "Fog") {
    WeatherIcon = (
      <Fog style={{ width: "50px", height: "50px", fill: "#696969" }} />
    );
  } else if (weatherType === "Drizzle") {
    WeatherIcon = (
      <Drizzle style={{ width: "50px", height: "50px", fill: "#778899" }} />
    );
  } else {
    WeatherIcon = null;
  }
  const showModal = () => {
    setIsModalVisible(true);
    // Rüzgar hızını kontrol et ve bildirim göster
    const highWindSpeed = weatherData.some((data) => data.windSpeed > 3); // 3 m/s üstü yüksek rüzgar hızı olarak kabul edildi
    if (highWindSpeed) {
      notification.warning({
        message: ` ${day} Günü Yüksek Rüzgar Hızı Uyarısı`,
        description: "Rüzgar hızı yüksek! Lütfen dikkatli olun.",
      });
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Card
        bordered={false}
        style={{ width: "15vh", height: "20vh" }}
        onClick={showModal}
        className="bg-sabGreenDark dark:bg-sabGreenHardDark rounded-3xl border-sabGreenDark dark:border-sabGreenHardDark hover:bg-sabGreenLight hover:dark:bg-sabGreenDark"
      >
        <Flex justify="center" align="center" vertical={true}>
          {WeatherIcon && <div>{WeatherIcon}</div>}
          <Statistic
            className=""
            value={value}
            precision={0}
            valueStyle={{
              color: "#FFF",
            }}
            suffix="°C"
          />
          {day && <div className="font-poppins text-white">{day}</div>}
        </Flex>
      </Card>
      <Modal
        title={`Hava Durumu Detayları - ${day}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Tamam"
        cancelText="İptal"
        width={800}
        className="custom-modal"
      >
        <ResponsiveContainer
          width="100%"
          height={400}
          className="dark:bg-sabDarkBG bg-white"
        >
          <LineChart data={weatherData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                new Intl.DateTimeFormat("tr-TR", { hour: "numeric" }).format(
                  new Date(date)
                )
              }
            />
            <YAxis />
            <Tooltip
              labelFormatter={(date) =>
                new Intl.DateTimeFormat("tr-TR", { hour: "numeric" }).format(
                  new Date(date)
                )
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name="Nem (%)"
            />
            <Line
              type="monotone"
              dataKey="windSpeed"
              stroke="#82ca9d"
              name="Rüzgar Hızı (m/s)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Modal>
    </div>
  );
}

export default WeatherStats;
