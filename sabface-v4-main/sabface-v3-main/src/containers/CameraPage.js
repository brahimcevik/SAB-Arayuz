import React, { useEffect, useState } from "react";
import { Col, Row, Flex } from "antd";
import Camera from "../components/CameraPage/Camera";
import CarList from "../components/MainPage/CarList";
import VehiclePage from "./VehiclePage";
import { useSelector } from "react-redux";
import { selectIsVehicleClicked } from "../redux/navigationSlice";
import { selectisManuel } from "../redux/modeSlice"; // modeSlice selector'ını ekledik
import ManuelMod from "../components/CameraPage/ManuelMode";  // Manuel mod bileşeni
import { selectSelectedId } from "../redux/ugvSlice"; // Seçili robot ID'sini al

function CameraPage() {
  const [showVehiclePage, setShowVehiclePage] = useState(false);
  const selectedId = useSelector(selectSelectedId); // Seçili robotun ID'si

  const isVehicleClicked = useSelector(selectIsVehicleClicked);
  const isManuel = useSelector((state) => selectisManuel(state, selectedId)); // Seçili robot için manuel mod durumu

  useEffect(() => {
    setShowVehiclePage(isVehicleClicked);
  }, [isVehicleClicked]);

  return (
    <Row>
      <Col span={12}>
        <Flex
          justify="center"
          align="center"
          style={{ height: "100%" }}
          className="scroll-pl-6 snap-x "
        >
          {showVehiclePage ? <VehiclePage /> : <CarList />}
        </Flex>
      </Col>
      <Col
        span={12}
        className="bg-sabGreenDark dark:bg-sabGreenHardDark rounded-3xl px-10"
      >
        <Flex justify="center" align="center">
          {isManuel ? <ManuelMod /> : <Camera />} {/* Manuel moda göre bileşen */}
        </Flex>
      </Col>
    </Row>
  );
}

export default CameraPage;
