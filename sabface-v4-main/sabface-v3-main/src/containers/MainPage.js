import React, { useEffect, useState } from "react";
import { Col, Row, Flex } from "antd";
import Weather from "../components/MainPage/Weather";
import CarList from "../components/MainPage/CarList";
import GoogleMaps from "../components/MainPage/GoogleMaps";
import VehiclePage from "./VehiclePage";
import { useSelector } from "react-redux";
import { selectIsVehicleClicked } from "../redux/navigationSlice";

function MainPage() {
  const [showVehiclePage, setShowVehiclePage] = useState(false);

  const isVehicleClicked = useSelector(selectIsVehicleClicked);

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
      <Col span={12}>
        <Row
          style={{ height: "30%", marginLeft: "1rem" }}
          className="flex justify-center items-center w-full"
        >
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
      </Col>
    </Row>
  );
}

export default MainPage;
