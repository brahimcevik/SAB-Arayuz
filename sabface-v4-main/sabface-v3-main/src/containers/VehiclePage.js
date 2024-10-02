import React, { useState, useEffect } from "react";
import { Col, Row, Flex } from "antd";
import Vehicle from "../components/VehiclePage/Vehicle";
import LeftCol from "../components/VehiclePage/LeftCol";
import RightCol from "../components/VehiclePage/RightCol";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { vehicleCardClick } from "../redux/navigationSlice";
import { selectSelectedId } from "../redux/ugvSlice";

function VehiclePage() {
  const dispatch = useDispatch();
  const selectId = useSelector(selectSelectedId);
  const [buttonStatus, setButtonStatus] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [onlineStatus, setOnlineStatus] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetch(`https://localhost:44315/api/UgvRobot/${selectId}`)
      .then((response) => response.json())
      .then((data) => {
        setCurrentData(data);
        setButtonStatus(data.status);
        setOnlineStatus(data.onlineStatus);
      })
      .catch((error) => {
        console.error("Mevcut veriler alınırken bir hata oluştu:", error);
      });
  }, [selectId]);

  // Online durum güncellemeleri 
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`https://localhost:44315/api/UgvRobot/${selectId}`)
        .then((response) => response.json())
        .then((data) => {
          setOnlineStatus(data.onlineStatus);
        })
        .catch((error) => {
          console.error("Online durum güncellenirken bir hata oluştu:", error);
        });
    }, 5000); 

    return () => clearInterval(interval); 
  }, [selectId]);

  const geriDon = () => {
    dispatch(vehicleCardClick());
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
          <LeftCol />
        </Flex>
      </Col>
      <Col span={8}>
        <Flex
          justify="center"
          align="center"
          style={{
            height: "100%",
            flexDirection: "column",
          }}
        >
          <button
            onClick={geriDon}
            type="button"
            className="w-full flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
            style={{ marginBottom: "10px", marginTop: "100px" }} // "Geri Dön" butonu biraz aşağı alındı
          >
            <ArrowUturnLeftIcon />
            <span>Geri Dön</span>
          </button>

          {/* Araç Bileşeni (Robot) */}
          <Vehicle />

          {/* Online/Offline Durumu - Robotun Altına Taşındı */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10px", // Robot ile durumu arasında boşluk
              marginBottom: "5px", // Durum ile buton arasında boşluk
              width: "50%", // Butonlarla aynı genişlikte
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
                backgroundColor: onlineStatus ? "#00A36C" : "#B22222",
                display: "inline-block",
                marginRight: "8px",
              }}
            ></span>
            <span style={{ fontSize: "16px", color: "#333" }}>
              {onlineStatus ? "Online" : "Offline"}
            </span>
          </div>

          {/* Dur/Devam Et Butonu */}
          <button
            onClick={statusDegistir}
            type="button"
            style={{
              width: "50%", // Online/Offline durumu ile aynı genişlikte
              padding: "10px", // Boyut ayarı
              marginTop: "10px", // Durum ile buton arasında boşluk
            }}
            className={`text-sm font-medium border rounded-lg ${
              buttonStatus
                ? "bg-red-500 text-white border-red-700"
                : "bg-green-500 text-white border-green-700"
            }`}
          >
            {buttonStatus ? "Dur" : "Devam Et"}
          </button>
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
          <RightCol />
        </Flex>
      </Col>
    </Row>
  );
}

export default VehiclePage;