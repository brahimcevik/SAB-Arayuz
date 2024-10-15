import React, { useEffect, useState } from "react";
import { Col, Row, Flex } from "antd";
import Weather from "../components/MainPage/Weather";
import CarList from "../components/MainPage/CarList";
import GoogleMaps from "../components/MainPage/GoogleMaps";
import VehiclePage from "./VehiclePage";
import ManuelMode from "../components/CameraPage/ManuelMode";
import Camera from "../components/CameraPage/Camera";
import LeftCamera from "../components/CameraPage/LeftCamera";
import RightCamera from "../components/CameraPage/RightCamera";
import { useSelector } from "react-redux";
import { selectIsVehicleClicked } from "../redux/navigationSlice";
import { selectisManuel } from "../redux/modeSlice";
import { selectActiveCamera } from "../redux/cameraSlice";  // Redux'tan aktif kamera durumunu çekiyoruz

function MainPage() {
  const [showVehiclePage, setShowVehiclePage] = useState(false);

  const isVehicleClicked = useSelector(selectIsVehicleClicked);
  const selectedId = useSelector((state) => state.ugv.selectedId); // UGV'den seçili robot ID'si
  const isManuel = useSelector((state) => selectisManuel(state, selectedId)); // Manuel mod durumu
  const activeCamera = useSelector(selectActiveCamera); // Redux'tan aktif kamera bilgisi

  useEffect(() => {
    setShowVehiclePage(isVehicleClicked);
  }, [isVehicleClicked]);

  // Aktif kameraya göre kamera bileşenini render eden fonksiyon
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
    <Row gutter={[16, 16]}> {/* Sütunlar arasına boşluk eklemek için gutter */}
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
        className={isManuel || activeCamera !== "front" ? "bg-sabGreenDark dark:bg-sabGreenHardDark rounded-3xl px-10" : ""} // Kamera sayfası veya manuel mod aktifse yeşil arka plan
      >
        {isManuel ? (
          // Manuel mod aktif olduğunda ManuelMode'u tam ortada hizala
          <Flex justify="center" align="center">
            <ManuelMode />  {/* Manuel Mode Bileşeni */}
          </Flex>
        ) : activeCamera !== "front" ? (
          // Eğer aktif kamera sol ya da sağ ise sadece kamera göster
          <Flex justify="center" align="center" style={{ height: "calc(110% - 50px)" }}>
            {renderCamera()} {/* Aktif kameraya göre kamera bileşeni */}
          </Flex>
        ) : (
          // Otomatik modda hem hava durumu hem de Google Maps bileşenlerini göster
          <>
            <Row style={{ height: "30%", marginLeft: "1rem" }} className="w-full">
              <Flex
                justify="center"
                align="center"
                style={{
                  height: "100%",
                  width: "100%",
                }}
              >
                <Weather />
              
              </Flex>
            </Row>
            <Row style={{ height: "70%" }}>
              <Flex
                justify="center"
                style={{
                  height: "100%",
                  width: "100%",
                }}
              >
                <GoogleMaps />
              </Flex>
            </Row>
          </>
        )}
      </Col>
    </Row>
  );
}

export default MainPage;
