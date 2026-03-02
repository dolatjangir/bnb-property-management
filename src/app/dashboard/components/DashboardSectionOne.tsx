"use client";

import { useEffect, useRef, useState } from "react";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";
import { LuCalendar, LuChartNoAxesColumnIncreasing, LuCalendarRange } from "react-icons/lu";
import { getProperty } from "@/store/property";
import { useDashboardData } from "../data/useDashboardSectionOne";
import { getAllCustomerFollowups } from "@/store/customerFollowups";
import { getIncomeMarketing } from "@/store/financial/incomemarketing/incomemarketing";
import { getContact } from "@/store/contact";
import { getRoomAllotment } from "@/store/room/roomallotment/roomallotment";

export default function DashboardSectionOne() {
  // ✅ All original state — UNCHANGED
  const { dashboardSectionOneCardData, setDashboardSectionOneCardData } = useDashboardData();
  const [dataLoading, setDataLoading] = useState(false);

  const [counts, setCounts] = useState<number[]>(
    dashboardSectionOneCardData.map(() => 0)
  );
  const countersRef = useRef<HTMLDivElement | null>(null);
  const [countersInView, setCountersInView] = useState<boolean>(false);

  // ✅ Observe section visibility — UNCHANGED
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setCountersInView(entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (countersRef.current) observer.observe(countersRef.current);
    return () => {
      if (countersRef.current) observer.unobserve(countersRef.current);
    };
  }, []);

  // ✅ Data fetch — UNCHANGED
  useEffect(() => {
    DashboardSectionOneDataFetch();
  }, []);

  const DashboardSectionOneDataFetch = async () => {
    const LeadsResponse = await getProperty();
    const ContactResponse = await getContact();
    const AllotedRoomResponse = await getRoomAllotment();
    const IncomeResponse = await getIncomeMarketing();

    if (LeadsResponse && AllotedRoomResponse && IncomeResponse && ContactResponse) {
      const totalCustomer = LeadsResponse.length;
      const totalAllotedRooms = AllotedRoomResponse.length;
      const totalContacts = ContactResponse.length;
      const totalRevenue = IncomeResponse.reduce(
        (sum: number, item: any) => sum + (Number(item.Income) || 0), 0
      );

      setDashboardSectionOneCardData((prev) => {
        const newData = [...prev];
        newData[0] = { ...newData[0], value: totalCustomer || 0 };
        newData[1] = { ...newData[1], value: totalAllotedRooms || 0 };
        newData[2] = { ...newData[2], value: totalContacts || 0 };
        newData[3] = { ...newData[3], value: totalRevenue || 0, prefix: "₹" };
        setDataLoading(true);
        return newData;
      });
    }
  };

  // ✅ Count animation — UNCHANGED
  useEffect(() => {
    if (!countersInView) return;
    const intervals: number[] = [];

    dashboardSectionOneCardData.forEach((item, index) => {
      const increment = item.value < 10 ? 1 : Math.ceil(item.value / 50);
      const intervalTime = item.value < 10 ? 200 : 30;

      if (dataLoading) {
        const intervalId = window.setInterval(() => {
          setCounts((prev) => {
            const newCounts = [...prev];
            if (newCounts[index] < item.value) {
              newCounts[index] = Math.min(newCounts[index] + increment, item.value);
            }
            return newCounts;
          });
        }, intervalTime);
        intervals.push(intervalId);
      }
    });

    return () => intervals.forEach((id) => clearInterval(id));
  }, [countersInView, dashboardSectionOneCardData]);

  // ── Skeleton loader while data is not ready ────────────────────────────────
  const SkeletonCard = () => (
    <div className="
      relative overflow-hidden rounded-2xl
      bg-white dark:bg-[#0d1f14]
      border border-[var(--color-primary-light)] dark:border-[#1a3a24]
      shadow-sm
    ">
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24] animate-pulse" />
          <div className="w-16 h-4 rounded-full bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24] animate-pulse" />
        </div>
        <div className="w-24 h-8 rounded-lg bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24] animate-pulse" />
        <div className="w-32 h-3 rounded-full bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24] animate-pulse" />
      </div>
      <div className="h-1 w-full bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24] animate-pulse" />
    </div>
  );

  return (
    <>
      {/* ── Inject fonts + custom animations ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes card-rise {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes bar-grow {
          from { width: 0%; }
          to   { width: var(--bar-width, 65%); }
        }
        @keyframes value-pop {
          0%   { transform: scale(0.85); opacity: 0; }
          60%  { transform: scale(1.06); }
          100% { transform: scale(1);    opacity: 1; }
        }
        .dash-card {
          animation: card-rise 0.5s ease both;
          font-family: 'DM Sans', sans-serif;
        }
        .dash-card:hover .card-icon-wrap {
          transform: scale(1.1) rotate(-4deg);
        }
        .card-icon-wrap {
          transition: transform 0.3s ease;
        }
        .count-value {
          animation: value-pop 0.4s ease both;
          font-family: 'Playfair Display', serif;
        }
        .progress-bar {
          animation: bar-grow 1.2s ease 0.6s both;
        }
      `}</style>

      <div
        ref={countersRef}
        className="
          p-5 rounded-2xl
          bg-[var(--color-primary-lighter)] dark:bg-[#060f09]
          transition-colors duration-300
        "
      >

        {/* ── Section header ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            {/* Accent line */}
            <span className="
              w-1 h-8 rounded-full
              bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent,#34D399)]
            " />
            <div>
              <h2 className="
                text-lg font-bold leading-none
                text-[var(--color-secondary-darker)] dark:text-white
              "
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Overview
              </h2>
              <p className="text-xs mt-0.5 text-[#6b7280] dark:text-[#6EE7B7] font-medium">
                Live stats — updated now
              </p>
            </div>
          </div>

          {/* Live pill */}
          <div className="
            flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-white dark:bg-[#0d1f14]
            border border-[var(--color-primary-light)] dark:border-[#1a3a24]
            shadow-sm
          ">
            <span className="
              w-2 h-2 rounded-full bg-[var(--color-accent,#34D399)]
              shadow-[0_0_6px_rgba(52,211,153,0.8)]
              animate-pulse
            " />
            <span className="text-xs font-600 text-[var(--color-primary)] dark:text-[#6EE7B7]">
              Live
            </span>
          </div>
        </div>

        {/* ── Cards grid ── */}
        <section className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
          {dashboardSectionOneCardData.map((item, index) => (
            !dataLoading ? (
              <SkeletonCard key={index} />
            ) : (
              <div
                key={index}
                className="dash-card group relative overflow-hidden rounded-2xl cursor-default
                  bg-white dark:bg-[#0d1f14]
                  border border-[var(--color-primary-light)] dark:border-[#1a3a24]
                  shadow-sm hover:shadow-lg dark:hover:shadow-[0_8px_32px_rgba(0,104,56,0.25)]
                  transition-all duration-300 hover:-translate-y-1
                "
                style={{ animationDelay: `${index * 80}ms` }}
              >

                {/* ── Subtle background glow (top-right corner) ── */}
                <div
                  className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 dark:opacity-20 transition-opacity duration-300 group-hover:opacity-50"
                  style={{
                    background: "radial-gradient(circle, var(--color-primary-light) 0%, transparent 70%)",
                  }}
                />

                {/* ── Card body ── */}
                <div className="relative p-5">

                  {/* Top row: icon + trend badge */}
                  <div className="flex items-start justify-between mb-4">

                    {/* Icon wrapper */}
                    <div
                      className="card-icon-wrap w-11 h-11 rounded-xl flex items-center justify-center text-xl
                        bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24]
                        border border-[var(--color-primary-light)] dark:border-[#2d5c3a]
                        shadow-sm
                      "
                    >
                      {item.icon}
                    </div>

                    {/* Trend badge */}
                    <div className="
                      flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-700
                      bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24]
                      text-[var(--color-primary)] dark:text-[#6EE7B7]
                      border border-[var(--color-primary-light)] dark:border-[#2d5c3a]
                    ">
                      <FaArrowTrendUp size={10} />
                      <span className="font-bold">+{Math.max(1, Math.floor(counts[index] / 12))}%</span>
                    </div>
                  </div>

                  {/* Counter value */}
                  <div
                    className="count-value text-3xl font-bold leading-none mb-1
                      text-[var(--color-secondary-darker)] dark:text-white
                    "
                    style={{
                      animationDelay: `${index * 80 + 200}ms`,
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    {item.prefix || ""}
                    {counts[index].toLocaleString("en-IN")}
                  </div>

                  {/* Label */}
                  <p className="
                    text-sm font-500 mt-1
                    text-[#6b7280] dark:text-[#9CA3AF]
                  ">
                    {item.name}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="
                      w-full h-1.5 rounded-full overflow-hidden
                      bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24]
                    ">
                      <div
                        className="progress-bar h-full rounded-full"
                        style={{
                          "--bar-width": `${Math.min(95, Math.max(20, (counts[index] / (item.value || 1)) * 100))}%`,
                          background: `linear-gradient(90deg, var(--color-primary) 0%, #34D399 100%)`,
                          animationDelay: `${index * 80 + 400}ms`,
                        } as React.CSSProperties}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[11px] text-[#9CA3AF] dark:text-[#6b7280] font-medium">
                        Progress
                      </span>
                      <span className="
                        text-[11px] font-700
                        text-[var(--color-primary)] dark:text-[#6EE7B7]
                      ">
                        {Math.min(95, Math.max(20, Math.round((counts[index] / (item.value || 1)) * 100)))}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Glowing bottom accent strip ── */}
                <div
                  className={`
                    h-[3px] w-full
                    bg-gradient-to-r ${item.footerlineColor}
                  `}
                />
              </div>
            )
          ))}
        </section>

      </div>
    </>
  );
}