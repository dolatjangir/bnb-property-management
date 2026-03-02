"use client";

import { useState, useEffect, useRef } from "react";
import { useDashboardData } from "../data/useDashboardSectionOne";
import { getProperty, getFilteredProperty } from "@/store/property";

// ── Types — UNCHANGED ──────────────────────────────────────────────────────────
interface User {
  id: number;
  name: string;
  customers: number;
}
interface UserData {
  users: User[];
}

// ── Custom ChevronDown — UNCHANGED ─────────────────────────────────────────────
const ChevronDown = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default function RadarChart() {
  // ── All original state — UNCHANGED ────────────────────────────────────────
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [animatedSpeed, setAnimatedSpeed] = useState(0);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, value: 0 });
  const [dropdownDirection, setDropdownDirection] = useState<'bottom' | 'top'>('bottom');
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const { userCustomers, setUserCustomers } = useDashboardData();
  const [selectedUser, setSelectedUser] = useState(userCustomers.users[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const [customerCount, setCustomerCount] = useState(0);

  // ── All original useEffects & handlers — UNCHANGED ────────────────────────
  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById("chart-container");
      if (container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const width = Math.min(containerWidth, 800);
        const height = Math.min(containerHeight * 0.9, width * 0.75);
        setDimensions({ width, height });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    const container = document.getElementById("chart-container");
    if (container) {
      const resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(container);
      return () => { resizeObserver.disconnect(); window.removeEventListener("resize", updateDimensions); };
    }
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const calculateDropdownPosition = () => {
    if (!dropdownButtonRef.current) return 'bottom';
    const buttonRect = dropdownButtonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    const estimatedDropdownHeight = 240;
    if (spaceBelow < estimatedDropdownHeight && spaceAbove >= estimatedDropdownHeight) return 'top';
    return 'bottom';
  };

  const handleDropdownToggle = () => {
    if (!isDropdownOpen) {
      const direction = calculateDropdownPosition();
      setDropdownDirection(direction);
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        dropdownButtonRef.current && !dropdownButtonRef.current.contains(event.target as Node)
      ) setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setAnimatedSpeed(0);
    const targetSpeed = selectedUser?.customers || 0;
    const duration = 1500;
    const steps = 60;
    const increment = targetSpeed / steps;
    const stepDuration = duration / steps;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) { setAnimatedSpeed(targetSpeed); clearInterval(timer); }
      else setAnimatedSpeed(Math.round(increment * currentStep));
    }, stepDuration);
    return () => clearInterval(timer);
  }, [selectedUser]);

  // ── All original helpers — UNCHANGED ─────────────────────────────────────
  const getZoneColor = (speed: number): string => {
    if (speed <= 90) return "#22c55e";
    if (speed <= 210) return "#9ca3af";
    return "#ef4444";
  };
  const getZoneLabel = (speed: number): string => {
    if (speed <= 90) return "Safe";
    if (speed <= 210) return "Normal";
    return "High";
  };
  const calculateNeedleAngle = (speed: number): number => {
    const normalizedSpeed = Math.min(Math.max(speed, 0), 300);
    return -135 + (normalizedSpeed / 300) * 270;
  };
  const polarToCartesian = (cx: number, cy: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return { x: cx + radius * Math.cos(angleInRadians), y: cy + radius * Math.sin(angleInRadians) };
  };
  const createArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number, innerRadius: number): string => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const innerStart = polarToCartesian(x, y, innerRadius, endAngle);
    const innerEnd = polarToCartesian(x, y, innerRadius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} L ${innerEnd.x} ${innerEnd.y} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerStart.x} ${innerStart.y} Z`;
  };
  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX; pt.y = event.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    setTooltip({ show: true, x: svgP.x, y: svgP.y, value: animatedSpeed });
  };
  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, value: 0 });
    setHoveredZone(null);
  };
  const handleZoneHover = (zone: string) => setHoveredZone(zone);
  const handleZoneLeave = () => setHoveredZone(null);

  const centerX = dimensions.width / 2;
  const centerY = (dimensions.height - 80) / 2 + 20;
  const outerRadius = Math.min(centerX, centerY) * 0.8;
  const innerRadius = outerRadius * 0.6;
  const needleLength = outerRadius * 0.85;
  const needleAngle = calculateNeedleAngle(animatedSpeed);

  const getUsers = async () => {
    const response = await getProperty();
    setCustomerCount(response.length);
    const users = response.filter((item: any) => item.AssignTo && item.AssignTo !== "");
    return users;
  };

  const RedarChartDataFetch = async () => {
    try {
      const allCustomers = await getUsers();
      if (!allCustomers || allCustomers.length === 0) { setUserCustomers({ users: [] }); return; }
      const userMap: Record<string, { id: string; name: string; customers: number }> = {};
      allCustomers.forEach((customer: any) => {
        const userName = customer.AssignTo?.name;
        const userId = customer.AssignTo?._id;
        if (!userName || !userId) return;
        if (!userMap[userId]) userMap[userId] = { id: userId, name: userName, customers: 0 };
        userMap[userId].customers += 1;
      });
      const customerLength = await getProperty();
      const totalCustomers = customerLength.length;
      const result = Object.values(userMap).map(user => ({
        ...user,
        percentage: totalCustomers > 0 ? Math.round((user.customers / totalCustomers) * 100) : 0
      }));
      setUserCustomers({ users: result });
      setSelectedUser(result[0] || null);
    } catch (error) {
      console.error("Error fetching radar chart data:", error);
    }
  };

  useEffect(() => { RedarChartDataFetch(); }, []);

  // ── Zone config for legend ─────────────────────────────────────────────────
  const zones = [
    { label: "Low", range: "0–90", color: "#22c55e", key: "green" },
    { label: "Normal", range: "91–210", color: "#9ca3af", key: "gray" },
    { label: "High", range: "211–300", color: "#ef4444", key: "red" },
  ];

  const pct = selectedUser?.percentage ?? Math.round((animatedSpeed / 300) * 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes gauge-rise {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes needle-pulse {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(59,130,246,0.4)); }
          50%       { filter: drop-shadow(0 0 10px rgba(59,130,246,0.8)); }
        }
        @keyframes zone-glow {
          0%, 100% { opacity: 0.9; }
          50%       { opacity: 1; }
        }
        .gauge-card { animation: gauge-rise 0.5s ease both; font-family: 'DM Sans', sans-serif; }
        .needle-glow { animation: needle-pulse 2.5s ease infinite; }
        .loc-scroll::-webkit-scrollbar { width: 3px; }
        .loc-scroll::-webkit-scrollbar-track { background: transparent; }
        .loc-scroll::-webkit-scrollbar-thumb { background: rgba(0,104,56,0.2); border-radius: 4px; }
      `}</style>

      <div className="gauge-card flex flex-col w-full h-auto min-h-[350px]">
        <div className="
          w-full h-full flex flex-col overflow-hidden rounded-2xl
          bg-white dark:bg-[#0d1f14]
          border border-[var(--color-primary-light)] dark:border-[#1a3a24]
          shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        ">

          {/* ── Header ── */}
          <div className="
            flex items-center justify-between px-5 pt-5 pb-4 flex-shrink-0
            border-b border-[var(--color-primary-light)] dark:border-[#1a3a24]
            bg-[var(--color-primary-lighter)] dark:bg-[#091510]
          ">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className="
                w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md
              " style={{ background: "linear-gradient(135deg, #006838, #0B7A43)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 12L7 7" stroke="#6EE7B7" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="2" fill="white"/>
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-700 tracking-widest uppercase mb-0.5
                  text-[var(--color-primary)] dark:text-[#6EE7B7]
                ">
                  Agent Performance
                </p>
                <h2 className="leading-tight
                  text-[var(--color-secondary-darker)] dark:text-white
                "
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700 }}
                >
                  Assignment Gauge
                </h2>
              </div>
            </div>

            {/* Zone label badge */}
            <div className="flex flex-col items-end gap-1">
              <div className="
                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-700
                border shadow-sm
              " style={{
                background: getZoneColor(animatedSpeed) + "18",
                borderColor: getZoneColor(animatedSpeed) + "40",
                color: getZoneColor(animatedSpeed),
              }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: getZoneColor(animatedSpeed) }} />
                {getZoneLabel(animatedSpeed)}
              </div>
              <span className="text-[10px] font-500
                text-[#9CA3AF] dark:text-[#6b7280]
              ">
                {customerCount} total
              </span>
            </div>
          </div>

          {/* ── Chart body ── */}
          <div id="chart-container" className="w-full flex flex-col flex-1 min-h-0 px-4 pt-2 pb-2">
            <div className="flex-1 min-h-0" style={{ minHeight: 220 }}>
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                className="overflow-visible"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                preserveAspectRatio="xMidYMid meet"
              >
                {/* ── Defs ── */}
                <defs>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                    <feOffset dx="0" dy="2" result="offsetblur" />
                    <feComponentTransfer><feFuncA type="linear" slope="0.3" /></feComponentTransfer>
                    <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="needle-glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <radialGradient id="center-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1e40af" />
                    <stop offset="100%" stopColor="#1e3a8a" />
                  </radialGradient>
                </defs>

                {/* ── Zone arcs — UNCHANGED logic ── */}
                <path
                  d={createArc(centerX, centerY, outerRadius, -135, -45, innerRadius)}
                  fill="#22c55e"
                  opacity={hoveredZone === 'green' ? "1" : "0.85"}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => handleZoneHover('green')}
                  onMouseLeave={handleZoneLeave}
                  style={{ filter: hoveredZone === 'green' ? 'drop-shadow(0 0 8px rgba(34,197,94,0.6))' : 'none' }}
                />
                <path
                  d={createArc(centerX, centerY, outerRadius, -45, 45, innerRadius)}
                  fill="#9ca3af"
                  opacity={hoveredZone === 'gray' ? "1" : "0.75"}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => handleZoneHover('gray')}
                  onMouseLeave={handleZoneLeave}
                  style={{ filter: hoveredZone === 'gray' ? 'drop-shadow(0 0 8px rgba(156,163,175,0.6))' : 'none' }}
                />
                <path
                  d={createArc(centerX, centerY, outerRadius, 45, 135, innerRadius)}
                  fill="#ef4444"
                  opacity={hoveredZone === 'red' ? "1" : "0.85"}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => handleZoneHover('red')}
                  onMouseLeave={handleZoneLeave}
                  style={{ filter: hoveredZone === 'red' ? 'drop-shadow(0 0 8px rgba(239,68,68,0.6))' : 'none' }}
                />

                {/* ── Scale markers — UNCHANGED logic ── */}
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => {
                  const angle = -135 + (value / 300) * 810;
                  const tickRadius = outerRadius + 14;
                  const point = polarToCartesian(centerX, centerY, tickRadius, angle);
                  const labelPoint = polarToCartesian(centerX, centerY, tickRadius + 22, angle);
                  return (
                    <g key={value}>
                      <line
                        x1={centerX} y1={centerY}
                        x2={point.x} y2={point.y}
                        stroke="rgba(209,213,219,0.4)"
                        strokeWidth="1"
                      />
                      <text
                        x={labelPoint.x}
                        y={labelPoint.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: 11, fontWeight: 600, fill: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {value}%
                      </text>
                    </g>
                  );
                })}

                {/* ── Needle — UNCHANGED logic, enhanced visuals ── */}
                <g className="needle-glow">
                  {(() => {
                    const needleEnd = polarToCartesian(centerX, centerY, needleLength, needleAngle);
                    const needleBase1 = polarToCartesian(centerX, centerY, 8, needleAngle + 90);
                    const needleBase2 = polarToCartesian(centerX, centerY, 8, needleAngle - 90);
                    return (
                      <>
                        {Number.isFinite(needleEnd.x) && Number.isFinite(needleEnd.y) &&
                          Number.isFinite(needleBase1.x) && Number.isFinite(needleBase1.y) &&
                          Number.isFinite(needleBase2.x) && Number.isFinite(needleBase2.y) && (
                            <polygon
                              points={`${needleEnd.x},${needleEnd.y} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}`}
                              fill="#3b82f6"
                              filter="url(#needle-glow)"
                            />
                          )}
                        {/* Center hub */}
                        <circle cx={centerX} cy={centerY} r="16" fill="url(#center-grad)" filter="url(#shadow)" />
                        <circle cx={centerX} cy={centerY} r="8" fill="#60a5fa" opacity="0.6" />
                      </>
                    );
                  })()}
                </g>

                {/* ── Value display ── */}
                {Number.isFinite(animatedSpeed) && (
                  <g>
                    {/* Value text */}
                    <text
                      x={centerX}
                      y={centerY + outerRadius + 28}
                      textAnchor="middle"
                      style={{
                        fontSize: 28,
                        fontWeight: 800,
                        fill: getZoneColor(animatedSpeed),
                        fontFamily: "'Playfair Display', serif",
                        filter: `drop-shadow(0 0 6px ${getZoneColor(animatedSpeed)}60)`,
                      }}
                    >
                      {animatedSpeed}
                    </text>
                    <text
                      x={centerX}
                      y={centerY + outerRadius + 50}
                      textAnchor="middle"
                      style={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
                    >
                      assigned properties
                    </text>
                  </g>
                )}

                {/* ── Tooltip — UNCHANGED logic, restyled ── */}
                {tooltip.show && (
                  <g>
                    <rect
                      x={tooltip.x - 70} y={tooltip.y - 60}
                      width="140" height="52"
                      rx="10"
                      fill="rgba(0,8,3,0.92)"
                      stroke="rgba(52,211,153,0.3)"
                      strokeWidth="1"
                    />
                    <text x={tooltip.x} y={tooltip.y - 44} textAnchor="middle"
                      style={{ fontSize: 11, fill: "#6EE7B7", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: 1 }}>
                      ASSIGNED
                    </text>
                    <text x={tooltip.x} y={tooltip.y - 26} textAnchor="middle"
                      style={{ fontSize: 14, fill: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                      {animatedSpeed} / {customerCount}
                    </text>
                    <polygon
                      points={`${tooltip.x - 8},${tooltip.y - 8} ${tooltip.x + 8},${tooltip.y - 8} ${tooltip.x},${tooltip.y + 6}`}
                      fill="rgba(0,8,3,0.92)"
                    />
                  </g>
                )}
              </svg>
            </div>

            {/* ── Zone legend pills ── */}
            {/* <div className="flex items-center justify-center gap-3 mt-1 mb-3 flex-shrink-0">
              {zones.map(z => (
                <div key={z.key}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-600 border cursor-default transition-all duration-200"
                  style={{
                    background: hoveredZone === z.key ? z.color + "22" : z.color + "10",
                    borderColor: z.color + "40",
                    color: z.color,
                    transform: hoveredZone === z.key ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: z.color }} />
                  {z.label} <span className="opacity-60">{z.range}</span>
                </div>
              ))}
            </div> */}
          </div>

          {/* ── Dropdown section ── */}
          {userCustomers.users.length > 0 && (
            <div className="
              px-5 py-4 flex-shrink-0
              border-t border-[var(--color-primary-light)] dark:border-[#1a3a24]
              bg-[var(--color-primary-lighter)] dark:bg-[#091510]
            ">
              <p className="text-[10px] font-700 uppercase tracking-widest mb-2
                text-[#9CA3AF] dark:text-[#6b7280]
              ">
                Select Agent
              </p>

              <div className="relative w-full" ref={dropdownRef}>
                {/* Trigger button */}
                <button
                  ref={dropdownButtonRef}
                  onClick={handleDropdownToggle}
                  className="
                    w-full px-4 py-2.5 rounded-xl
                    flex items-center justify-between
                    bg-white dark:bg-[#0d1f14]
                    border border-[var(--color-primary-light)] dark:border-[#1a3a24]
                    shadow-sm hover:shadow-md
                    transition-all duration-200
                    focus:outline-none
                  "
                  style={{
                    borderColor: isDropdownOpen ? "var(--color-primary, #006838)" : undefined,
                    boxShadow: isDropdownOpen ? "0 0 0 3px rgba(0,104,56,0.1)" : undefined,
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Mini avatar */}
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-700"
                      style={{ background: "linear-gradient(135deg, #006838, #34D399)" }}>
                      {selectedUser?.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <span className="text-sm font-600 truncate
                      text-[var(--color-secondary-darker)] dark:text-white
                    ">
                      {selectedUser?.name ?? "Select agent"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {selectedUser && (
                      <span className="text-xs font-700 px-2 py-0.5 rounded-full"
                        style={{
                          background: getZoneColor(selectedUser.customers) + "18",
                          color: getZoneColor(selectedUser.customers),
                        }}>
                        {selectedUser.customers}
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200
                      text-[var(--color-primary)] dark:text-[#6EE7B7]
                      ${isDropdownOpen ? "rotate-180" : ""}
                    `} />
                  </div>
                </button>

                {/* Dropdown list */}
                {isDropdownOpen && (
                  <div className={`
                    absolute z-50 w-full rounded-xl overflow-hidden
                    bg-white dark:bg-[#0d1f14]
                    border border-[var(--color-primary-light)] dark:border-[#1a3a24]
                    shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                    loc-scroll max-h-48 overflow-y-auto
                    ${dropdownDirection === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
                  `}>
                    {userCustomers.users.map((user: any, index: number) => {
                      const isSelected = selectedUser?.id === user?.id;
                      return (
                        <button
                          key={index}
                          onClick={() => { setSelectedUser(user); setIsDropdownOpen(false); }}
                          className="
                            w-full px-4 py-2.5 text-left flex items-center justify-between
                            transition-all duration-150
                            border-b last:border-b-0
                            border-[var(--color-primary-lighter)] dark:border-[#1a3a24]
                          "
                          style={{
                            background: isSelected
                              ? "var(--color-primary-lighter, #EAFBF3)"
                              : "transparent",
                          }}
                          onMouseEnter={e => {
                            if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--color-primary-lighter, #EAFBF3)";
                          }}
                          onMouseLeave={e => {
                            if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent";
                          }}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-700"
                              style={{ background: `hsl(${index * 43}, 55%, 42%)` }}>
                              {user?.name?.[0]?.toUpperCase()}
                            </div>
                            <span className={`text-sm truncate ${isSelected
                              ? "font-700 text-[var(--color-primary)] dark:text-[#6EE7B7]"
                              : "font-500 text-[#374151] dark:text-[#D1FAE5]"
                            }`}>
                              {user?.name}
                            </span>
                          </div>
                          <span className="text-xs font-700 flex-shrink-0 ml-2 tabular-nums"
                            style={{ color: getZoneColor(user?.customers || 0) }}>
                            {user?.customers}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}