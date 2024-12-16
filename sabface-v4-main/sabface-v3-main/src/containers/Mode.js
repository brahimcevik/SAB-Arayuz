import React, { useState } from "react";
import { Col, Row, Flex } from "antd";
import Weather from "../components/MainPage/Weather";
import ModeCarList from "../components/ModePage/ModeCarList";
import GoogleMaps from "../components/MainPage/GoogleMaps";
import ModeCard from "../components/ModePage/ModeCard";

function Mode() {
  const [selectedCarNo, setSelectedCarNo] = useState(null);
  const [localCoordinates, setLocalCoordinates] = useState([]); // Eklenen koordinatlar için state
  const [selectedCoordinates, setSelectedCoordinates] = useState({ lat: 39.1377, lng: 43.9244 }); // Default coordinates
  const [robots, setRobots] = useState([]);
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
            <ModeCarList
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
            <ModeCard
              selectedCarNo={selectedCarNo}
              setCoordinates={setLocalCoordinates} // Eklenen koordinatları aktar
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
            <Weather coordinates={selectedCoordinates} selectedCarNo={selectedCarNo} robots={robots} />
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
            <GoogleMaps 
              selectedCarNo={selectedCarNo}
              setSelectedCarNo={setSelectedCarNo}
              />
          </Flex>
        </Row>
      </Col>
    </Row>
  );
}

export default Mode;
