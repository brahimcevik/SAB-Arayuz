import React from "react";
import logoYazili from "../img/logoYazili.png";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import WeatherNavBar from "./MainPage/WeatherNavBar";

const NavBar = () => {
  const goBack = () => {
    window.location.reload();
  };
  return (
    <div className="py-6 flex justify-between  text-sabGreenHardDark dark:text-white">
      <div className="font-bold pl-10 text-3xl flex items-center gap-16">
        <img src={logoYazili} className="h-16" />

        <button onClick={goBack} className="font-bold">
          Gösterge
        </button>

        <div className="h-100 text-sm font-thin bg-sabGreenDark dark:bg-sabDarkBlack min-w-full rounded-full p-4 flex">
          <MagnifyingGlassIcon className="h-5 mr-4 text-white" />
          <input
            className="flex-1 bg-transparent outline-none text-white placeholder-white"
            type="text"
            placeholder="Ara"
          />
        </div>
      </div>
      <WeatherNavBar />
    </div>
  );
};

export default NavBar;
