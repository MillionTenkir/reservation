"use client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Sector,
} from "recharts";
import { useState } from "react";

// Simple Pie Chart
interface SimplePieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  colors: string[];
  height?: number;
  title?: string;
}

// Update the renderActiveShape function to ensure it works properly
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${payload.name}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Value: ${value})`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={36}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate: ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

// Fix the SimplePieChart component to ensure it renders properly
export function SimplePieChart({
  data,
  colors,
  height = 300,
}: SimplePieChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}`, "Value"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Fix the DonutChart component
export function DonutChart({
  data,
  colors,
  height = 300,
  title,
}: SimplePieChartProps) {
  // Calculate total value
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            // Remove the label to avoid hover text
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          {/* Add total in center */}
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
            <tspan x="" dy="-20" fontSize="20" fontWeight="bold">
              {total}
            </tspan>
            <tspan x="50%" dy="25" fontSize="14" fontWeight="light">
              {title}
            </tspan>
          </text>
          {/* Add tooltip to show values on hover */}
          <Tooltip
            formatter={(value, name) => [
              `${value} (${((Number(value) / total) * 100).toFixed(1)}%)`,
              name,
            ]}
            contentStyle={{
              background: "rgba(255, 255, 255, 0.9)",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Fix the PaddedPieChart component
export function PaddedPieChart({
  data,
  colors,
  height = 300,
}: SimplePieChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}`, "Value"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Fix the InteractivePieChart component
export function InteractivePieChart({
  data,
  colors,
  height = 300,
}: SimplePieChartProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            onMouseEnter={onPieEnter}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Nested Pie Chart
interface NestedPieChartProps {
  outerData: Array<{
    name: string;
    value: number;
  }>;
  innerData: Array<{
    name: string;
    value: number;
  }>;
  outerColors: string[];
  innerColors: string[];
  height?: number;
}

export function NestedPieChart({
  outerData,
  innerData,
  outerColors,
  innerColors,
  height = 300,
}: NestedPieChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={outerData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {outerData.map((entry, index) => (
              <Cell
                key={`cell-outer-${index}`}
                fill={outerColors[index % outerColors.length]}
              />
            ))}
          </Pie>
          <Pie
            data={innerData}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={40}
            fill="#8884d8"
            dataKey="value"
          >
            {innerData.map((entry, index) => (
              <Cell
                key={`cell-inner-${index}`}
                fill={innerColors[index % innerColors.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}`, "Value"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Radial Bar Chart
interface RadialBarChartProps {
  data: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
  height?: number;
}

export function RadialBarChartComponent({
  data,
  height = 300,
}: RadialBarChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="30%"
            outerRadius="80%"
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, "Completion"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
