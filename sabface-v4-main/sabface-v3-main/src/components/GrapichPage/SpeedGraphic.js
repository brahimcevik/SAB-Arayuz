import React, { useEffect, useState } from "react";
import Graphic from "./Graphic";
import { useSelector } from "react-redux";
import { selectSelectedId } from "../../redux/ugvSlice";

function SpeedGraphic() {
  const [speedData, setSpeedData] = useState([]);
  const selectedId = useSelector(selectSelectedId);

  useEffect(() => {
    if (selectedId) {
      // Yeni robot seçildiğinde veriyi sıfırlayın
      setSpeedData([]);

      const fetchData = async () => {
        try {
          const response = await fetch(`https://localhost:44315/api/UgvRobot/${selectedId}`);
          if (!response.ok) throw new Error("API request failed");

          const data = await response.json();
          const newSpeedEntry = {
            date: new Date().toLocaleTimeString(),
            speed: data.ugvSpeed,
          };

          setSpeedData((prevData) => {
            const updatedData = [...prevData, newSpeedEntry];
            // Sadece 7 veri tutacak şekilde sınırlandır
            return updatedData.length > 7 ? updatedData.slice(1) : updatedData;
          });
        } catch (error) {
          console.error("Error fetching speed data:", error);
        }
      };

      fetchData();
      const intervalId = setInterval(fetchData, 10000);

      return () => clearInterval(intervalId);
    }
  }, [selectedId]);

  return (
    <Graphic
      weatherData={speedData}
      day="Hız Verileri"
      valueKey="speed"
      yAxisLabel="Hız (m/s)"
    />
  );
}

export default SpeedGraphic;
