import React, { useState, useEffect } from "react";
import Stats from "../Stats";
import { Flex, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { selectSelectedId } from "../../redux/ugvSlice";
import { modeClick, selectisManuel } from "../../redux/modeSlice";
import { toggleCamera, selectCameraStatus } from "../../redux/cameraSlice"; // Ensure selectCameraStatus is imported

function RightCol({ rightCameraStatus, setRightCameraStatus, onCameraClick }) {
  const [carLat, setCarLat] = useState(null);
  const [carLong, setCarLong] = useState(null);
  const [carSpeed, setCarSpeed] = useState(null);
  const [selectedNo, setSelectedNo] = useState(null);

  const selectedId = useSelector(selectSelectedId);
  const isManuel = useSelector((state) => selectisManuel(state, selectedId)); // Seçili robotun manuel mod durumu
  const dispatch = useDispatch();
  const cameraStatus = useSelector(selectCameraStatus);

  const fetchData = async () => {
    try {
      const response = await fetch("https://localhost:44315/api/UgvRobot");
      const data = await response.json();

      if (!data || !data.length) {
        console.error("No data found in UgvRobot");
        return;
      }

      const selectedData = data.find((item) => item.id === selectedId);

      if (!selectedData) {
        console.error("Selected data not found");
        return;
      }

      setCarLat(selectedData.carLat || null);
      setCarLong(selectedData.carLong || null);
      setCarSpeed(selectedData.ugvSpeed || null);
      setSelectedNo(selectedData.no);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleManuelStatusChange = () => {
    const newStatus = !isManuel;

    fetch(`https://localhost:44315/api/UgvRobot/update-manuel-status/${selectedNo}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        manuelStatus: newStatus,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Status updated successfully");
        } else {
          console.error("Error updating status");
        }
      })
      .catch((error) => {
        console.error("Request error:", error);
      });

    dispatch(modeClick({ robotId: selectedId }));
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

  const handleRightCameraClick = () => {
    const newRightCameraStatus = !rightCameraStatus;
    setRightCameraStatus(newRightCameraStatus);
    dispatch(toggleCamera('right'));
    onCameraClick(newRightCameraStatus);
  };

  return (
    <Flex
      vertical={true}
      justify="space-evenly"
      align="center"
      style={{ height: "80vh", width: "50vh", position: "relative" }}
    >
      <Button
        onClick={handleRightCameraClick}
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
            backgroundColor: cameraStatus.right ? "#00A36C" : "#B22222",
            display: "inline-block",
            marginRight: "8px",
          }}
        ></span>
        Sağ Kamera
      </Button>
      <Stats title="Hız" value={carSpeed} suffix="m/s" />
      <Stats title="Enlem" value={carLat} suffix="" />
      <Stats title="Boylam" value={carLong} suffix="" />
      <Button
        type="primary"
        style={{
          position: "absolute",
          bottom: "3px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "130px",
          height: "30px",
          fontSize: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
        onClick={() => {
          handleManuelStatusChange();
        }}
      >
        {isManuel ? "Otomatik Mod" : "Manuel Mod"}
      </Button>
    </Flex>
  );
}

export default RightCol;
