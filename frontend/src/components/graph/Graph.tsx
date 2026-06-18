import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export type GraphType = "line" | "bar" | "pie" | "radar" | "area";

type GraphProps = {
  type: GraphType;
  data: any[];
  xKey?: string;
  yKey?: string;
  nameKey?: string;
};

const COLOR = "#4f75ff";
const GRID = "#e5e7eb";
const TEXT = "#6b7280";

export const Graph = ({
  type,
  data,
  xKey = "name",
  yKey = "value",
  nameKey = "name",
}: GraphProps) => {
  const tooltipStyle = {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    color: "#111",
  };

  switch (type) {
    case "line":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid stroke={GRID} />
            <XAxis dataKey={xKey} tick={{ fill: TEXT }} />
            <YAxis tick={{ fill: TEXT }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke={COLOR}
              strokeWidth={2}
              dot={{ r: 3, fill: COLOR }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case "bar":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid stroke={GRID} />
            <XAxis dataKey={xKey} tick={{ fill: TEXT }} />
            <YAxis tick={{ fill: TEXT }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Bar dataKey={yKey} fill={COLOR} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    case "area":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid stroke={GRID} />
            <XAxis dataKey={xKey} tick={{ fill: TEXT }} />
            <YAxis tick={{ fill: TEXT }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Area
              type="monotone"
              dataKey={yKey}
              stroke={COLOR}
              fill="rgba(79, 117, 255, 0.2)"
            />
          </AreaChart>
        </ResponsiveContainer>
      );

    case "pie":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Pie data={data} dataKey={yKey} nameKey={nameKey} fill={COLOR} />
          </PieChart>
        </ResponsiveContainer>
      );

    case "radar":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid stroke={GRID} />
            <PolarAngleAxis dataKey={nameKey} tick={{ fill: TEXT }} />
            <PolarRadiusAxis tick={{ fill: TEXT }} />
            <Radar dataKey={yKey} stroke={COLOR} fill="rgba(79, 117, 255, 0.3)" />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      );

    default:
      return null;
  }
};