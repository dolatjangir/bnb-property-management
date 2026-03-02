import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from "recharts";
import { useDashboardData } from "../data/useDashboardSectionOne";
import { getAllContactFollowups } from "@/store/contactFollowups";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

// ── All original constants — UNCHANGED ────────────────────────────────────────
const COLORS = ["#F87171", "#0EA5E9", "#10B981", "#FBBF24", "#A855F7", "#3B82F6"];
const TOP_N = 5;

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, total }: any) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    const pct = ((entry.value / total) * 100).toFixed(1);
    return (
      <div style={{
        background: "rgba(0,10,4,0.92)",
        border: `1px solid ${entry.payload.fill}40`,
        borderRadius: 12,
        padding: "10px 16px",
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
        backdropFilter: "blur(8px)",
        minWidth: 150,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{
            width: 10, height: 10, borderRadius: "50%",
            background: entry.payload.fill, flexShrink: 0,
            boxShadow: `0 0 6px ${entry.payload.fill}80`,
          }} />
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>
            {entry.name}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ color: "#9CA3AF", fontSize: 12 }}>Count</span>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{entry.value}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginTop: 2 }}>
          <span style={{ color: "#9CA3AF", fontSize: 12 }}>Share</span>
          <span style={{ color: entry.payload.fill, fontSize: 12, fontWeight: 700 }}>{pct}%</span>
        </div>
      </div>
    );
  }
  return null;
};

