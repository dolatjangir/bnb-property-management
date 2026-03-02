"use client";

import { BrickWallFire, School, Star, Utensils, DoorOpen } from "lucide-react";
import ImageSlider from "./ImageSlider";
import Link from "next/link";
import { BsPeople } from "react-icons/bs";
import { useAuth } from "@/context/AuthContext";
import { useDashboardData } from "../data/useDashboardSectionOne";
import { getProperty } from "@/store/property";
import { getContact } from "@/store/contact";
import { getRoomAllotment } from "@/store/room/roomallotment/roomallotment";
import { getIncomeMarketing } from "@/store/financial/incomemarketing/incomemarketing";
import { useEffect } from "react";

// ── Static overview stats ──────────────────────────────────────────────────────
const stats = [
  { label: "Revenue", value: "$24.8K", delta: "+12%", color: "#4a7c2f" },
  { label: "Occupancy", value: "87%", delta: "+5%", color: "#0077b6" },
  { label: "Bookings", value: "143", delta: "+8", color: "#c0392b" },
  { label: "Reviews", value: "4.96", delta: "★", color: "#d97706" },
];

const upcoming = [
  { guest: "Mia Laurent", room: "Suite 4A", check: "Feb 21", nights: 3, avatar: "ML" },
  { guest: "James Park", room: "Villa B", check: "Feb 23", nights: 5, avatar: "JP" },
  { guest: "Sara Osei", room: "Studio 2", check: "Feb 25", nights: 2, avatar: "SO" },
];

const boxButtons = [
  { pTag: "Campaigns", icon: <BrickWallFire size={26} />, url: "/masters/campaign", gradient: "from-red-500 to-rose-600" },
  { pTag: "Property", icon: <School size={26} />, url: "/property", gradient: "from-purple-500 to-violet-600" },
  { pTag: "Guests", icon: <BsPeople size={26} />, url: "/guest", gradient: "from-teal-500 to-cyan-600" },
  { pTag: "Favorites", icon: <Star size={26} />, url: "/favourites", gradient: "from-blue-500 to-indigo-600" },
  { pTag: "Menus", icon: <Utensils size={26} />, url: "/foodmenu", gradient: "from-emerald-500 to-green-600" },
  { pTag: "Rooms", icon: <DoorOpen size={26} />, url: "/rooms", gradient: "from-slate-500 to-gray-600" },
];

const avatarColors = ["#4a7c2f", "#0077b6", "#c0392b"];

const SmallScreenData = () => {
  const { admin, isLoading, login } = useAuth();
   const { smallScreenDashboardCard,setSmallScreenDashboardCard} = useDashboardData();
  const now = new Date();
  const formattedDate = now.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });


    useEffect(() => {
      DashboardSectionOneDataFetch();
    }, [])


    const getMonthRange = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start, end };
};

const calculateDelta = (current: number, previous: number) => {
  if (!previous) return "+0%";
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
};


