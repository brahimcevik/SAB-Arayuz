import React from "react";
import { Card, Flex } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Graphic({ weatherData, day }) {
  return (
    <div>
      <Card
        bordered={false}
        className="bg-sabGreenDark dark:bg-sabGreenHardDark rounded-3xl border-sabGreenDark dark:border-sabGreenHardDark  "
        style={{ width: "80vh", height: "38vh" }}
        title={`Hava Durumu Detayları - ${day}`}
      >
        <Flex justify="center" align="center" vertical={true} width={800}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weatherData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  new Intl.DateTimeFormat("tr-TR", {
                    hour: "numeric",
                  }).format(new Date(date))
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) =>
                  new Intl.DateTimeFormat("tr-TR", {
                    hour: "numeric",
                  }).format(new Date(date))
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Nem (%)"
              />
              <Line
                type="monotone"
                dataKey="windSpeed"
                stroke="#82ca9d"
                name="Rüzgar Hızı (m/s)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Flex>
      </Card>
    </div>
  );
}

export default Graphic;
