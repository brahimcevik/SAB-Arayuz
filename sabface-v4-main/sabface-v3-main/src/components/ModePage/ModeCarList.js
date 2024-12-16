import React, { useState, useEffect } from "react";
import { Card, Flex } from "antd";
import CarCard from "../MainPage/CarCard";

function ModeCarList(props) {
  const [carData, setCarData] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const {selectedCarNo, setSelectedCarNo} = props;

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`https://localhost:44315/api/UgvRobot/user/${userId}`)
        .then((response) => response.json())
        .then((data) => setCarData(data))
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, []);

  const handleCarClick = (id, no) => {
    setSelectedCarId(id);
    setSelectedCarNo(no);
  };

  return (
    <div>
      <Card
        style={{ width: "87vh", height: "40vh" }}
        className="bg-sabGreenDark dark:bg-sabGreenHardDark rounded-3xl border-sabGreenDark dark:border-sabGreenHardDark"
      >
        <Flex wrap="" gap="middle" className="overflow-x-auto">
          {carData.map((car) => (
            <div
              key={car.id}
              onClick={() => handleCarClick(car.id, car.no)}
              style={{
                border: selectedCarId === car.id ? "2px solid #9fe5c5" : "none",
                borderRadius: "10px",
              }}
            >
              <CarCard
                id={car.id}
                no={car.no}
                ugvName={car.ugvName}
                ugvColor={car.ugvColor}
              />
            </div>
          ))}
        </Flex>
      </Card>
    </div>
  );
}

export default ModeCarList;