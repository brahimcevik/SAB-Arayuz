// ../containers/GraphicPage.js
import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import SpeedGraphic from "../components/GrapichPage/SpeedGraphic";
import DistanceGraphic from "../components/GrapichPage/DistanceGraphic";
import MedicineGraphic from "../components/GrapichPage/MedicineGraphic";
import CarList from "../components/MainPage/CarList";
 


  

function GraphicPage() {
  const [selectedCarNo, setSelectedCarNo] = useState(null);
  return (
    <div>
      <Row justify="space-evenly" gutter={[32, 32]} style={{marginTop:"40px"}}>
        <Col>
          <CarList
          selectedCarNo={selectedCarNo}
          setSelectedCarNo={setSelectedCarNo}
          width="80vh" height="38vh"/> {/* Burada özel boyutları seçiyoruz */}
          
        </Col>
        <Col>
          <SpeedGraphic
           
           />
        </Col>
        <Col>
          <MedicineGraphic 
           
          />
        </Col>
        <Col>
        <DistanceGraphic 
          
        />
        </Col>
      </Row>
    </div>
  );
}

export default GraphicPage;
