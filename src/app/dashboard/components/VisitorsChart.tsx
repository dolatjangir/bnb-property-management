"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdFullscreen } from "react-icons/md";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

// ── Types — UNCHANGED ──────────────────────────────────────────────────────────
interface ChartData {
  date: string;
  newVisitor: number;
  oldVisitor: number;
  lastMonth: number;
  avg: number;
  total?: number;
  avgScaled?: number;
}

interface ActiveIndicators {
  oldVisitor: boolean;
  newVisitor: boolean;
  lastMonth: boolean;
  avg: boolean;
}

interface IndicatorConfig {
  key: keyof ActiveIndicators;
  label: string;
  color: string;
  barColor?: string;
  lineColor?: string;
  value: string;
  change: string;
}

interface CustomLegendProps {
  activeIndicators: ActiveIndicators;
  toggleIndicator: (key: keyof ActiveIndicators) => void;
}

interface DotProps {
  cx?: number;
  cy?: number;
  index?: number;
  [key: string]: any;
}

// ── Data — UNCHANGED ──────────────────────────────────────────────────────────
const data: ChartData[] = [
  { date: "Jan 16", newVisitor: 70,  oldVisitor: 90,  lastMonth: 20, avg: 10 },
  { date: "",       newVisitor: 85,  oldVisitor: 68,  lastMonth: 78, avg: 82 },
  { date: "",       newVisitor: 75,  oldVisitor: 80,  lastMonth: 72, avg: 75 },
  { date: "Jan 25", newVisitor: 82,  oldVisitor: 65,  lastMonth: 79, avg: 80 },
  { date: "",       newVisitor: 88,  oldVisitor: 70,  lastMonth: 83, avg: 86 },
  { date: "",       newVisitor: 92,  oldVisitor: 74,  lastMonth: 85, avg: 89 },
  { date: "Jan 16", newVisitor: 90,  oldVisitor: 70,  lastMonth: 80, avg: 85 },
  { date: "",       newVisitor: 85,  oldVisitor: 68,  lastMonth: 78, avg: 82 },
  { date: "",       newVisitor: 75,  oldVisitor: 60,  lastMonth: 72, avg: 75 },
  { date: "Jan 25", newVisitor: 82,  oldVisitor: 65,  lastMonth: 79, avg: 80 },
  { date: "",       newVisitor: 88,  oldVisitor: 200, lastMonth: 83, avg: 86 },
  { date: "Jan 31", newVisitor: 92,  oldVisitor: 84,  lastMonth: 85, avg: 89 },
];

const chartData: ChartData[] = data.map((d) => ({
  ...d,
  total: d.newVisitor + d.oldVisitor,
  avgScaled: d.avg - 70,
}));

// ── Indicator config ──────────────────────────────────────────────────────────
const indicators: IndicatorConfig[] = [
  { key: "oldVisitor",  label: "Old Visitor",        color: "#fca5a5", barColor:  "#fca5a5", value: "12.4K", change: "+12%" },
  { key: "newVisitor",  label: "New Visitor",         color: "#dc2626", barColor:  "#dc2626", value: "8.2K",  change: "+8%"  },
  { key: "lastMonth",   label: "Last Month",          color: "#22c55e", lineColor: "#22c55e", value: "15.7K", change: "+15%" },
  { key: "avg",         label: "Avg Visitor",         color: "#f59e0b", lineColor: "#f59e0b", value: "10.2K", change: "+5%"  },
];

// ── Custom Legend — restyled, props UNCHANGED ─────────────────────────────────
const CustomLegend: React.FC<CustomLegendProps> = ({ activeIndicators, toggleIndicator }) => (
  <div className="flex flex-wrap gap-2 mb-6">
    {indicators.map((ind) => {
      const active = activeIndicators[ind.key];
      return (
        <button
          key={ind.key}
          onClick={() => toggleIndicator(ind.key)}
          className={`
            group flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-sm font-semibold
            border transition-all duration-200 select-none cursor-pointer
            ${active
              ? "border-transparent shadow-sm scale-[1.02]"
              : "border-gray-200 dark:border-[#1a3a24] opacity-55 hover:opacity-80"
            }
          `}
          style={active
            ? { background: ind.color + "18", borderColor: ind.color + "40", color: ind.color }
            : undefined
          }
        >
          {/* Swatch */}
          <span
            className="flex-shrink-0 rounded"
            style={{
              width: 22,
              height: 10,
              background: ind.barColor ?? "transparent",
              border: ind.lineColor ? `2.5px solid ${ind.lineColor}` : "none",
              borderRadius: ind.lineColor ? 4 : 3,
            }}
          />
          <span className={active ? "" : "text-gray-500 dark:text-gray-400"}>{ind.label}</span>

          {/* Value chip */}
          {/* {active && (
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: ind.color + "25", color: ind.color }}
            >
              {ind.value}
            </span>
          )} */}

          {/* Check / circle */}
          <span className="text-xs ml-auto"
            style={{ color: active ? ind.color : "#9CA3AF" }}
          >
            {active ? "✓" : "○"}
          </span>
        </button>
      );
    })}
  </div>
);

