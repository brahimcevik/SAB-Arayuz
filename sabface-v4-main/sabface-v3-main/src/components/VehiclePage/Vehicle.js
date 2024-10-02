import React from "react";
import { useLocation } from "react-router-dom";
import { Image } from "antd";
import Arac from "../../img/Arac.png";
import { useSelector } from "react-redux";

function Vehicle() {
  const location = useLocation();
  const ugvName = useSelector((state) => state.ugv.ugvName);

  return (
    <div>
      <div
        style={{
          padding: "20px",
          backgroundColor: "#FFF",
          borderRadius: "1.5rem",
          width: "120px",
          textAlign: "center",
          position: "absolute",
          top: "50px", // Yukarıya alınan mesafe
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {ugvName}
      </div>
      <Image width={200} src={Arac} preview={false} />
    </div>
  );
}

export default Vehicle;
