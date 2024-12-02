import { Input, Button } from "antd";
import { useState } from "react";

const CardRightCol = ({ setCoordinates, selectedCarNo }) => {
  const [count, setCount] = useState(0);
  const [localCoordinates, setLocalCoordinates] = useState([]);


  const handleCoordinateCountChange = (e) => {
    const newCount = parseInt(e.target.value, 10) || 0;
    setCount(newCount);
    const newCoordinates = Array.from({ length: newCount }, (_, index) => ({
      latitude: "",
      longitude: "",
      id: index + 1,
    }));
    setLocalCoordinates(newCoordinates);
  };

  const handleCoordinateChange = (index, field, value) => {
    const updatedCoordinates = [...localCoordinates];
    updatedCoordinates[index][field] = value;
    setLocalCoordinates(updatedCoordinates);
  };

  const handleSubmit = async () => {
    // Koordinat verilerini JSON formatına dönüştür
    const mod2Data = localCoordinates.map(coord => [
      parseFloat(coord.latitude),
      parseFloat(coord.longitude)
    ]);
    const validCoordinates = localCoordinates.filter(
      (coord) =>
        !isNaN(parseFloat(coord.latitude)) &&
        !isNaN(parseFloat(coord.longitude))
    );
  
    setCoordinates(validCoordinates);

    // İstek verisini oluştur
    const requestData = {
      siraUzunlugu: 0, // Eğer bu veriyi formdan alıyorsanız, burayı uygun şekilde değiştirin
      ikiSiraArasiMesafe: 0, // Aynı şekilde burayı da değiştirin
      toplamSiraSayisi: 0, // Aynı şekilde burayı da değiştirin
      donusDerecesi: 0, // Aynı şekilde burayı da değiştirin
      ilkDonusAcisi: "Sol", // Aynı şekilde burayı da değiştirin
      mod2: JSON.stringify(mod2Data),
    };

    try {
      const response = await fetch(`https://localhost:44315/api/UgvRobot/update-mod2/${selectedCarNo}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("İstek başarısız:", errorText);
      } else {
        const result = await response.json();
        console.log("Başarılı:", result);
      }
    } catch (error) {
      console.error("Hata:", error);
    }

    // Formu temizle
    setCount(0);
    setCoordinates([]);
  };
  
  

  return (
    <div>
      <Input
        type="number"
        min={0}
        placeholder="Koordinat sayısı"
        className="dark:bg-sabDarkBlack p-2 border border-gray-300 rounded text-black dark:text-white mb-4"
        onChange={handleCoordinateCountChange}
      />
      {localCoordinates.map((coordinate, index) => (
        <div key={index} className="flex space-x-2 mb-4">
          <Input
            type="text"
            placeholder={`${coordinate.id}. Enlem`}
            className="dark:bg-sabDarkBlack p-2 border border-gray-300 rounded w-24"
            value={coordinate.latitude}
            onChange={(e) =>
              handleCoordinateChange(index, "latitude", e.target.value)
            }
          />
          <Input
            type="text"
            placeholder={`${coordinate.id}. Boylam`}
            className="dark:bg-sabDarkBlack p-2 border border-gray-300 rounded w-24"
            value={coordinate.longitude}
            onChange={(e) =>
              handleCoordinateChange(index, "longitude", e.target.value)
            }
          />
        </div>
      ))}
      <div className="flex justify-center">
        <Button
          type="primary"
          onClick={handleSubmit}
          className="w-full font-poppins"
        >
          Gönder
        </Button>
      </div>
    </div>
  );
};

export default CardRightCol;
