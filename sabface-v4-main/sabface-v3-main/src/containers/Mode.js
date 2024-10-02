import React, { useState } from "react";
import { Col, Row, Flex } from "antd";
import Weather from "../components/MainPage/Weather";
import CarList from "../components/ModePage/ModeCarList";
import GoogleMaps from "../components/MainPage/GoogleMaps";
import ModeCard from "../components/ModePage/ModeCard";

function Mode() {
  // selectedCarNo ve setSelectedCarNo state'lerini tanımlıyoruz
  const [selectedCarNo, setSelectedCarNo] = useState(null);

  return (
    <Row>
      <Col span={12}>
        <Row style={{ marginLeft: "1rem" }}>
          <Flex
            justify="center"
            align="center"
            style={{
              height: "100%",
            }}
          >
            {/* CarList bileşenine selectedCarNo ve setSelectedCarNo prop'larını geçiriyoruz */}
            <CarList
              selectedCarNo={selectedCarNo}
              setSelectedCarNo={setSelectedCarNo}
            />
          </Flex>
        </Row>
        <Row>
          <Flex
            justify="center"
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            {/* ModeCard bileşenine selectedCarNo ve setSelectedCarNo prop'larını geçiriyoruz */}
            <ModeCard
              selectedCarNo={selectedCarNo}
              setSelectedCarNo={setSelectedCarNo}
            />
          </Flex>
        </Row>
      </Col>
      <Col span={12}>
        <Row style={{ height: "30%", marginLeft: "1rem" }}>
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

export default Mode;
