import React, { useEffect, useState } from "react";
import Graphic from "./Graphic";
import { useSelector } from "react-redux";
import { selectSelectedId } from "../../redux/ugvSlice";

function DistanceGraphic() {
  const [distanceData, setDistanceData] = useState([]);
  const selectedId = useSelector(selectSelectedId);

  useEffect(() => {
    if (selectedId) {
      // Yeni robot seçildiğinde veriyi sıfırlayın
      setDistanceData([]);

      const fetchData = async () => {
        try {
          const response = await fetch(`https://localhost:44315/api/UgvRobot/${selectedId}`);
          if (!response.ok) throw new Error("API request failed");

          const data = await response.json();
          const newDistanceEntry = {
            date: new Date().toLocaleTimeString(),
            distance: data.ugvDistance,
          };

          setDistanceData((prevData) => {
            const updatedData = [...prevData, newDistanceEntry];
            // Sadece 7 veri tutacak şekilde sınırlandır
            return updatedData.length > 7 ? updatedData.slice(1) : updatedData;
          });
        } catch (error) {
          console.error("Error fetching distance data:", error);
        }
      };

      fetchData();
      const intervalId = setInterval(fetchData, 10000);

      return () => clearInterval(intervalId);
    }
  }, [selectedId]);

  return (
    <Graphic
      weatherData={distanceData}
      day="Mesafe Verileri"
      valueKey="distance"
      yAxisLabel="Mesafe (m)"
    />
  );
}

export default DistanceGraphic;
