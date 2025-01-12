import React, { useState, useEffect } from "react";
import { Col, Row, Flex } from "antd";
import Vehicle from "../components/VehiclePage/Vehicle";
import LeftCol from "../components/VehiclePage/LeftCol";
import RightCol from "../components/VehiclePage/RightCol";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { vehicleCardClick } from "../redux/navigationSlice";
import { selectSelectedId, setSelectedId } from "../redux/ugvSlice";
import { toggleCamera } from "../../src/redux/cameraSlice"; // Redux'tan toggleCamera'ı import ettik
import { selectCameraStatus } from "../../src/redux/cameraSlice";
import { setCityCoordinates } from "../redux/ugvCoordinatesSlice"; // Import setCityCoordinates
import { selectCityCoordinates } from "../redux/ugvCoordinatesSlice"; // selectCityCoordinates'ı içe aktar

function VehiclePage({ setSelectedCarNo }) {
  const dispatch = useDispatch();
  const selectId = useSelector(selectSelectedId);
  const cityCoordinates = useSelector(selectCityCoordinates); // Redux'tan şehir koordinatlarını al
  const [buttonStatus, setButtonStatus] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [onlineStatus, setOnlineStatus] = useState("true");
  const cameraStatus = useSelector(selectCameraStatus);
  const [leftCameraStatus, setLeftCameraStatus] = useState(false);
  const [rightCameraStatus, setRightCameraStatus] = useState(false);
  

  // Varsayılan koordinatları kullan
  useEffect(() => {
    if (cityCoordinates.latitude && cityCoordinates.longitude) {
      // Koordinatlar mevcutsa, gerekli işlemleri yap
    
      console.log("Varsayılan Koordinatlar:", cityCoordinates);
    }
  }, [cityCoordinates]);

  // Fetch initial data
  useEffect(() => {
    fetch(`https://localhost:44315/api/UgvRobot/${selectId}`)
      .then((response) => response.json())
      .then((data) => {
        setCurrentData(data);
        setButtonStatus(data.status);
        setOnlineStatus(data.onlineStatus);
        const { heading } = data;
        localStorage.setItem('heading', heading);
      })
      .catch((error) => {
        console.error("Veri alınırken bir hata oluştu:", error);
      });
  }, [selectId]);

  // Online status güncellemesi için yeni fonksiyon
  const updateOnlineStatus = async (isOnline) => {
    try {
      // Mevcut durumu al
      const response = await fetch(`https://localhost:44315/api/UgvRobot/${selectId}`);
      const data = await response.json();
      const currentStatuses = data.onlineStatus.split(',');
      
      // Sadece ilk elemanı güncelle, diğerlerini koru
      currentStatuses[0] = isOnline ? "true" : "false";
      const newStatusString = currentStatuses.join(',');

      await fetch(`https://localhost:44315/api/UgvRobot/update-online-status/${data.no}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          onlineStatus: newStatusString
        }),
      });
    } catch (error) {
      console.error("Online status update failed:", error);
    }
  };

  // Kamera durumu güncellemesi için fonksiyonu güncelle
  const updateCameraStatus = async (cameraIndex, newStatus) => {
    try {
        const response = await fetch(`https://localhost:44315/api/UgvRobot/${selectId}`);
        const data = await response.json();
        let currentStatuses = data.onlineStatus.split(',');

        while (currentStatuses.length < 4) {
            currentStatuses.push('false');
        }

        // Kamera isimlerini tanımla
        const cameraNames = ["left", "leftCamera", "rightCamera", "onCamera"];
        
        // Durum ve isimleri birleştir
        currentStatuses[cameraIndex] = `[${newStatus.toString()}-${cameraNames[cameraIndex]}]`;
        const newStatusString = currentStatuses.join(',');

        const updateResponse = await fetch(`https://localhost:44315/api/UgvRobot/update-online-status/${data.no}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                onlineStatus: newStatusString,
                siraUzunlugu: data.siraUzunlugu || 0,
                ikiSiraArasiMesafe: data.ikiSiraArasiMesafe || 0,
                toplamSiraSayisi: data.toplamSiraSayisi || 0,
                donusDerecesi: data.donusDerecesi || 0,
                ilkDonusAcisi: data.ilkDonusAcisi || "0",
                mod2: data.mod2 || "default",
                status: data.status || false
            }),
        });

        // if (!updateResponse.ok) {
        //     throw new Error('Failed to update camera status');
        // }

        console.log(`Camera ${cameraNames[cameraIndex]} status updated to ${newStatus}`);
    } catch (error) {
        console.error("Camera status update failed:", error);
    }
  };

  // Online durum güncellemeleri için useEffect'i güncelle
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`https://localhost:44315/api/UgvRobot/${selectId}`);
        const data = await response.json();
        const isOffline = data.onlineStatus.split(',')[0] === "false";
        setOnlineStatus(isOffline);
        
        // Robot online ise status'u güncelle
        if (!isOffline) {
          await updateOnlineStatus(true);
        }
      } catch (error) {
        console.error("Online status check failed:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectId]);

  const geriDon = () => {
  dispatch(vehicleCardClick());
  dispatch(setSelectedId(null));


  setSelectedCarNo(null); // Seçili aracı sıfırla
};

  const statusDegistir = () => {
    const yeniStatus = !buttonStatus;
    setButtonStatus(yeniStatus);

   

    fetch(`https://localhost:44315/api/UgvRobot/update-status/${currentData.no}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        siraUzunlugu: currentData ? currentData.siraUzunlugu : 0,
        ikiSiraArasiMesafe: currentData ? currentData.ikiSiraArasiMesafe : 0,
        toplamSiraSayisi: currentData ? currentData.toplamSiraSayisi : 0,
        donusDerecesi: currentData ? currentData.donusDerecesi : 0,
        ilkDonusAcisi: currentData ? currentData.ilkDonusAcisi : "string",
        mod2: currentData ? currentData.mod2 : "string",
        status: yeniStatus,
       
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Durum başarıyla güncellendi");
        } else {
          console.error("Durum güncellenirken bir hata oluştu");
        }
      })
      .catch((error) => {
        console.error("İstek yapılırken bir hata oluştu:", error);
      });
  };

  const borderRadiusLeft = "1.5rem 0 0 1.5rem";
  const borderRadiusRight = "0 1.5rem 1.5rem 0";

  // Ön kamera butonunu ayarlıyoruz
  const handleFrontCameraClick = () => {
    const newStatus = !cameraStatus.front;
    dispatch(toggleCamera("front"));
    updateCameraStatus(3, newStatus); // Ön kamera: index 3
  };

  return (
    <Row
      style={{ width: "87vh", height: "80vh", position: "relative" }}
      className="bg-sabGreenDark dark:bg-sabGreenHardDark border rounded-3xl border-sabGreenDark dark:border-sabGreenHardDark"
    >
      <Col span={8}>
        <Flex
          justify="center"
          align="center"
          style={{
            height: "100%",
            borderRadius: borderRadiusLeft,
          }}
        >
          <LeftCol 
            leftCameraStatus={leftCameraStatus} 
            setLeftCameraStatus={setLeftCameraStatus}
            onCameraClick={(status) => updateCameraStatus(1, status)} // Sol kamera: index 1
          />
        </Flex>
      </Col>
      <Col span={8}>
        <Flex
          justify="flex-start"
          align="center"
          style={{
            height: "100%",
            flexDirection: "column",
            position: "relative",
            padding: "20px",
          }}
        >
          <button
            onClick={handleFrontCameraClick}
            type="button"
            className="bg-sabGreenDark dark:bg-sabYellow dark:text-sabDarkBlack text-white py-2 px-4 rounded-lg shadow-lg hover:bg-sabGreenLight dark:hover:bg-sabHardYellow w-full flex items-center justify-center w-1/2 px-5 py-2 text-sm transition-colors duration-200 border rounded-lg gap-x-2 sm:w-auto"
            style={{
              marginBottom: "20px",
              position: "absolute",
              top: "10px",
              borderColor: "#004d40", // Consistent border color
            }}
          >
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: cameraStatus.front ? "#00A36C" : "#B22222",
                display: "inline-block",
                marginRight: "8px",
              }}
            ></span>
            Ön Kamera
          </button>

          <div style={{ flexGrow: 1 }} />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                Robot İsmi
              </span>
            </div>

            <button
              onClick={geriDon}
              type="button"
              className="w-full flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
              style={{ marginBottom: "10px", backgroundColor: "white", color: "black" }}
            >
              <ArrowUturnLeftIcon />
              <span>Geri Dön</span>
            </button>

            <Vehicle />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "10px",
                marginBottom: "5px",
                width: "50%",
                backgroundColor: "#fff",
                borderRadius: "8px",
                padding: "10px 0",
              }}
            >
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: onlineStatus ? "#B22222" : "#00A36C",
                  display: "inline-block",
                  marginRight: "8px",
                }}
              ></span>
              <span style={{ fontSize: "16px", color: "#333" }}>
                {onlineStatus ? "Offline" : "Online"}
              </span>
            </div>

            <button
              onClick={statusDegistir}
              type="button"
              style={{
                width: "50%",
                padding: "10px",
                marginTop: "10px",
              }}
              className={`text-sm font-medium border rounded-lg ${
                buttonStatus
                  ? "bg-red-500 text-white border-red-700"
                  : "bg-green-500 text-white border-green-700"
              }`}
            >
              {buttonStatus ? "Dur" : "Devam Et"}
            </button>
          </div>
        </Flex>
      </Col>
      <Col span={8}>
        <Flex
          justify="center"
          align="center"
          style={{
            height: "100%",
            borderRadius: borderRadiusRight,
          }}
        >
          <RightCol 
            rightCameraStatus={rightCameraStatus} 
            setRightCameraStatus={setRightCameraStatus}
            onCameraClick={(status) => updateCameraStatus(2, status)} // Sağ kamera: index 2
          />
        </Flex>
      </Col>
    </Row>
  );
}

export default VehiclePage;