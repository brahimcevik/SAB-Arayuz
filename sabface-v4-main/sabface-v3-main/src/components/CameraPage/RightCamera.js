
import React from "react";
import robot from "../../img/robot.jpg";

const RightCamera = () => {
  return (
    <div>
      <div className="relative py-5 ">
        <img
          className="filter blur-sm  "
          style={{ width: "80vh", height: "70vh" }}
          src={robot}
        ></img>
        <button className=" font-poppins absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-sabGreenDark dark:bg-sabYellow dark:text-sabDarkBlack text-white py-2 px-4 rounded-lg shadow-lg hover:bg-sabGreenLight  dark:hover:bg-sabHardYellow">
          SAĞ KAMERA AÇIK
        </button>
        <div class=" px-1 flex font-poppins bg-white py-2 dark:bg-sabDarkBlack dark:text-white font-poppins">
          <div class="flex-1 text-left">
            <p>VAN</p>
          </div>
          <div class="flex-1 text-center w-32">
            <p>Robot</p>
          </div>
          <div class="flex-1 text-right w-64">
            <p>İBO</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightCamera;