import React, { useContext } from "react";
import TopBarRow from "./TopBarRow";
import { HomeIcon, DocumentPlusIcon, MoonIcon, ChartBarIcon, ChatBubbleLeftIcon, SunIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/themeContenx";

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
          <TopBarRow Icon={ChatBubbleLeftIcon} />
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