// ── Custom Dot — UNCHANGED ────────────────────────────────────────────────────
const CustomDot: React.FC<DotProps> = (props) => {
  const { cx, cy, stroke, strokeWidth = 2 } = props;
  if (cx == null || cy == null) return null;
  return (
    <circle cx={cx} cy={cy} r={4} fill="#fff" stroke={stroke} strokeWidth={strokeWidth} />
  );
};

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl shadow-xl border text-sm font-medium"
      style={{
        background: "rgba(255,255,255,0.97)",
        border: "1px solid var(--color-primary-light, #D1F2E1)",
        padding: "12px 16px",
        minWidth: 160,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <p className="text-xs font-bold mb-2 text-gray-500 uppercase tracking-widest">{label || "—"}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-gray-600 text-xs">{p.name}</span>
          </div>
          <span className="font-bold text-gray-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ── Stat mini-card ─────────────────────────────────────────────────────────────
const StatChip = ({ ind }: { ind: IndicatorConfig }) => (
  <div
    className="flex flex-col gap-0.5 px-4 py-3 rounded-xl border"
    style={{
      background: ind.color + "0d",
      borderColor: ind.color + "30",
    }}
  >
    <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: ind.color + "bb" }}>
      {ind.label}
    </span>
    <div className="flex items-end gap-1.5">
      <span className="text-xl font-bold" style={{ color: ind.color, fontFamily: "'Playfair Display', serif" }}>
        {ind.value}
      </span>
      <span className="flex items-center gap-0.5 text-xs font-bold mb-0.5" style={{ color: "#22c55e" }}>
        <FaArrowTrendUp size={10} /> {ind.change}
      </span>
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
export default function VisitorsChart() {
  // ── All original state — UNCHANGED ────────────────────────────────────────
  const [activeIndicators, setActiveIndicators] = useState<ActiveIndicators>({
    oldVisitor: true,
    newVisitor: true,
    lastMonth: true,
    avg: true,
  });

  const toggleIndicator = (indicatorKey: keyof ActiveIndicators) => {
    setActiveIndicators((prev) => {
      const activeCount = Object.values(prev).filter(Boolean).length;
      if (activeCount === 1 && prev[indicatorKey]) return prev;
      return { ...prev, [indicatorKey]: !prev[indicatorKey] };
    });
  };

  const hasActiveIndicators = Object.values(activeIndicators).some(Boolean);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
        .visitors-chart * { font-family: 'DM Sans', sans-serif; }
        .visitors-chart .recharts-cartesian-grid-horizontal line,
        .visitors-chart .recharts-cartesian-grid-vertical line {
          stroke: rgba(0,104,56,0.08);
        }
        @keyframes chart-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .chart-fade { animation: chart-fade-in 0.4s ease both; }
      `}</style>

      <div className="
        visitors-chart chart-fade
        w-full max-w-4xl rounded-2xl overflow-hidden
        bg-white dark:bg-[#0d1f14]
        border border-[var(--color-primary-light)] dark:border-[#1a3a24]
        shadow-sm hover:shadow-md dark:hover:shadow-[0_8px_32px_rgba(0,104,56,0.2)]
        transition-shadow duration-300
      ">

        {/* ── Card Header ── */}
        <div className="
          flex items-center justify-between gap-4 flex-wrap
          px-6 py-4
          border-b border-[var(--color-primary-light)] dark:border-[#1a3a24]
          bg-[var(--color-primary-lighter)] dark:bg-[#0a1a0e]
        ">
          {/* Left: title */}
          <div className="flex items-center gap-3">
            <span className="
              w-1 h-8 rounded-full flex-shrink-0
              bg-gradient-to-b from-[var(--color-primary)] to-[#34D399]
            " />
            <div>
              <h2
                className="text-lg font-bold leading-none text-[var(--color-secondary-darker)] dark:text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Visitor Analytics
              </h2>
              <p className="text-xs mt-1 text-gray-500 dark:text-[#6EE7B7] font-medium">
                Jan 16 – Jan 31 · All properties
              </p>
            </div>
          </div>

          {/* Right: Reset + icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveIndicators({ oldVisitor: true, newVisitor: true, lastMonth: true, avg: true })}
              className="
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                text-white cursor-pointer
                bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary-darker)]
                hover:from-[var(--color-primary-darker)] hover:to-[var(--color-secondary-dark)]
                shadow-sm hover:shadow-md transition-all duration-200
              "
            >
              All Visitors
            </button>

            <button className="
              w-9 h-9 rounded-xl flex items-center justify-center text-base
              bg-white dark:bg-[#0d1f14]
              border border-[var(--color-primary-light)] dark:border-[#1a3a24]
              text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-[#6EE7B7]
              transition-colors duration-200 cursor-pointer
            ">
              <MdFullscreen />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="p-6">

          {/* Stat mini cards row */}
          {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {indicators.map((ind) => (
              activeIndicators[ind.key] && <StatChip key={ind.key} ind={ind} />
            ))}
          </div> */}

          {/* Interactive legend */}
          <CustomLegend activeIndicators={activeIndicators} toggleIndicator={toggleIndicator} />

          {/* ── Chart area ── */}
          <div className="relative">
            {/* Y-axis left label */}
            <span className="
              absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[62%]
              text-xs font-semibold text-gray-400 dark:text-[#6EE7B7]
              rotate-[-90deg] whitespace-nowrap tracking-wider uppercase
            ">
              All Visitors
            </span>

            <div className="h-[280px] w-full pl-4 pr-8">
              {hasActiveIndicators ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 16, right: 20, left: 8, bottom: 12 }}
                    barGap={-19}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    />
                    <YAxis
                      domain={[0, 180]}
                      tickFormatter={(v) => `${(v / 20).toFixed(1)}M`}
                      tick={{ fontSize: 11, fill: "#9CA3AF" }}
                      axisLine={false}
                      tickLine={false}
                      width={42}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,104,56,0.04)", radius: 6 }} />

                    {activeIndicators.oldVisitor && (
                      <Bar dataKey="oldVisitor" fill="#fca5a5" barSize={24} name="Old Visitor" radius={[4, 4, 0, 0]} />
                    )}
                    {activeIndicators.newVisitor && (
                      <Bar dataKey="newVisitor" fill="#dc2626" barSize={16} name="New Visitor" radius={[4, 4, 0, 0]} />
                    )}
                    {activeIndicators.lastMonth && (
                      <Line
                        type="monotone"
                        dataKey="lastMonth"
                        stroke="#22c55e"
                        strokeWidth={2.5}
                        dot={<CustomDot stroke="#22c55e" />}
                        activeDot={{ r: 6, fill: "#22c55e", strokeWidth: 2, stroke: "#fff" }}
                        name="Last Month Visitor"
                      />
                    )}
                    {activeIndicators.avg && (
                      <Line
                        type="monotone"
                        dataKey="avg"
                        stroke="#f59e0b"
                        strokeWidth={2.5}
                        strokeDasharray="5 5"
                        dot={<CustomDot stroke="#f59e0b" />}
                        activeDot={{ r: 6, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
                        name="Avg Visitor"
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="
                  h-full flex flex-col items-center justify-center gap-3
                  border-2 border-dashed rounded-xl
                  border-[var(--color-primary-light)] dark:border-[#1a3a24]
                  bg-[var(--color-primary-lighter)] dark:bg-[#0a1a0e]
                ">
                  <div className="
                    w-12 h-12 rounded-2xl flex items-center justify-center text-2xl
                    bg-white dark:bg-[#0d1f14]
                    border border-[var(--color-primary-light)] dark:border-[#1a3a24]
                    shadow-sm
                  ">
                    📊
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400">No indicators selected</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      Click an indicator above to show data
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Y-axis right label */}
            <span className="
              absolute right-0 top-1/2 -translate-y-1/2 translate-x-[62%]
              text-xs font-semibold text-gray-400 dark:text-[#6EE7B7]
              rotate-[-90deg] whitespace-nowrap tracking-wider uppercase
            ">
              New Visitors
            </span>
          </div>

        </div>

        {/* ── Card Footer ── */}
        <div className="
          flex items-center justify-between px-6 py-3
          border-t border-[var(--color-primary-light)] dark:border-[#1a3a24]
          bg-[var(--color-primary-lighter)] dark:bg-[#0a1a0e]
        ">
          <p className="text-xs text-gray-400 dark:text-[#6EE7B7] font-medium">
            {Object.values(activeIndicators).filter(Boolean).length} of {indicators.length} indicators active
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent,#34D399)] animate-pulse shadow-[0_0_4px_rgba(52,211,153,0.7)]" />
            <span className="text-xs text-gray-400 dark:text-[#6EE7B7] font-medium">Live data</span>
          </div>
        </div>

      </div>
    </>
  );
}