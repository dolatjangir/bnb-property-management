"use client";
import React, { useEffect } from 'react'
import ProgressCircle from './ProgressCircle';
import Link from 'next/link';
import { BsArrowRightCircle } from "react-icons/bs";
import { getAllCustomerFollowups } from '@/store/customerFollowups';
import { getProperty } from '@/store/property';
import { getAllContactFollowups } from '@/store/contactFollowups';
import { getContact } from '@/store/contact';
import ProgressCircleItem from './ProgressCircleItem';

// ── Interfaces — UNCHANGED ────────────────────────────────────────────────────
interface FollowupData {
  percentage: number;
  followups: number;
  totalCustomers: number;
  status: string;
  statusSecondary: string;
  color: string;
}
interface FollowupStatusMetric {
  percentage: number;
  value: number;
  total: number;
  status: string;
  statusSecondary: string;
  color: string;
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonMetric = ({ delay = 0 }: { delay?: number }) => (
  <div
    className="flex flex-col items-center gap-4 p-5 rounded-2xl
      bg-[var(--color-primary-lighter)] dark:bg-[#0d1f14]
      border border-[var(--color-primary-light)] dark:border-[#1a3a24]
    "
    style={{ animation: `sk-pulse 1.4s ease infinite`, animationDelay: `${delay}ms` }}
  >
    <div className="w-24 h-24 rounded-full bg-white/60 dark:bg-[#1a3a24]" />
    <div className="w-24 h-3 rounded-full bg-white/60 dark:bg-[#1a3a24]" />
    <div className="w-16 h-3 rounded-full bg-white/40 dark:bg-[#1a3a24]" />
  </div>
);

// ── Metric card wrapper ───────────────────────────────────────────────────────
const MetricCard = ({
  data,
  index,
  icon,
}: {
  data: FollowupData | FollowupStatusMetric;
  index: number;
  icon: React.ReactNode;
}) => {
  const isFollowupData = 'followups' in data;
  const value = isFollowupData ? (data as FollowupData).followups : (data as FollowupStatusMetric).value;
  const total = isFollowupData ? (data as FollowupData).totalCustomers : (data as FollowupStatusMetric).total;
  const pct = data.percentage;

  // Ring color logic: keep original color but add semantic bg
  const ringColor = data.color;
  const bgTint = pct < 10 ? "rgba(239,68,68,0.06)" : "rgba(14,165,233,0.06)";

  return (
    <div
      className="group relative flex flex-col items-center gap-4 p-5 rounded-2xl cursor-default
        bg-white dark:bg-[#0d1f14]
        border border-[var(--color-primary-light)] dark:border-[#1a3a24]
        shadow-sm hover:shadow-md dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]
        transition-all duration-300 hover:-translate-y-1
      "
      style={{
        animation: `metric-rise 0.45s ease both`,
        animationDelay: `${index * 90}ms`,
      }}
    >
      {/* Top-right icon badge */}
      <div className="
        absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center
        bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24]
        border border-[var(--color-primary-light)] dark:border-[#2d5c3a]
        text-[var(--color-primary)] dark:text-[#6EE7B7]
        opacity-70 group-hover:opacity-100 transition-opacity duration-200
      ">
        {icon}
      </div>

      {/* Progress circle — ProgressCircleItem already handles this, but we wrap it */}
      <div className="relative">
        {/* Glow behind circle */}
        <div className="absolute inset-0 rounded-full blur-xl opacity-20 dark:opacity-15 transition-opacity duration-300 group-hover:opacity-30"
          style={{ background: ringColor }} />
        <ProgressCircle
          percentage={pct}
          size={88}
          strokeWidth={7}
          color={ringColor}
        />
      </div>

      {/* Stats */}
      <div className="flex flex-col items-center gap-1 text-center">
        {/* Value / total */}
        <div className="flex items-baseline gap-1">
          <span
            className="text-2xl font-800 leading-none
              text-[var(--color-secondary-darker)] dark:text-white
            "
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800 }}
          >
            {value}
          </span>
          <span className="text-sm font-500 text-[#9CA3AF] dark:text-[#6b7280]">
            / {total}
          </span>
        </div>

        {/* Status labels */}
        <p className="text-[13px] font-600 leading-tight
          text-[var(--color-secondary-darker)] dark:text-white
        ">
          {data.status}
        </p>
        <p className="text-[11px] font-500 text-[#9CA3AF] dark:text-[#6b7280]">
          {data.statusSecondary}
        </p>

        {/* Pct badge */}
        <div
          className="mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-700"
          style={{
            background: ringColor + "18",
            color: ringColor,
            border: `1px solid ${ringColor}30`,
          }}
        >
          {pct}%
        </div>
      </div>

      {/* Mini progress bar at bottom */}
      <div className="w-full h-1 rounded-full overflow-hidden
        bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24]
        absolute bottom-0 left-0 right-0
      ">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: ringColor,
            transition: "width 0.9s ease",
          }}
        />
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const TenantFollowups = () => {
  // ── All original state — UNCHANGED ─────────────────────────────────────────
  const [followuUpsData, setFollowupsData] = React.useState<FollowupData | null>(null);
  const [wantDemoData, setWantDemoData] = React.useState<FollowupStatusMetric | null>(null);
  const [interestedData, setInterestedData] = React.useState<FollowupStatusMetric | null>(null);
  const [unInterestedData, setUnInterestedData] = React.useState<FollowupStatusMetric | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const getColorByPercentage = (percentage: number, defaultColor: string) =>
    percentage < 10 ? "#ef4444" : defaultColor;

  useEffect(() => { fetchCustomerFollowupData(); }, []);

  // ── All original fetch logic — UNCHANGED ───────────────────────────────────
  const fetchCustomerFollowupData = async () => {
    const FollowupResponseRaw = await getAllContactFollowups();
    const FollowupResponse = FollowupResponseRaw?.map((item: any) => ({
      ContactId: item.ContactId,
      StatusType: item.StatusType,
      Date: item.Date,
      _id: item._id,
      Name: item.contact.Name,
      ContactNumber: item.contact.ContactNo,
      User: item.contact.AssignTo?.name ?? "",
    }));

    const FollowupsContacts = FollowupResponse?.filter(
      (item: any, index: number, arr: any[]) =>
        arr.findIndex((row) => row.ContactId === item.ContactId) === index
    ).length;
    const totalFollowups = FollowupResponse?.length;

    const interestedFollowups = FollowupResponseRaw?.filter(
      (item: any) => item.StatusType === "interested" || item.StatusType === "Interested"
    ).length;
    const unInterestedFollowups = FollowupResponseRaw?.filter(
      (item: any) => item.StatusType === "not interested" || item.StatusType === "Not Interested"
    ).length;
    const wantDemoFollowups = FollowupResponseRaw?.filter(
      (item: any) => item.StatusType === "want demo" || item.StatusType === "Want Demo"
    ).length;

    const contacts = await getContact();
    const totalContacts = contacts.length;

    const percentage = totalContacts ? (FollowupsContacts! / totalContacts) * 100 : 0;
    const interestedPercentage = totalFollowups! > 0 ? (interestedFollowups! / totalFollowups!) * 100 : 0;
    const unInterestedPercentage = totalFollowups! > 0 ? (unInterestedFollowups! / totalFollowups!) * 100 : 0;
    const wantDemoPercentage = totalFollowups! > 0 ? (wantDemoFollowups! / totalFollowups!) * 100 : 0;

    setFollowupsData({
      percentage: Math.round(percentage),
      followups: FollowupsContacts ?? 0,
      totalCustomers: totalContacts,
      status: "To Followup",
      statusSecondary: "Contact",
      color: getColorByPercentage(Math.round(percentage), "#0EA5E9"),
    });
    setInterestedData({
      percentage: Math.round(interestedPercentage),
      value: interestedFollowups ?? 0,
      total: totalFollowups ?? 0,
      status: "Interested",
      statusSecondary: "Followups",
      color: getColorByPercentage(Math.round(interestedPercentage), "#0EA5E9"),
    });
    setUnInterestedData({
      percentage: Math.round(unInterestedPercentage),
      value: unInterestedFollowups ?? 0,
      total: totalFollowups ?? 0,
      status: "Not Interested",
      statusSecondary: "Followups",
      color: getColorByPercentage(Math.round(unInterestedPercentage), "#0EA5E9"),
    });
    setWantDemoData({
      percentage: Math.round(wantDemoPercentage),
      value: wantDemoFollowups ?? 0,
      total: totalFollowups ?? 0,
      status: "Want Demo",
      statusSecondary: "Followups",
      color: getColorByPercentage(Math.round(wantDemoPercentage), "#0EA5E9"),
    });
    setIsLoading(false);
  };

  // Icons per card
  const icons = [
    // Contact
    <svg key="c" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    // Interested
    <svg key="i" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    // Not interested
    <svg key="n" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    // Want demo
    <svg key="d" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  ];

  const allData = [followuUpsData, interestedData, unInterestedData, wantDemoData];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes metric-rise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sk-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
        @keyframes header-fade {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .followup-section { animation: header-fade 0.4s ease both; font-family: 'DM Sans', sans-serif; }
      `}</style>

      <section className="
        followup-section mt-6 overflow-hidden rounded-2xl
        bg-white dark:bg-[#0d1f14]
        border border-[var(--color-primary-light)] dark:border-[#1a3a24]
        shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
      ">

        {/* ── Section header ── */}
        <div className="
          flex items-center justify-between px-6 py-4
          border-b border-[var(--color-primary-light)] dark:border-[#1a3a24]
          bg-[var(--color-primary-lighter)] dark:bg-[#091510]
        ">
          <div className="flex items-center gap-3">
            {/* Icon badge */}
            <div className="
              w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md
            " style={{ background: "linear-gradient(135deg, #006838, #0B7A43)" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.7 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>

            <div>
              <p className="text-[10px] font-700 tracking-widest uppercase mb-0.5
                text-[var(--color-primary)] dark:text-[#6EE7B7]
              ">
                Analytics
              </p>
              <h2
                className="leading-tight text-[var(--color-secondary-darker)] dark:text-white"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700 }}
              >
                Contact Followup
              </h2>
            </div>
          </div>

          {/* Live indicator */}
          <div className="
            flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-600
            bg-white dark:bg-[#0d1f14]
            border border-[var(--color-primary-light)] dark:border-[#1a3a24]
            text-[var(--color-primary)] dark:text-[#6EE7B7]
            shadow-sm
          ">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse
              shadow-[0_0_6px_rgba(52,211,153,0.7)]
            " />
            Live
          </div>
        </div>

        {/* ── Cards grid ── */}
        <div className="p-6">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
            {isLoading ? (
              // Skeleton placeholders
              [0, 1, 2, 3].map(i => <SkeletonMetric key={i} delay={i * 100} />)
            ) : (
              allData.map((data, index) => {
                if (!data) return null;

                // Use ProgressCircleItem exactly as original but wrapped in styled card
                return (
                  <div
                    key={index}
                    className="
                      group relative flex flex-col items-center gap-3 p-5 pt-6 pb-4 rounded-2xl cursor-default
                      bg-white dark:bg-[#0a1a0e]
                      border border-[var(--color-primary-light)] dark:border-[#1a3a24]
                      shadow-sm hover:shadow-lg dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.45)]
                      transition-all duration-300 hover:-translate-y-1 overflow-hidden
                    "
                    style={{
                      animation: `metric-rise 0.45s ease both`,
                      animationDelay: `${index * 90}ms`,
                    }}
                  >
                    {/* Corner icon */}
                    <div className="
                      absolute top-3 right-3 w-7 h-7 rounded-lg
                      flex items-center justify-center
                      bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24]
                      border border-[var(--color-primary-light)] dark:border-[#2d5c3a]
                      text-[var(--color-primary)] dark:text-[#6EE7B7]
                      opacity-60 group-hover:opacity-100 transition-opacity
                    ">
                      {icons[index]}
                    </div>

                    {/* Ambient glow */}
                    <div
                      className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full pointer-events-none opacity-10 dark:opacity-8 group-hover:opacity-20 transition-opacity blur-2xl"
                      style={{ background: data.color }}
                    />

                    {/* ProgressCircleItem — exactly as original */}
                    <ProgressCircleItem
                      percentage={data.percentage}
                      value={'followups' in data ? (data as FollowupData).followups : (data as FollowupStatusMetric).value}
                      total={'followups' in data ? (data as FollowupData).totalCustomers : (data as FollowupStatusMetric).total}
                      status={data.status}
                      statusSecondary={data.statusSecondary}
                      color={data.color}
                    />

                    {/* Percentage badge */}
                    <div
                      className="px-3 py-0.5 rounded-full text-[11px] font-700"
                      style={{
                        background: data.color + "18",
                        color: data.color,
                        border: `1px solid ${data.color}30`,
                      }}
                    >
                      {data.percentage}% coverage
                    </div>

                    {/* Bottom progress strip */}
                    <div className="absolute bottom-0 left-0 right-0 h-[3px]
                      bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24]
                      overflow-hidden rounded-b-2xl
                    ">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${data.percentage}%`,
                          background: data.color,
                          transition: "width 1s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Footer summary row ── */}
        {!isLoading && followuUpsData && (
          <div className="
            mx-6 mb-6 px-5 py-3 rounded-xl
            flex items-center justify-between flex-wrap gap-3
            bg-[var(--color-primary-lighter)] dark:bg-[#091510]
            border border-[var(--color-primary-light)] dark:border-[#1a3a24]
          ">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34D399]"
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.7)" }} />
              <span className="text-[12px] font-600
                text-[var(--color-primary)] dark:text-[#6EE7B7]
              ">
                Total contacts: <span className="font-700">{followuUpsData.totalCustomers}</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              {[
                { label: "Contacted", val: followuUpsData.followups, color: "#0EA5E9" },
                { label: "Interested", val: interestedData?.value ?? 0, color: "#22c55e" },
                { label: "Not Interested", val: unInterestedData?.value ?? 0, color: "#ef4444" },
                { label: "Want Demo", val: wantDemoData?.value ?? 0, color: "#FBBF24" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-[11px] font-500 text-[#6b7280] dark:text-[#9CA3AF]">
                    {s.label}: <span className="font-700" style={{ color: s.color }}>{s.val}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>
    </>
  );
};

export default TenantFollowups;