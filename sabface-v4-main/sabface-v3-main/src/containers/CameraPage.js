import React, { useEffect, useState } from "react";
import { Col, Row, Flex } from "antd";
import Camera from "../components/CameraPage/Camera";
import LeftCamera from "../components/CameraPage/LeftCamera";
import RightCamera from "../components/CameraPage/RightCamera";
import CarList from "../components/MainPage/CarList";
import VehiclePage from "./VehiclePage";
import { useSelector } from "react-redux";
import { selectIsVehicleClicked } from "../redux/navigationSlice";
import { selectisManuel } from "../redux/modeSlice";
import ManuelMod from "../components/CameraPage/ManuelMode";
import { selectSelectedId } from "../redux/ugvSlice";
import { selectActiveCamera } from "../redux/cameraSlice";  // Redux'tan kamerayı çekiyoruz

function CameraPage() {
  const [showVehiclePage, setShowVehiclePage] = useState(false);
  const selectedId = useSelector(selectSelectedId);
  const isVehicleClicked = useSelector(selectIsVehicleClicked);
  const isManuel = useSelector((state) => selectisManuel(state, selectedId));
  const activeCamera = useSelector(selectActiveCamera);  // Aktif kamerayı Redux'tan al

  useEffect(() => {
    setShowVehiclePage(isVehicleClicked);
  }, [isVehicleClicked]);

  const renderCamera = () => {
    switch (activeCamera) {
      case "left":
        return <LeftCamera />;
      case "right":
        return <RightCamera />;
      case "front":
      default:
        return <Camera />;
    }
  };

  return (
    <Row>
      <Col span={12}>
        <Flex justify="center" align="center" style={{ height: "100%" }} className="scroll-pl-6 snap-x">
          {showVehiclePage ? <VehiclePage /> : <CarList />}
        </Flex>
      </Col>
      <Col span={12} className="bg-sabGreenDark dark:bg-sabGreenHardDark rounded-3xl px-10">
        {/* Sol kamera butonunu kaldırdık */}
        <Flex justify="center" align="center" style={{ height: "calc(110% - 50px)" }}>
          {isManuel ? <ManuelMod /> : renderCamera()} {/* Manuel moda göre bileşen */}
        </Flex>
      </Col>
    </Row>
  );
}

export default CameraPage;
