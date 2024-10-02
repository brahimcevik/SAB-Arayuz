import React, { useEffect, useState } from "react";
import { Card } from "antd";

const containerStyle = {
  width: "100%",
  height: "340px",
  display: "flex", // İhtiyaca göre bu yüksekliği ayarlayın
};

const center = {
  lat: 39.769736108873815,
  lng: 39.37325320122449,
};

const firstMarkerPosition = {
  lat: 39.769633,
  lng: 39.372979,
};

const secondMarkerPosition = {
  lat: 39.769674,
  lng: 39.373085,
};

const thirdMarkerPosition = {
  lat: 39.769834,
  lng: 39.373418,
};
const googleMapsApiKey = "AIzaSyDyMgwuK7JtmJiPjZx039AfYW7H5pyjS78"; // Gerçek Google Maps API anahtarınızı buraya ekleyin

const GoogleMaps = () => {
  const [map, setMap] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const initMap = () => {
      const mapInstance = new window.google.maps.Map(
        document.getElementById("advanced-marker-map"),
        {
          zoom: 18.5,
          center: center,
          mapTypeId: "satellite", // Harita tipini uydu görünümü olarak ayarla
          disableDefaultUI: true, // Tüm default kontrolleri kaldırır
        }
      );

      const infoWindowInstance = new window.google.maps.InfoWindow();
      const robot1Icon = {
        url: "https://i.hizliresim.com/hh9lylh.png", // Özelleştirilmiş marker ikonunun URL'si
        scaledSize: new window.google.maps.Size(50, 50), // Ikonun boyutunu ayarlayın
      };
      const robot2Icon = {
        url: "https://i.hizliresim.com/7lzzkk1.png",
        scaledSize: new window.google.maps.Size(50, 50),
      };
      const robot3Icon = {
        url: "https://i.hizliresim.com/984m89w.png",
        scaledSize: new window.google.maps.Size(50, 50),
      };

      const firstMarkerInstance = new window.google.maps.Marker({
        position: firstMarkerPosition,
        map: mapInstance,
        title: "Robot1",
        icon: robot1Icon, // Özelleştirilmiş ikon
      });

      const secondMarkerInstance = new window.google.maps.Marker({
        position: secondMarkerPosition,
        map: mapInstance,
        title: "Robot2",
        icon: robot2Icon, // Özelleştirilmiş ikon
      });

      const thirdMarkerInstance = new window.google.maps.Marker({
        position: thirdMarkerPosition,
        map: mapInstance,
        title: "Robot3",
        icon: robot3Icon, // Özelleştirilmiş ikon
      });

      firstMarkerInstance.addListener("click", () => {
        const content = `
          <div>
            <h2>Robot1</h2>
            <p>Enlem: ${firstMarkerPosition.lat}</p>
            <p>Boylam: ${firstMarkerPosition.lng}</p>
          </div>
        `;
        infoWindowInstance.setContent(content);
        infoWindowInstance.open(mapInstance, firstMarkerInstance);
      });

      secondMarkerInstance.addListener("click", () => {
        const content = `
          <div>
            <h2>Robot2</h2>
            <p>Enlem: ${secondMarkerPosition.lat}</p>
            <p>Boylam: ${secondMarkerPosition.lng}</p>
          </div>
        `;
        infoWindowInstance.setContent(content);
        infoWindowInstance.open(mapInstance, secondMarkerInstance);
      });

      thirdMarkerInstance.addListener("click", () => {
        const content = `
          <div>
            <h2>Robot3</h2>
            <p>Enlem: ${thirdMarkerPosition.lat}</p>
            <p>Boylam: ${thirdMarkerPosition.lng}</p>
          </div>
        `;
        infoWindowInstance.setContent(content);
        infoWindowInstance.open(mapInstance, thirdMarkerInstance);
      });

      setMap(mapInstance);
      setInfoWindow(infoWindowInstance);
      setMarkers([
        firstMarkerInstance,
        secondMarkerInstance,
        thirdMarkerInstance,
      ]);
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
      script.onload = () => {
        initMap();
      };
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  return (
    <Card
      style={{
        margin: "20px",
        width: "87vh",
        height: "52vh",
      }}
      className="bg-sabGreenDark dark:bg-sabGreenHardDark rounded-3xl border-sabGreenDark dark:border-sabGreenHardDark "
    >
      <div id="advanced-marker-map" style={containerStyle}></div>
    </Card>
  );
};

export default GoogleMaps;
