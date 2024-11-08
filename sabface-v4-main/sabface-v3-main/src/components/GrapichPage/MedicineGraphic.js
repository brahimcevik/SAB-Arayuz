import React, { useEffect, useState } from "react";
import Graphic from "./Graphic";
import { useSelector } from "react-redux";
import { selectSelectedId } from "../../redux/ugvSlice";

function MedicineGraphic() {
  const [medicineData, setMedicineData] = useState([]);
  const selectedId = useSelector(selectSelectedId);

  useEffect(() => {
    if (selectedId) {
      // Yeni robot seçildiğinde veriyi sıfırlayın
      setMedicineData([]);

      const fetchData = async () => {
        try {
          const response = await fetch(`https://localhost:44315/api/UgvRobot/${selectedId}`);
          if (!response.ok) throw new Error("API request failed");

          const data = await response.json();
          const newMedicineEntry = {
            date: new Date().toLocaleTimeString(),
            medicine: data.ugvHerbicide,
          };

          setMedicineData((prevData) => {
            const updatedData = [...prevData, newMedicineEntry];
            // Sadece 7 veri tutacak şekilde sınırlandır
            return updatedData.length > 7 ? updatedData.slice(1) : updatedData;
          });
        } catch (error) {
          console.error("Error fetching medicine data:", error);
        }
      };

      fetchData();
      const intervalId = setInterval(fetchData, 10000);

      return () => clearInterval(intervalId);
    }
  }, [selectedId]);

  return (
    <Graphic
      weatherData={medicineData}
      day="İlaç Verileri"
      valueKey="medicine"
      yAxisLabel="İlaç (%)"
    />
  );
}

export default MedicineGraphic;
