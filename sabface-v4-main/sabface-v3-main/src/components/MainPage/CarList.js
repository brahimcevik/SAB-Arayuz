// ../components/MainPage/CarList.js
import React, { useState, useEffect } from "react";
import { Card, Flex } from "antd";
import CarCard from "./CarCard";

function CarList({ selectedCarNo, setSelectedCarNo, width = "87vh", height = "80vh" }) {  // Add selectedCarNo and setSelectedCarNo props
  const [carData, setCarData] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Local storage'dan userId'yi al
    if (userId) {
        fetch(`https://localhost:44315/api/UgvRobot/user/${userId}`) // Kullanıcıya ait robotları al
            .then((response) => response.json())
            .then((data) => setCarData(data))
            .catch((error) => console.error("Veri alırken hata:", error));
    }
  }, []);

  const handleCarClick = (carNo) => {
    setSelectedCarNo(carNo); // Update the selected car number
  };

  return (
    <div>
      <Card
        style={{ width, height }}
        className="bg-sabGreenDark dark:bg-sabGreenHardDark rounded-3xl border-sabGreenDark dark:border-sabGreenHardDark overflow-y-auto"
      >    
        <Flex wrap="wrap" gap="middle">
          {carData.map((car) => (
            <div
              key={car.id}
              onClick={() => handleCarClick(car.no)} // Handle car click
              style={{
                border: selectedCarNo === car.no ? "2px solid #9fe5c5" : "none",
                borderRadius: "10px",
              }}
            >
              <CarCard
                id={car.id}
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

export default CarList;
