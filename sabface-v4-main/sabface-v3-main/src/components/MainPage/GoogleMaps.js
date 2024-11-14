import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { useSelector } from "react-redux";
import { selectSelectedId } from "../../redux/ugvSlice";

const containerStyle = {
  width: "100%",
  height: "340px",
  display: "flex",
};

const center = {
  lat: 39.769736108873815,
  lng: 39.37325320122449,
};

const googleMapsApiKey = "AIzaSyDyMgwuK7JtmJiPjZx039AfYW7H5pyjS78"; // Gerçek Google Maps API anahtarınızı buraya ekleyin

const GoogleMaps = () => {
  const selectedId = useSelector(selectSelectedId);
  const [map, setMap] = useState(null);
  const [robots, setRobots] = useState([]);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchAllRobots = async () => {
      try {
        const response = await fetch("https://localhost:44315/api/UgvRobot");
        const data = await response.json();
        setRobots(data);
      } catch (error) {
        console.error("Error fetching robot data:", error);
      }
    };

    fetchAllRobots();

    const initMap = () => {
      if (!map) {
        const mapInstance = new window.google.maps.Map(
          document.getElementById("advanced-marker-map"),
          {
            zoom: 18.5,
            center: center,
            mapTypeId: "satellite",
            disableDefaultUI: true,
          }
        );
        setMap(mapInstance);
      }
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

  useEffect(() => {
    if (map && robots.length > 0) {
      // Tüm eski marker'ları kaldır
      markers.forEach((marker) => marker.setMap(null));

      const newMarkers = robots.map((robot) => {
        const marker = new window.google.maps.Marker({
          position: { lat: robot.carLat, lng: robot.carLong },
          map: map,
          icon: robot.id === selectedId
            ? {
                url: "https://i.hizliresim.com/7lzzkk1.png", // Seçili robot için farklı ikon
                scaledSize: new window.google.maps.Size(60, 60),
              }
            : {
                url: "https://i.hizliresim.com/hh9lylh.png", // Diğer robotlar için ikon
                scaledSize: new window.google.maps.Size(50, 50),
              },
          title: robot.ugvName || "Robot",
        });

        marker.addListener("click", () => {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div>
                <h2>${robot.ugvName || "Robot"}</h2>
                <p>Enlem: ${robot.carLat}</p>
                <p>Boylam: ${robot.carLong}</p>
              </div>
            `,
          });
          infoWindow.open(map, marker);
        });

        return marker;
      });

      setMarkers(newMarkers);
    }
  }, [map, robots, selectedId]);

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
