import React, { useState, useEffect } from "react";
import { Card, Flex } from "antd";
import CarCard from "./CarCard";

function CarList() {
  const [carData, setCarData] = useState([]);

  useEffect(() => {
    fetch("https://localhost:44315/api/UgvRobot")
      .then((response) => response.json())
      .then((data) => setCarData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <div>
      <Card
        style={{ width: "87vh", height: "80vh" }}
        className="bg-sabGreenDark dark:bg-sabGreenHardDark rounded-3xl border-sabGreenDark dark:border-sabGreenHardDark overflow-y-auto"
      >
        <Flex wrap="wrap" gap="middle">
          {carData.map((car) => (
            <CarCard
              id={car.id}
              ugvName={car.ugvName}
              ugvColor={car.ugvColor}
            />
          ))}
        </Flex>
      </Card>
    </div>
  );
}

export default CarList;
