import React, { useContext } from "react";
import TopBarRow from "./TopBarRow";
import { HomeIcon } from "@heroicons/react/24/solid";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import { MoonIcon } from "@heroicons/react/24/solid";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import { PlayCircleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/themeContenx";
import { SunIcon } from "@heroicons/react/24/solid";

const TopBar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div className="ml-16 pb-32 pr-4 flex items-center">
      <div className="my-auto">
        <Link to="/">
          <TopBarRow Icon={HomeIcon} />
        </Link>
        <Link to="/Mode">
          <TopBarRow Icon={DocumentPlusIcon} />
        </Link>
        <Link to="/Camera">
          <TopBarRow Icon={PlayCircleIcon} />
        </Link>
        <Link to="/Graphic">
          <TopBarRow Icon={ChartBarIcon} />
        </Link>

        <button onClick={toggleTheme}>
          {theme === "dark" ? (
            <TopBarRow Icon={SunIcon} />
          ) : (
            <TopBarRow Icon={MoonIcon} />
          )}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
