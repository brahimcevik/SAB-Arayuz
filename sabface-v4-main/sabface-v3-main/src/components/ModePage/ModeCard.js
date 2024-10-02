import { Card } from "antd";
import { useState } from "react";
import CardRightCol from "./CardRightCol";
import CardLeftCol from "./CardLeftCol";

function ModeCard({ selectedCarNo }) {
  const [currentPage, setCurrentPage] = useState(null);

  const handleCardClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex justify-center items-start mt-5 space-x-4 ">
      {/* İlk Kart */}
      <Card
        className="bg-sabGreenDark dark:bg-sabGreenHardDark shadow-md rounded p-4 rounded-3xl dark:border-sabGreenHardDark"
        title={
          <h2 className="text-xl font-bold mb-4 text-white font-poppins text-center">
            Mod Seç
          </h2>
        }
      >
        <div
          className="flex space-x-4"
          style={{ height: "10vh", width: "40vh" }}
        >
          <div
            onClick={() => handleCardClick("CardLeftCol")}
            className="text-black dark:text-white text-center font-poppins dark:bg-sabDarkBG  p-2 rounded bg-white hover:bg-sabGreenLight dark:bg-sabDarkBlack dark:hover:bg-sabDarkLGray rounded-xl"
          >
            Mod 1 Karık Açma Modu
          </div>
          <div
            onClick={() => handleCardClick("CardRightCol")}
            className="text-black dark:text-white text-center font-poppins dark:bg-sabDarkBG  p-2 rounded bg-white hover:bg-sabGreenLight dark:bg-sabDarkBlack dark:hover:bg-sabDarkLGray rounded-xl"
          >
            Mod 2 Bitki Analiz Modu
          </div>
        </div>
      </Card>

      {/* İkinci Kart */}
      <Card
        className="bg-sabGreenDark dark:bg-sabGreenHardDark shadow-md rounded p-4 w-64 h-64 text-white font-poppins rounded-3xl overflow-y-auto dark:border-sabGreenHardDark"
        title={
          <h2 className="text-lg font-semibold mb-3 text-center text-white">
            Bilgileri Doldurun
          </h2>
        }
      >
        {currentPage === "CardRightCol" && <CardRightCol  selectedCarNo={selectedCarNo} />}
        {currentPage === "CardLeftCol" && (
          <CardLeftCol selectedCarNo={selectedCarNo} />
        )}
      </Card>
    </div>
  );
}

export default ModeCard;
