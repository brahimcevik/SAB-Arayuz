import React, { useState, useEffect } from "react";
import Stats from "../Stats";
import { Flex, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { selectSelectedId } from "../../redux/ugvSlice";
import { modeClick, selectisManuel } from "../../redux/modeSlice";
import { toggleCamera } from "../../redux/cameraSlice"; // setActiveCamera yerine toggleCamera kullanılıyor

function RightCol() {
  const [carLat, setCarLat] = useState(null);
  const [carLong, setCarLong] = useState(null);
  const [carSpeed, setCarSpeed] = useState(null);
  const [selectedNo, setSelectedNo] = useState(null);

  const selectedId = useSelector(selectSelectedId);
  const isManuel = useSelector((state) => selectisManuel(state, selectedId)); // Seçili robotun manuel mod durumu
  const dispatch = useDispatch();

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
    dispatch(toggleCamera('right')); // Sağ kamerayı aktif hale getirmek için toggleCamera kullanılıyor
  };

  return (
    <Flex
      vertical={true}
      justify="space-evenly"
      align="center"
      style={{ height: "80vh", width: "50vh", position: "relative" }}
    >
      <Button
        type="primary"
        style={{
          position: "absolute",
          top: "10px",  
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
        onClick={handleRightCameraClick}  // Sağ kamera butonuna tıklandığında çağrılır
      >
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
          backgroundColor: isManuel ? "#a5d6a7" : "#f7c04a",
          borderColor: isManuel ? "#004d40" : "#f7c04a",
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
