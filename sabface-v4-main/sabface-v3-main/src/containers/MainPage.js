import React, { useEffect, useState } from "react";
import { Col, Row, Flex } from "antd";
import Weather from "../components/MainPage/Weather";
import CarList from "../components/MainPage/CarList";
import GoogleMaps from "../components/MainPage/GoogleMaps";
import VehiclePage from "./VehiclePage";
import ManuelMode from "../components/CameraPage/ManuelMode";
import { useSelector } from "react-redux";
import { selectIsVehicleClicked } from "../redux/navigationSlice";
import { selectisManuel } from "../redux/modeSlice";

function MainPage() {
  const [showVehiclePage, setShowVehiclePage] = useState(false);

  const isVehicleClicked = useSelector(selectIsVehicleClicked);
  const selectedId = useSelector((state) => state.ugv.selectedId); // UGV'den seçili robot ID'si
  const isManuel = useSelector((state) => selectisManuel(state, selectedId)); // Manuel mod durumu

  useEffect(() => {
    setShowVehiclePage(isVehicleClicked);
  }, [isVehicleClicked]);

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
        className={isManuel ? "bg-sabGreenDark dark:bg-sabGreenHardDark rounded-3xl px-10" : ""} // Manuel modda yeşil arka plan
        // style={
        //   { borderRadius: "1.5rem", padding: "10px" }}  // Köşeleri yuvarlama ve padding
      >
        {isManuel ? (
          // Manuel mod aktif olduğunda ManuelMode'u tam ortada hizala
          <Flex
            justify="center"
            align="center"
            
          >
            <ManuelMode />  {/* Manuel Mode Bileşeni */}
          </Flex>
        ) : (
          // Otomatik modda Weather ve Google Maps bileşenleri
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
