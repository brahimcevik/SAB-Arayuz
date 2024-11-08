
import React from "react";
import { Card } from "antd";
import Arac from "../../img/Arac.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { vehicleCardClick } from "../../redux/navigationSlice";
import { setSelectedId, setUgvName } from "../../redux/ugvSlice";

function CarCard({ id, ugvName, ugvColor }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle button click to change the route
  const handleButtonClick = () => {
    dispatch(vehicleCardClick());
    //alert(id);
    dispatch(setSelectedId(id));
    dispatch(setUgvName(ugvName));
  };

  return (
    <div>
      <Card
        key={id}
        onClick={handleButtonClick}
        className="bg-sabGreenDark dark:bg-sabGreenHardDark hover:bg-sabGreenHardDark dark:hover:bg-sabGreenDark "
        style={{
          width: 100,
          border: "#335C69",
          color: "white",
        }}
        cover={<img alt="example" src={Arac} />}
      >
        <b>{ugvName}</b>
        <br />
        {ugvColor}
      </Card>
    </div>
  );
}

export default CarCard;
