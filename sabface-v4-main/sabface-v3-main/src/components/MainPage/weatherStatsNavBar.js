import React from "react";
import { ReactComponent as Clear } from "../../img/sun.svg";
import { ReactComponent as Clouds } from "../../img/clouds.svg";
import { ReactComponent as Rain } from "../../img/rainy-2.svg";
import { BellIcon } from "@heroicons/react/24/solid";
import pp from "../../img/pp.jpg";
import Lottie from "lottie-react";
import Cloudy from "../../img/cloudy.json";
import sunny from "../../img/sunny.json";

function WeatherStatsNavbar({ value, weatherType, day }) {
  let WeatherIcon;
  if (weatherType === "Clear") {
    WeatherIcon = (
      <Lottie animationData={sunny} style={{ width: "5vh", height: "5vh" }} />
    );
  } else if (weatherType === "Clouds") {
    WeatherIcon = (
      <Lottie animationData={Cloudy} style={{ width: "5vh", height: "5vh" }} />
    );
  } else if (weatherType === "Rain") {
    WeatherIcon = <Rain style={{ width: "4vh", height: "4vh" }} />;
  } else {
    WeatherIcon = null; // Varsayılan durum için bir ikon belirtilmediyse
  }
  return (
    <div className="flex items-center gap-9 mr-16 ">
      <div className=" bg-sabGreenDark dark:bg-sabDarkBlack rounded-full p-3">
        {WeatherIcon && <div style={{}}>{WeatherIcon}</div>}
      </div>
      <div>
        <div className="font-bold text-xl ">
          {value}°C <p>{day}</p>
        </div>
      </div>
      <div>
        <BellIcon className="h-8 text-sabGreenDark dark:text-white" />
      </div>
      <div>
        <img src={pp} className="h-14 rounded-full" />
      </div>
    </div>
  );
}

export default WeatherStatsNavbar;
