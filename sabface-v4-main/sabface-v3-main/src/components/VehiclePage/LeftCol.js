import React, { useState, useEffect } from "react";
import Stats from "../Stats";
import { Flex, Button } from "antd";  // Ant Design'dan buton bileşeni ekledik
import { useSelector, useDispatch } from "react-redux";
import { selectSelectedId } from "../../redux/ugvSlice";
import { toggleCamera } from "../../redux/cameraSlice";  // toggleCamera işlevini import ettik

function LeftCol() {
  const [distanceValue, setDistanceValue] = useState(null);
  const [missionValue, setMissionValue] = useState(null);
  const [herbicideValue, setHerbicideValue] = useState(null);
  const selectedId = useSelector(selectSelectedId);
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const ugvRobotResponse = await fetch(`https://localhost:44315/api/UgvRobot`);
      const ugvRobotData = await ugvRobotResponse.json();

      if (!ugvRobotData || !ugvRobotData.length) {
        console.error("No data found in UgvRobot");
        return;
      }

      const selectedData = ugvRobotData.find((item) => item.id === selectedId);

      if (!selectedData) {
        console.error("Selected data not found");
        return;
      }

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

      return () => clearInterval(intervalId);
    }
  }, [selectedId]);

  // Sol kamera butonuna tıklama işlevi
  const handleLeftCameraClick = () => {
    dispatch(toggleCamera("left"));  // Redux store'daki kamerayı "sol" olarak toggle et
  };

  return (
    <Flex
      vertical={true}
      justify="space-evenly"
      align="center"
      style={{ height: "80vh", width: "50vh" }}
    >
      <Button onClick={handleLeftCameraClick}>Sol Kamera</Button> {/* Sol kamera butonu */}
      <Stats title={"Mesafe"} value={distanceValue} suffix={"m"} />
      <Stats title={"İlaç"} value={herbicideValue} suffix={"%"} />
      <Stats title={"Görev"} value={missionValue} suffix={""} />
    </Flex>
  );
}

export default LeftCol;
