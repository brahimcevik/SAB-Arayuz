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

  

const googleMapsApiKey = "AIzaSyDyMgwuK7JtmJiPjZx039AfYW7H5pyjS78";

const GoogleMaps = ({ selectedCarNo, setSelectedCarNo }) => {
  const [map, setMap] = useState(null);
  const [robots, setRobots] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [mod2Markers, setMod2Markers] = useState([]);

  // Robotları çek
  const fetchRobots = async () => {
    const userId = localStorage.getItem('userId'); // Local storage'dan userId'yi al
    const roles = JSON.parse(sessionStorage.getItem("roles")); // Kullanıcının rollerini al
    const isAdmin = roles && roles.includes("Admin"); // Admin olup olmadığını kontrol et

    if (userId) {
      try {
        const url = isAdmin 
            ? `https://localhost:44315/api/UgvRobot` // Admin için istek
            : `https://localhost:44315/api/UgvRobot/user/${userId}`; // Normal kullanıcı için istek
        const response = await fetch(url);
        const data = await response.json();
        setRobots(data);
      } catch (error) {
        console.error("Error fetching robot data:", error);
      }
    }
  };

  // Mod2 koordinatların çek
  const fetchMod2Coordinates = async (carNo) => {
    try {
      const response = await fetch(
        `https://localhost:44315/api/UgvRobot/mod/${carNo}`
      );
      if (response.ok) {
        const data = await response.json();
        return JSON.parse(data.mod2 || "[]");
      }
      return [];
    } catch (error) {
      console.error("Error fetching mod2 data:", error);
      return [];
    }
  };

  const fetchWeatherDataWithCoordinates = async (coordinates) => {
    const apiKey = "0c0dcdc7e9b2975a7e115ed4ec2ae3ab";
    const { lat, lng } = coordinates;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("API request failed");
      }
      const data = await response.json();
      // Hava durumu verisini işleme
      // ... (veri işleme kodu)
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    fetchRobots(); // İlk veri çekimi

    const interval = setInterval(() => {
      fetchRobots(); // Her 5 saniyede bir veri çek
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initMap = () => {
      if (!map) {
        const mapInstance = new window.google.maps.Map(
          document.getElementById("advanced-marker-map"),
          {
            zoom: 5,
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
    if (map) {
      // Clear previous markers
      markers.forEach((marker) => marker.setMap(null));
      mod2Markers.forEach((marker) => marker.setMap(null));
  
      if (selectedCarNo === null) {
        // Show all robots
        const newMarkers = robots.map((robot) => {
          const marker = new window.google.maps.Marker({
            position: { lat: robot.carLat, lng: robot.carLong },
            map: map,
            icon: {
              url: "https://i.hizliresim.com/hh9lylh.png", // Normal icon
              scaledSize: new window.google.maps.Size(50, 50),
            },
            title: robot.ugvName || "Robot",
          });
  
          marker.addListener("click", () => {
            setSelectedCarNo(robot.no); // Set selected car number
          });
  
          return marker;
        });
  
        setMarkers(newMarkers);
      } else {
        // Show only the selected robot
        const selectedRobot = robots.find((robot) => robot.no === selectedCarNo);
        if (selectedRobot) {
          const robotMarker = new window.google.maps.Marker({
            position: { lat: selectedRobot.carLat, lng: selectedRobot.carLong },
            map: map,
            icon: {
              url: "https://i.hizliresim.com/7lzzkk1.png", // Special icon
              scaledSize: new window.google.maps.Size(60, 60),
            },
            title: selectedRobot.ugvName || "Robot",
          });
  
          robotMarker.addListener("click", () => {
            setSelectedCarNo(null); // Deselect on click
          });
  
          setMarkers([robotMarker]);
  
          // Add Mod2 coordinates to the map
          fetchMod2Coordinates(selectedCarNo).then((coordinates) => {
            const newMod2Markers = coordinates.map(([lat, lng]) => {
              const marker = new window.google.maps.Marker({
                position: { lat, lng },
                map: map,
                title: `Coordinate: ${lat}, ${lng}`,
              });
  
              marker.addListener("click", () => {
                const infoWindow = new window.google.maps.InfoWindow({
                  content: `
                    <div>
                      <p>Latitude: ${lat}</p>
                      <p>Longitude: ${lng}</p>
                    </div>
                  `,
                });
                infoWindow.open(map, marker);
              });
  
              return marker;
            });
  
            setMod2Markers(newMod2Markers);
          });
        }
      }
    }
  }, [map, robots, selectedCarNo]);
  

  useEffect(() => {
    const storedHeading = localStorage.getItem('heading');
    if (storedHeading) {
      // Use the storedHeading value here as needed
      console.log('Stored heading:', storedHeading);
    }
  }, []);

  return (
    <Card
      style={{
        margin: "20px",
        width: "87vh",
        height: "52vh",
      }}
      className="bg-sabGreenDark dark:bg-sabGreenHardDark rounded-3xl border-sabGreenDark dark:border-sabGreenHardDark"
    >
      <div id="advanced-marker-map" style={containerStyle}></div>
    </Card>
  );
};

export default GoogleMaps;