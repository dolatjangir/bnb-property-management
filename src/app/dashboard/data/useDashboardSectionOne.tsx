// useDashboardData.tsx
import { useState } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { LuCalendar, LuChartNoAxesColumnIncreasing, LuCalendarRange } from "react-icons/lu";

export interface DashboardCard {
  name: string;
  value: number;
  prefix?: string;
  bg: string;
  icon: React.ReactNode;
  footerlineColor: string;
}


export interface SmallScreenDashboardCardInterface {
  label: string;
  value: number;
  prefix?: string;
  delta: string;
  icon?: React.ReactNode;
  color: string;
}

interface User {
  id: string;
  name: string;
  customers: number;
  percentage?: number;
}

export interface UserFollowupsInterface {
  users: User[];
}

interface LocationData {
  city?: string;
  location: string;
  customers: number;
}

export interface FeedbackData {
  name: string;
  value: number;
  [key: string]: any;
}

export function useDashboardData() {

  const [smallScreenDashboardCard, setSmallScreenDashboardCard] = useState<SmallScreenDashboardCardInterface[]>([
    { label: "Properties", value: 0, delta: "+12%", color: "#4a7c2f" },
    { label: "Allotments", value: 0, delta: "+5%", color: "#0077b6" },
    { label: "Contacts", value: 0, delta: "+8", color: "#c0392b" },
    { label: "Revenue", value: 0, delta: "★", color: "#d97706" },
  ]);

  const [dashboardSectionOneCardData, setDashboardSectionOneCardData] = useState<DashboardCard[]>([
    {
      name: "Total Properties",
      value: 0,
      bg: "bg-gradient-to-r from-sky-500 to-sky-800",
      icon: <LuChartNoAxesColumnIncreasing />,
      footerlineColor: "from-sky-800 to-sky-500",
    },
    {
      name: "Alloted Rooms",
      value: 0,
      bg: "bg-gradient-to-r from-red-500 to-red-800",
      icon: <LuCalendarRange />,
      footerlineColor: "from-red-800 to-red-500",
    },
    {
      name: "Total Contacts",
      value: 0,
      bg: "bg-gradient-to-r from-teal-500 to-teal-800",
      icon: <LuCalendar />,
      footerlineColor: "from-teal-800 to-teal-500",
    },
    {
      name: "Total Revenue",
      value: 0,
      prefix: "₹",
      bg: "bg-gradient-to-r from-indigo-500 to-indigo-800",
      icon: <MdOutlineFileDownload />,
      footerlineColor: "from-indigo-800 to-indigo-500",
    },
  ]);

  // Mock data structure - replace with your actual backend data
  const [userCustomers, setUserCustomers] =
    useState<UserFollowupsInterface>({
      users: [],
    });

  const [locationStats, setLocationStats] = useState<LocationData[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<FeedbackData[]>([]);

  return {
    smallScreenDashboardCard,
    setSmallScreenDashboardCard,
    dashboardSectionOneCardData,
    setDashboardSectionOneCardData,
    userCustomers,
    setUserCustomers,
    locationStats,
    setLocationStats,
    feedbackStats,
    setFeedbackStats,
  };
}
