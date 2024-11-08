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

function Graphic({ weatherData, day, valueKey, yAxisLabel }) {
  return (
    <div>
      <Card
        bordered={false}
        className="bg-sabGreenDark dark:bg-sabGreenHardDark rounded-3xl border-sabGreenDark dark:border-sabGreenHardDark"
        style={{ width: "80vh", height: "38vh" }}
        title={`${day}`}
      >
        <Flex justify="center" align="center" vertical={true} width={800}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weatherData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={valueKey}
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Flex>
      </Card>
    </div>
  );
}

export default Graphic;