const DashboardSectionOneDataFetch = async () => {
  const LeadsResponse = await getProperty();
  const ContactResponse = await getContact();
  const AllotedRoomResponse = await getRoomAllotment();
  const IncomeResponse = await getIncomeMarketing();

  if (LeadsResponse && AllotedRoomResponse && IncomeResponse && ContactResponse) {

    const now = new Date();
    const { start: currentStart, end: currentEnd } = getMonthRange(now);

    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const { start: prevStart, end: prevEnd } = getMonthRange(lastMonth);

    const filterByDate = (data: any[], dateField: string, start: Date, end: Date) => {
      return data.filter(item => {
        const itemDate = new Date(item[dateField]);
        return itemDate >= start && itemDate <= end;
      });
    };

    // -------- CURRENT MONTH --------
    const currentProperties = filterByDate(LeadsResponse, "createdAt", currentStart, currentEnd);
    const currentAllotments = filterByDate(AllotedRoomResponse, "createdAt", currentStart, currentEnd);
    const currentContacts = filterByDate(ContactResponse, "createdAt", currentStart, currentEnd);
    const currentRevenueData = filterByDate(IncomeResponse, "createdAt", currentStart, currentEnd);

    const currentRevenue = currentRevenueData.reduce(
      (sum: number, item: any) => sum + (Number(item.Income) || 0),
      0
    );

    // -------- PREVIOUS MONTH --------
    const prevProperties = filterByDate(LeadsResponse, "createdAt", prevStart, prevEnd);
    const prevAllotments = filterByDate(AllotedRoomResponse, "createdAt", prevStart, prevEnd);
    const prevContacts = filterByDate(ContactResponse, "createdAt", prevStart, prevEnd);
    const prevRevenueData = filterByDate(IncomeResponse, "createdAt", prevStart, prevEnd);

    const prevRevenue = prevRevenueData.reduce(
      (sum: number, item: any) => sum + (Number(item.Income) || 0),
      0
    );

    // -------- TOTAL (ALL TIME) --------
    const totalCustomer = LeadsResponse.length;
    const totalAllotedRooms = AllotedRoomResponse.length;
    const totalContacts = ContactResponse.length;
    const totalRevenue = IncomeResponse.reduce(
      (sum: number, item: any) => sum + (Number(item.Income) || 0),
      0
    );

    setSmallScreenDashboardCard(prev => {
      const newData = [...prev];

      newData[0] = {
        ...newData[0],
        value: totalCustomer || 0,
        delta: calculateDelta(currentProperties.length, prevProperties.length),
      };

      newData[1] = {
        ...newData[1],
        value: totalAllotedRooms || 0,
        delta: calculateDelta(currentAllotments.length, prevAllotments.length),
      };

      newData[2] = {
        ...newData[2],
        value: totalContacts || 0,
        delta: calculateDelta(currentContacts.length, prevContacts.length),
      };

      newData[3] = {
        ...newData[3],
        value: totalRevenue || 0,
        delta: calculateDelta(currentRevenue, prevRevenue),
        prefix: "₹",
      };

      return newData;
    });
  }
};


  return (
    <>
      <div className="min-h-screen py-5 px-3 bg-[#f5f6f1] text-[#1a1d16] ">
        {/* ── GREETING ── */}
        <div className="px-0 pt-1 pb-4">
          <div className="text-[0.72rem] text-[#8a9080] tracking-[0.08em] uppercase mb-[3px]">
            Dashboard · {formattedDate}
          </div>
          <div className="font-['Clash_Display'] text-[1.5rem] font-semibold tracking-[-0.02em] leading-[1.15]">
            Good morning, <em className="not-italic text-[#4a7c2f]">{(admin?.name.charAt(0).toUpperCase() + admin?.name?.slice(1)!)}</em> 👋
          </div>
        </div>

        {/* ── SLIDER ── */}
        <div className="px-0 mb-[6px] [&>*]:rounded-[22px] [&>*]:overflow-hidden">
          <ImageSlider />
        </div>

        {/* ── QUICK ACCESS HEADER ── */}
        <div className="px-0 pt-5 pb-3 flex items-center justify-between">
          <div className="font-['Clash_Display'] text-[1.05rem] font-semibold tracking-[-0.02em]">
            Quick Access
          </div>
          <div className="text-[0.68rem] font-medium bg-[rgba(74,124,47,0.1)] text-[#4a7c2f] px-[9px] py-[3px] rounded-full">
            6 modules
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        <div className="px-0 pb-2 font-['Clash_Display'] text-[0.78rem] font-semibold tracking-[0.06em] text-[#8a9080] uppercase">
          Overview · This Month
        </div>

        <div className="grid grid-cols-2 gap-[10px] px-0 mb-6">
          {smallScreenDashboardCard.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-[16px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border"
              style={{ borderColor: `${s.color}22` }}
            >
              <div className="text-[0.67rem] text-[#8a9080] tracking-[0.05em] mb-[6px] uppercase">
                {s.label}
              </div>
              <div
                className="font-['Clash_Display'] text-[1.45rem] font-bold tracking-[-0.03em] leading-none mb-[5px]"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
              <div className="text-[0.65rem] font-medium bg-[rgba(74,124,47,0.1)] text-[#4a7c2f] px-[7px] py-[2px] rounded-full inline-block">
                {s.delta}
              </div>
            </div>
          ))}
        </div>

        {/* ── UPCOMING STAYS ── */}
        <div className="px-0 pb-2 font-['Clash_Display'] text-[0.78rem] font-semibold tracking-[0.06em] text-[#8a9080] uppercase">
          Upcoming Stays
        </div>

        <div className="px-0 flex flex-col gap-[10px] mb-9">
          {upcoming.map((u, i) => (
            <div
              key={i}
              className="bg-white border border-[rgba(0,0,0,0.04)] rounded-[14px] p-[14px] flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            >
              <div
                className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center font-['Clash_Display'] font-bold text-[0.72rem] text-white shrink-0"
                style={{ background: avatarColors[i % avatarColors.length] }}
              >
                {u.avatar}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-['Clash_Display'] text-[0.88rem] font-semibold truncate">
                  {u.guest}
                </div>
                <div className="text-[0.7rem] text-[#8a9080] mt-[2px]">
                  {u.room}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[0.72rem] text-[#0077b6] font-medium">
                  {u.check}
                </div>
                <div className="text-[0.65rem] text-[#8a9080] mt-[2px]">
                  {u.nights} nights
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── NAV GRID ── */}
        {/*  <div className="grid grid-cols-3 gap-3 px-5 mb-[26px]">
        {boxButtons.map((item, index) => (
          <Link
            key={index}
            href={item.url ?? ""}
            className={`relative overflow-hidden rounded-[20px] px-3 pt-5 pb-4 min-h-[118px] flex flex-col items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.12)] active:scale-95 transition-transform duration-200 bg-gradient-to-br ${item.gradient}`}
          >
            <div className="absolute -top-3 -right-3 w-[52px] h-[52px] bg-white/15 rounded-full pointer-events-none" />
            <div className="absolute -bottom-2.5 -left-2.5 w-[40px] h-[40px] bg-white/10 rounded-full pointer-events-none" />

            <div className="bg-white/20 backdrop-blur-md p-[10px] rounded-[14px] mb-2 text-white flex items-center justify-center">
              {item.icon}
            </div>

            <p className="text-white font-semibold text-[0.76rem] text-center tracking-[0.01em] drop-shadow">
              {item.pTag}
            </p>
          </Link>
        ))}
      </div> */}

      </div>
    </>
  );
};

export default SmallScreenData;
