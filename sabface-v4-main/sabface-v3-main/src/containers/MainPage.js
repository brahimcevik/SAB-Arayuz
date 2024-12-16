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
import { useSelector, useDispatch } from "react-redux";
import { selectIsVehicleClicked } from "../redux/navigationSlice";
import { selectisManuel } from "../redux/modeSlice";
import { selectActiveCameras, removeCamera } from "../redux/cameraSlice"; // removeCamera ekleniyor
import { selectCityCoordinates } from "../redux/ugvCoordinatesSlice"; // selectCityCoordinates'ı içe aktar
function MainPage() {
  const [showVehiclePage, setShowVehiclePage] = useState(false);
  const dispatch = useDispatch(); // useDispatch ekleniyor
  const isVehicleClicked = useSelector(selectIsVehicleClicked);
  const selectedId = useSelector((state) => state.ugv.selectedId);
  const isManuel = useSelector((state) => selectisManuel(state, selectedId));
  const activeCameras = useSelector(selectActiveCameras);
  const [selectedCarNo, setSelectedCarNo] = useState(null);
  const [robots, setRobots] = useState([]);
  const cityCoordinates = useSelector(selectCityCoordinates); // Redux store'dan koordinatları al

  useEffect(() => {
    setShowVehiclePage(isVehicleClicked);
  }, [isVehicleClicked]);

  // Kamera bileşenlerini render eden fonksiyon
  const renderCameras = () => {
    const camerasToRender = activeCameras.length > 0 ? [...activeCameras] : ["front"];
    const cameraCount = camerasToRender.length;

    if (cameraCount === 3) {
      // Ön kamerayı üst bölmeye yerleştirme
      const frontCameraIndex = camerasToRender.indexOf("front");
      if (frontCameraIndex !== -1) {
        // Ön kamerayı üst bölmeye al
        const [frontCamera] = camerasToRender.splice(frontCameraIndex, 1);
        camerasToRender.unshift(frontCamera);
      }
    }
    if (cameraCount === 2) {
      // İkili bölmede ön kamerayı üst kısma yerleştirme
      const frontCameraIndex = camerasToRender.indexOf("front");
      if (frontCameraIndex !== -1 && frontCameraIndex !== 0) {
        // Ön kamerayı üst bölmeye al
        const [frontCamera] = camerasToRender.splice(frontCameraIndex, 1);
        camerasToRender.unshift(frontCamera);
      }
    }


    const closeCamera = (camera) => {
      dispatch(removeCamera(camera)); // Kamera kaldırma işlemi
    };

    return (
      <div className="camera-container">
        {cameraCount === 1 && (
          <div className="camera-single">
            <div className="close-button" onClick={() => closeCamera(camerasToRender[0])}>
              X
            </div>
            {camerasToRender[0] === "front" ? <Camera /> : camerasToRender[0] === "left" ? <LeftCamera /> : <RightCamera />}
          </div>
        )}
        {cameraCount === 2 && (
          <div className="camera-two-stack">
            <div className="camera-half">
              <div className="close-button" onClick={() => closeCamera(camerasToRender[0])}>
                X
              </div>
              {camerasToRender[0] === "front" ? <Camera /> : camerasToRender[0] === "left" ? <LeftCamera /> : <RightCamera />}
            </div>
            <div className="camera-half">
              <div className="close-button" onClick={() => closeCamera(camerasToRender[1])}>
                X
              </div>
              {camerasToRender[1] === "left" ? <LeftCamera /> : camerasToRender[1] === "right" ? <RightCamera /> : <Camera />}
            </div>
          </div>
        )}
        {cameraCount === 3 && (
          <>
            <div className="camera-large">
              <div className="close-button" onClick={() => closeCamera(camerasToRender[0])}>
                X
              </div>
              {camerasToRender[0] === "front" ? <Camera /> : camerasToRender[0] === "left" ? <LeftCamera /> : <RightCamera />}
            </div>
            <div className="camera-row">
              <div className="camera-small">
                <div className="close-button" onClick={() => closeCamera(camerasToRender[1])}>
                  X
                </div>
                {camerasToRender[1] === "left" ? <LeftCamera /> : camerasToRender[1] === "right" ? <RightCamera /> : <Camera />}
              </div>
              <div className="camera-small">
                <div className="close-button" onClick={() => closeCamera(camerasToRender[2])}>
                  X
                </div>
                {camerasToRender[2] === "left" ? <LeftCamera /> : camerasToRender[2] === "right" ? <RightCamera /> : <Camera />}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <Row style={{ height: "80vh" }}>
    <Col span={12}>
  <Flex justify="center" align="center" style={{ height: "100%" }}>
    {showVehiclePage ? <VehiclePage setSelectedCarNo={setSelectedCarNo} /> : <CarList selectedCarNo={selectedCarNo} setSelectedCarNo={setSelectedCarNo} />}
  </Flex>
</Col>

<Col span={12} className={isManuel || activeCameras.length ? "bg-sabGreenDark dark:bg-sabGreenHardDark rounded-3xl px-10" : ""} style={{ height: "100%" }}>
  {isManuel ? (
    <Flex justify="center" align="center" style={{ height: "100%" }}>
      <ManuelMode />
    </Flex>
  ) : activeCameras.length > 0 ? (
    <Flex justify="center" align="center" style={{ width: "100%", height: "100%" }}>
      {renderCameras()} {/* Render active cameras */}
    </Flex>
  ) : (
    <>
      <Row style={{ height: "30%", marginLeft: "1rem" }} className="w-full">
        <Flex justify="center" align="center" style={{ height: "100%", width: "100%" }}>
          <Weather selectedCarNo={selectedCarNo} robots={robots}  cityCoordinates={cityCoordinates}/>
        </Flex>
      </Row>
      <Row style={{ height: "70%" }}>
        <Flex justify="center" style={{ height: "100%", width: "100%" }}>
          <GoogleMaps 
            selectedCarNo={selectedCarNo} 
            setSelectedCarNo={setSelectedCarNo} 
          />
        </Flex>
      </Row>
    </>
  )}
</Col>
    </Row>
  );
}

export default MainPage;

// CSS Styles
const styles = `
.camera-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    padding: 5px;
    box-sizing: border-box;
}

.close-button {
    position: absolute; /* Mutlaka konumlandırma için gerekli */
    top: 10px;
    right: 10px;
    background-color: rgba(255, 255, 255, 0.7);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10; /* Diğer içeriklerin üstünde görünmesi için */
}

.camera-single {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: #ffffff;
    position: relative; /* X simgesi için gerekli */
}

.camera-two-stack {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.camera-half {
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: #ffffff;
    margin-bottom: 5px;
    position: relative; /* X simgesi için gerekli */
}

.camera-large {
    width: 100%;
    height: 45vh;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: #ffffff;
    position: relative; /* X simgesi için gerekli */
}

.camera-row {
    display: flex;
    height: 30vh;
    width: 100%;
}
    
.camera-small {
    flex: 1;
    margin-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: #ffffff;
    position: relative; /* X simgesi için gerekli */
}

.camera-small:first-child {
    margin-left: 0;
}
`;

document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);
