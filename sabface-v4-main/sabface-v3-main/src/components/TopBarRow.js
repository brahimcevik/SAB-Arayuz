import React from "react";

const TopBarRow = ({ Icon }) => {
  return (
    <div
      className="flex cursor-pointer items-center space-x-2 px-4 py-4 
        rounded-full transition-all duration-200 hover:bg-sabGreenLight group bg-sabGreenDark dark:bg-sabDarkBlack dark:hover:bg-sabDarkLGray mt-4 text-white"
      // Tıklama olayı eklendi
    >
      <Icon className="h-7 w-7" />
    </div>
  );
};

export default TopBarRow;