// ── Custom Legend ─────────────────────────────────────────────────────────────
const CustomLegend = ({ payload, total }: any) => (
  <div style={{
    display: "flex", flexDirection: "column", gap: 8,
    padding: "0 4px", marginTop: 4,
    fontFamily: "'DM Sans', sans-serif",
  }}>
    {payload?.map((entry: any, i: number) => {
      const pct = total > 0 ? Math.round((entry.payload.value / total) * 100) : 0;
      return (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "7px 12px", borderRadius: 10,
          background: "transparent",
          transition: "background 0.18s",
        }}>
          {/* Color dot */}
          <span style={{
            width: 10, height: 10, borderRadius: "50%",
            background: entry.color, flexShrink: 0,
            boxShadow: `0 0 6px ${entry.color}60`,
          }} />
          {/* Name */}
          <span style={{
            flex: 1, fontSize: 12, fontWeight: 500,
            color: "var(--legend-text, #374151)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {entry.value}
          </span>
          {/* Mini bar */}
          <div style={{
            width: 60, height: 4, borderRadius: 99,
            background: "rgba(0,0,0,0.08)",
            overflow: "hidden", flexShrink: 0,
          }}>
            <div style={{
              height: "100%", width: `${pct}%`,
              background: entry.color, borderRadius: 99,
              transition: "width 0.8s ease",
            }} />
          </div>
          {/* Pct */}
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: entry.color, minWidth: 32, textAlign: "right",
          }}>
            {pct}%
          </span>
        </div>
      );
    })}
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
const DonutChart = () => {
  // ── All original state & logic — UNCHANGED ────────────────────────────────
  const { feedbackStats, setFeedbackStats } = useDashboardData();
  const [loading, setLoading] = useState(true);

  const fetchFeedbackStats = async () => {
    try {
      setLoading(true);
      const response = await getAllContactFollowups();
      if (!response || response.length === 0) {
        setFeedbackStats([]);
        setLoading(false);
        return;
      }
      const statusMap: Record<string, number> = {};
      response.forEach((item: any) => {
        const status = item.StatusType || "Unknown";
        if (!statusMap[status]) statusMap[status] = 0;
        statusMap[status] += 1;
      });
      let statsArray = Object.entries(statusMap).map(([name, value]) => ({ name, value }));
      statsArray = statsArray.sort((a, b) => b.value - a.value).slice(0, TOP_N);
      setFeedbackStats(statsArray);
    } catch (error) {
      console.error("Error fetching customer followups:", error);
      setFeedbackStats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeedbackStats(); }, []);

  const total = feedbackStats.reduce((sum, item) => sum + item.value, 0);

  // ── Original renderLabel — UNCHANGED ─────────────────────────────────────
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <foreignObject x={x - 18} y={y - 12} width={36} height={24} style={{ pointerEvents: "none" }}>
        <div style={{
          width: "100%", height: "100%", fontSize: "10px", fontWeight: "bold",
          color: "white", display: "flex", alignItems: "center", justifyContent: "center", padding: "2px",
        }}>
          {`${(percent * 100).toFixed(0)}%`}
        </div>
      </foreignObject>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes donut-rise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-in {
          from { opacity: 0; transform: rotate(-20deg) scale(0.85); }
          to   { opacity: 1; transform: rotate(0deg) scale(1); }
        }
        @keyframes shimmer-pulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0.45; }
        }
        .donut-card { animation: donut-rise 0.5s ease both; }
        .donut-chart-wrap { animation: spin-in 0.7s ease 0.2s both; }
        .skeleton-shimmer { animation: shimmer-pulse 1.4s ease infinite; }

        /* Dark mode legend text */
        .dark .legend-item-text { color: #E5E7EB !important; }
        .legend-item-text { color: #374151; }
      `}</style>

      <div
        className="donut-card w-full max-w-md mx-auto overflow-hidden rounded-2xl
          bg-white dark:bg-[#0d1f14]
          border border-[var(--color-primary-light)] dark:border-[#1a3a24]
          shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        "
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >

        {/* ── Header ── */}
        <div className="
          px-5 pt-5 pb-4
          border-b border-[var(--color-primary-light)] dark:border-[#1a3a24]
          bg-[var(--color-primary-lighter)] dark:bg-[#091510]
        ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Icon badge */}
              <div className="
                w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                shadow-md
              " style={{ background: "linear-gradient(135deg, #006838, #0B7A43)" }}>
                {/* Donut icon — SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2.5" fill="none" />
                  <circle cx="12" cy="12" r="4" fill="white" />
                  <path d="M12 3 A9 9 0 0 1 21 12" stroke="#6EE7B7" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-700 tracking-widest uppercase mb-0.5
                  text-[var(--color-primary)] dark:text-[#6EE7B7]
                ">
                  Contact Analytics
                </p>
                <h2 className="leading-tight
                  text-[var(--color-secondary-darker)] dark:text-white
                "
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700 }}
                >
                  Followup Status
                </h2>
              </div>
            </div>

            {/* Total pill */}
            {!loading && total > 0 && (
              <div className="
                flex flex-col items-center px-3 py-1.5 rounded-xl
                bg-white dark:bg-[#0d1f14]
                border border-[var(--color-primary-light)] dark:border-[#1a3a24]
                shadow-sm
              ">
                <span className="text-[18px] font-800 leading-none
                  text-[var(--color-secondary-darker)] dark:text-white
                "
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800 }}
                >
                  {total}
                </span>
                <span className="text-[10px] font-600 uppercase tracking-wide
                  text-[#9CA3AF] dark:text-[#6b7280]
                ">
                  Total
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Chart ── */}
        <div className="px-4 pt-4">
          {loading ? (
            /* Skeleton */
            <div className="py-6 flex flex-col items-center gap-4">
              <div className="skeleton-shimmer w-40 h-40 rounded-full
                bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24]
              " style={{ borderRadius: "50%" }} />
              <div className="w-full space-y-2.5 px-2">
                {[1,2,3].map(i => (
                  <div key={i} className="skeleton-shimmer flex items-center gap-3"
                    style={{ animationDelay: `${i * 150}ms` }}>
                    <div className="w-3 h-3 rounded-full bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24]" />
                    <div className="flex-1 h-3 rounded-full bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24]" />
                    <div className="w-10 h-3 rounded-full bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24]" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#9CA3AF] dark:text-[#6b7280]">
                Fetching StatusTypes…
              </p>
            </div>
          ) : feedbackStats.length === 0 ? (
            /* Empty state */
            <div className="py-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full border-4 border-dashed
                border-[var(--color-primary-light)] dark:border-[#1a3a24]
                flex items-center justify-center
              ">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" stroke="#9CA3AF" strokeWidth="2" fill="none" />
                  <circle cx="12" cy="12" r="3" fill="#9CA3AF" />
                </svg>
              </div>
              <p className="text-sm font-500 text-[#9CA3AF] dark:text-[#6b7280]">
                No followup data yet
              </p>
            </div>
          ) : (
            <div className="donut-chart-wrap">
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={feedbackStats}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="38%"
                    outerRadius="72%"
                    paddingAngle={3}
                    stroke="transparent"
                    strokeWidth={0}
                    label={renderLabel}
                    labelLine={false}
                  >
                    {feedbackStats.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                        style={{ filter: `drop-shadow(0 0 4px ${COLORS[index % COLORS.length]}60)` }}
                      />
                    ))}
                  </Pie>

                  <Tooltip<number, string>
                    content={<CustomTooltip total={total} />}
                  />

                  <Legend
                    content={({ payload }) => (
                      <CustomLegend payload={payload} total={total} />
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {!loading && feedbackStats.length > 0 && (
          <div className="
            mx-4 mb-4 mt-2 px-4 py-3 rounded-xl
            bg-[var(--color-primary-lighter)] dark:bg-[#091510]
            border border-[var(--color-primary-light)] dark:border-[#1a3a24]
            flex items-center justify-between
          ">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34D399]"
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.7)", animation: "shimmer-pulse 2s infinite" }}
              />
              <span className="text-[12px] font-600
                text-[var(--color-primary)] dark:text-[#6EE7B7]
              ">
                Top:{" "}
                <span className="font-700">{feedbackStats[0]?.name}</span>
              </span>
            </div>
            <span className="
              text-[11px] font-700 px-2.5 py-1 rounded-full
              bg-white dark:bg-[#0d1f14]
              border border-[var(--color-primary-light)] dark:border-[#1a3a24]
              text-[var(--color-primary)] dark:text-[#6EE7B7]
            ">
              Top {TOP_N} shown
            </span>
          </div>
        )}

      </div>
    </>
  );
};

export default DonutChart;