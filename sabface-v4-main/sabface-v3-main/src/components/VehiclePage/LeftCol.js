import React, { useState, useEffect } from "react";
import Stats from "../Stats";
import { Flex, Button } from "antd";  // Ant Design'dan buton bileşeni ekledik
import { useSelector, useDispatch } from "react-redux";
import { selectSelectedId } from "../../redux/ugvSlice";
import { toggleCamera, selectCameraStatus } from "../../redux/cameraSlice";  // toggleCamera işlevini import ettik

function LeftCol({ leftCameraStatus, setLeftCameraStatus, onCameraClick }) {
  const [distanceValue, setDistanceValue] = useState(null);
  const [missionValue, setMissionValue] = useState(null);
  const [herbicideValue, setHerbicideValue] = useState(null);
  const selectedId = useSelector(selectSelectedId);
  const dispatch = useDispatch();
  const cameraStatus = useSelector(selectCameraStatus);

  // Update local state when Redux state changes
  useEffect(() => {
    setLeftCameraStatus(cameraStatus.left);
  }, [cameraStatus.left, setLeftCameraStatus]);

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
    const newLeftCameraStatus = !leftCameraStatus;
    setLeftCameraStatus(newLeftCameraStatus);
    dispatch(toggleCamera("left"));
    onCameraClick(newLeftCameraStatus);
  };

  return (
    <Flex
      vertical={true}
      justify="space-evenly"
      align="center"
      style={{ height: "80vh", width: "50vh", position: "relative" }}
    >
      <Button
        onClick={handleLeftCameraClick}
        type="button"
        className="bg-sabGreenDark dark:bg-sabYellow dark:text-sabDarkBlack text-white py-2 px-4 rounded-lg shadow-lg hover:bg-sabGreenLight dark:hover:bg-sabHardYellow w-full flex items-center justify-center w-1/2 px-5 py-2 text-sm transition-colors duration-200 border rounded-lg gap-x-2 sm:w-auto"
        style={{
          marginBottom: "20px",
          position: "absolute",
          top: "10px",
          borderColor: "#004d40", // Consistent border color
        }}
      >
        <span
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: leftCameraStatus ? "#00A36C" : "#B22222",
            display: "inline-block",
            marginRight: "8px",
          }}
        ></span>
        Sol Kamera
      </Button>
      <Stats title={"Mesafe"} value={distanceValue} suffix={"m"} />
      <Stats title={"İlaç"} value={herbicideValue} suffix={"%"} />
      <Stats title={"Görev"} value={missionValue} suffix={""} />
    </Flex>
  );
}

export default LeftCol;
