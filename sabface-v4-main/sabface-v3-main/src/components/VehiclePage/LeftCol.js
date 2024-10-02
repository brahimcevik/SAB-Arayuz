import React, { useState, useEffect } from "react";
import Stats from "../Stats";
import { Flex } from "antd";
import { useSelector } from "react-redux";
import { selectSelectedId } from "../../redux/ugvSlice";

function LeftCol() {
  const [distanceValue, setDistanceValue] = useState(null);
  const [missionValue, setMissionValue] = useState(null);
  const [herbicideValue, setHerbicideValue] = useState(null); // Yeni state ekledik

  const selectedId = useSelector(selectSelectedId);

  const fetchData = async () => {
    try {
      // UgvRobot bilgilerini çek
      const ugvRobotResponse = await fetch(
        `https://localhost:44315/api/UgvRobot`);
      const ugvRobotData = await ugvRobotResponse.json();

      if (!ugvRobotData || !ugvRobotData.length) {
        console.error("No data found in UgvRobot");
        return;
      }

      // Seçilen ID'ye göre veri bul
      const selectedData = ugvRobotData.find((item) => item.id === selectedId);
      
      if (!selectedData) {
        console.error("Selected data not found");
        return;
      }

      // Veri setlerini güncelle
      setDistanceValue(selectedData.ugvDistance || 0);
      setMissionValue(selectedData.ugvMission || null);
      setHerbicideValue(selectedData.ugvHerbicide || 0);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (selectedId) {
      fetchData();

      const intervalId = setInterval(() => {
        fetchData();
      }, 5000);

      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [selectedId]); // selectedId değiştiğinde fetchData yeniden çağrılır

  return (
    <Flex
      vertical={true}
      justify="space-evenly"
      align="center"
      style={{ height: "80vh", width: "50vh" }}
    >
      <Stats title={"Mesafe"} value={distanceValue} suffix={"m"} />
      <Stats title={"İlaç"} value={herbicideValue} suffix={"%"} /> 
      <Stats title={"Görev"} value={missionValue} suffix={""} />
    </Flex>
  );
}

export default LeftCol;
