"use client";

import * as React from "react";
import {
  Home,
  User,
  ShoppingCart,
  Info,
  Pointer,
  IndianRupee,
  Diamond,
  MessageSquare,
  PlusSquare,
  PenSquareIcon,
  User2,
  LineChart,
  LucideCoins,
  ShieldUser,
  Settings,
  Building,
  DoorOpen,
  Image,
  Users,
  UserStar,
  Star,
  Utensils,
} from "lucide-react";

import { NavMain } from "../components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { title } from "process";
import { useAuth } from "@/context/AuthContext";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Properties",
      url: "/property",
      icon: Building,
    },
    {
      title: "Album",
      url: "/album",
      icon: Image,
    },
    {
      title: "Rooms",
      url: "#",
      icon: DoorOpen,
      items: [
        {
          title: "Allotment",
          url: "/rooms/allotment",
        },
        {
          title: "Availablity",
          url: "/rooms/availablity",
        },
        {
          title: "Rooms",
          url: "/rooms",
        },
      ],
    },
    {
      title: "Guest",
      url: "/guest",
      icon: Users,
    },
    {
      title: "Financial",
      url: "#",
      icon: IndianRupee,
      items: [
        {
          title: "Guest Billing",
          url: "/financial/guestbilling",
        },
        {
          title: "Expenditure",
          url: "/financial/expense_marketings",
        },
        {
          title: "Income Marketings",
          url: "/financial/income_marketings",
        },
      ],
    },
    {
      title: "Food Menus",
      url: "/foodmenu",
      icon: Utensils,
    },
    {
      title: "Testimonials",
      url: "/testimonials",
      icon: UserStar,
    },
    {
      title: "Contact",
      url: "/contact",
      icon: User,
    },
    {
      title: "Contact Follow Up",
      url: "/followups/contact",
      icon: PlusSquare,
    },
    {
      title: "Company Project",
      url: "/company_project",
      icon: User,
    },
    {
      title: "Schedules",
      url: "/schedules",
      icon: PenSquareIcon,
    },
    {
      title: "Task",
      url: "/task",
      icon: Pointer,
    },
    {
      title: "Masters",
      url: "#",
      icon: Diamond,
      items: [
        { title: "Property Fields",       url: "/masters/propertyfields" },
        { title: "Campaign",               url: "/masters/campaign" },
        { title: "Property Type",          url: "/masters/customer-types" },
        { title: "Property Subtype",       url: "/masters/customer-subtype" },
        { title: "Floor",                  url: "/masters/floor" },
        { title: "Menu Catalog",           url: "/masters/menucatalog" },
        { title: "Menu Catalog Type",      url: "/masters/menucatalogtype" },
        { title: "Room Type",              url: "/masters/roomtype" },
        { title: "Head",                   url: "/masters/head" },
        { title: "City",                   url: "/masters/city" },
        { title: "Locations",              url: "/masters/locations" },
        { title: "Sub Locations",          url: "/masters/sublocation" },
        { title: "Facilities",             url: "/masters/facilities" },
        { title: "Amenities",              url: "/masters/amenities" },
        { title: "Builder Sliders",        url: "/masters/builder-sliders" },
        { title: "Fuctional Areas",        url: "/masters/functional-areas" },
        { title: "Industries",             url: "/masters/industries" },
        { title: "Contact Campaign",       url: "/masters/contact-campaign" },
        { title: "Contact Type",           url: "/masters/contact-type" },
        { title: "References",             url: "/masters/references" },
        { title: "Price",                  url: "/masters/price" },
        { title: "Expenses",               url: "/masters/expenses" },
        { title: "Incomes",                url: "/masters/incomes" },
        { title: "Status Type",            url: "/masters/status-type" },
        { title: "Contact Status Type",    url: "/masters/contact-statustype" },
        { title: "Payment Methods",        url: "/masters/payment-methods" },
        { title: "Mail Templates",         url: "/masters/mail-templates" },
        { title: "Whatsapp Templates",     url: "/masters/whatsapp-templates" },
        { title: "New User Requests",      url: "/masters/newuser-requests" },
      ],
    },
    {
      title: "Favourites",
      url: "/favourites",
      icon: Star,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Customer Fields",
          url: "/settings/customer/customer-fields",
        },
      ],
    },
    {
      title: "Users",
      url: "/users",
      icon: User2,
    },
    {
      title: "Customer Import",
      url: "/imports/customer",
      icon: MessageSquare,
    },
    {
      title: "Contact Import",
      url: "/imports/contact",
      icon: MessageSquare,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const { admin, isLoading } = useAuth();
  if (isLoading) return null;

  const isCollapsed = state === "collapsed";

  const filteredNavItems = data.navMain
    .filter((item) => {
      if (item.title === "Masters" && admin?.role !== "administrator") return false;
      if (item.title === "Financial" && admin?.role === "user") return false;
      return true;
    })
    .map((item) => {
      if (item.title === "Settings") {
        return {
          ...item,
          items: item.items?.filter((subItem) => {
            if (subItem.title === "Customer Fields" && admin?.role !== "administrator") return false;
            return true;
          }),
        };
      }
      return item;
    });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        /* ── Sidebar Shell ── */
        [data-sidebar="sidebar"] {
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border-right: 1px solid #e2e8f0;
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.06);
        }

        .dark [data-sidebar="sidebar"] {
          background: linear-gradient(160deg, #001a0d 0%, #001208 40%, #000d06 70%, #000a04 100%);
          border-right: 1px solid rgba(52, 211, 153, 0.12);
          box-shadow: 4px 0 40px rgba(0, 0, 0, 0.55);
        }

        /* ── Left-edge glowing accent strip ── */
        [data-sidebar="sidebar"]::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(59, 130, 246, 0.4) 30%,
            rgba(37, 99, 235, 0.6) 60%,
            transparent 100%
          );
          pointer-events: none;
          z-index: 10;
        }

        .dark [data-sidebar="sidebar"]::after {
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(52, 211, 153, 0.7) 30%,
            rgba(11, 122, 67, 0.9) 60%,
            transparent 100%
          );
        }

        /* ── Scrollbar ── */
        [data-sidebar="content"]::-webkit-scrollbar { width: 3px; }
        [data-sidebar="content"]::-webkit-scrollbar-track { background: transparent; }
        [data-sidebar="content"]::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .dark [data-sidebar="content"]::-webkit-scrollbar-thumb {
          background: rgba(52, 211, 153, 0.2);
        }

        /* ══ NAV ITEMS ══════════════════════════════════ */
        [data-sidebar="menu-button"] {
          color: #475569;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          border-radius: 10px;
          transition: all 0.2s ease;
          margin-bottom: 2px;
          letter-spacing: 0.01em;
        }

        .dark [data-sidebar="menu-button"] {
          color: rgba(255, 255, 255, 0.85);
        }

        [data-sidebar="menu-button"]:hover {
          background: rgba(59, 130, 246, 0.08);
          color: #1e293b;
          transform: translateX(3px);
        }

        .dark [data-sidebar="menu-button"]:hover {
          background: rgba(52, 211, 153, 0.12);
          color: #ffffff;
        }

        [data-sidebar="menu-button"][data-active="true"],
        [data-sidebar="menu-button"].active {
          background: linear-gradient(
            90deg,
            rgba(59, 130, 246, 0.12) 0%,
            rgba(59, 130, 246, 0.04) 100%
          );
          color: #1e293b;
          font-weight: 600;
          box-shadow:
            inset 3px 0 0 #3b82f6,
            0 2px 12px rgba(59, 130, 246, 0.1);
        }

        .dark [data-sidebar="menu-button"][data-active="true"],
        .dark [data-sidebar="menu-button"].active {
          background: linear-gradient(
            90deg,
            rgba(52, 211, 153, 0.2) 0%,
            rgba(52, 211, 153, 0.06) 100%
          );
          color: #ffffff;
          font-weight: 700;
          box-shadow:
            inset 3px 0 0 #34D399,
            0 2px 16px rgba(52, 211, 153, 0.12);
        }

        /* ── Icons ── */
        [data-sidebar="menu-button"] svg {
          color: #94a3b8;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .dark [data-sidebar="menu-button"] svg {
          color: rgba(255, 255, 255, 0.45);
        }

        [data-sidebar="menu-button"]:hover svg {
          color: #3b82f6;
          transform: scale(1.1);
        }

        .dark [data-sidebar="menu-button"]:hover svg {
          color: rgba(255, 255, 255, 0.9);
        }

        [data-sidebar="menu-button"][data-active="true"] svg {
          color: #3b82f6;
        }

        .dark [data-sidebar="menu-button"][data-active="true"] svg {
          color: #34D399;
          filter: drop-shadow(0 0 6px rgba(52, 211, 153, 0.55));
        }

        /* ── Chevron ── */
        [data-sidebar="menu-button"] .lucide-chevron-right {
          color: #94a3b8;
          transition: color 0.2s;
        }

        .dark [data-sidebar="menu-button"] .lucide-chevron-right {
          color: rgba(255, 255, 255, 0.28);
        }

        [data-sidebar="menu-button"]:hover .lucide-chevron-right {
          color: #64748b;
        }

        .dark [data-sidebar="menu-button"]:hover .lucide-chevron-right {
          color: rgba(255, 255, 255, 0.6);
        }

        /* ══ SUB-MENU ════════════════════════════════ */
        [data-sidebar="menu-sub-button"] {
          color: #64748b;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          border-radius: 8px;
          transition: all 0.18s ease;
          letter-spacing: 0.01em;
        }

        .dark [data-sidebar="menu-sub-button"] {
          color: rgba(255, 255, 255, 0.58);
        }

        [data-sidebar="menu-sub-button"]:hover {
          background: rgba(59, 130, 246, 0.06);
          color: #334155;
          padding-left: 14px;
        }

        .dark [data-sidebar="menu-sub-button"]:hover {
          background: rgba(52, 211, 153, 0.1);
          color: rgba(255, 255, 255, 0.92);
        }

        [data-sidebar="menu-sub-button"][data-active="true"] {
          background: rgba(59, 130, 246, 0.1);
          color: #1e293b;
          font-weight: 600;
          box-shadow: inset 2px 0 0 #3b82f6;
        }

        .dark [data-sidebar="menu-sub-button"][data-active="true"] {
          background: rgba(52, 211, 153, 0.14);
          color: #ffffff;
          font-weight: 600;
          box-shadow: inset 2px 0 0 #6EE7B7;
        }

        /* ── Sub connector line ── */
        [data-sidebar="menu-sub"] {
          border-left: 1px solid #e2e8f0;
          margin-left: 18px;
          padding-left: 8px;
        }

        .dark [data-sidebar="menu-sub"] {
          border-left: 1px solid rgba(52, 211, 153, 0.14);
        }

        /* ── Group label ── */
        [data-sidebar="group-label"] {
          color: #94a3b8;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .dark [data-sidebar="group-label"] {
          color: rgba(255, 255, 255, 0.22);
        }

        /* ── Rail ── */
        // [data-sidebar="rail"] {
        //   border-right: 1px solid #e2e8f0;
        // }

        // .dark [data-sidebar="rail"] {
        //   border-right: 1px solid rgba(52, 211, 153, 0.08);
        // }

        [data-sidebar="rail"]:hover::after {
          background: rgba(59, 130, 246, 0.3);
        }

        .dark [data-sidebar="rail"]:hover::after {
          background: rgba(52, 211, 153, 0.4);
        }

        /* ── Footer ── */
        [data-sidebar="footer"] {
          border-top: 1px solid #e2e8f0;
          padding: 12px;
        }

        .dark [data-sidebar="footer"] {
          border-top: 1px solid rgba(52, 211, 153, 0.1);
        }

        /* ── Keyframes ── */
        @keyframes sidebar-pulse {
          0%, 100% { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25); }
          50%       { box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.06); }
        }

        .dark @keyframes sidebar-pulse {
          0%, 100% { box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.25); }
          50%       { box-shadow: 0 0 0 5px rgba(52, 211, 153, 0.06); }
        }

        @keyframes sidebar-glow {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }

        /* ── Animation Utilities ── */
        .animate-sidebar-pulse {
          animation: sidebar-pulse 2.5s infinite;
        }

        .animate-sidebar-glow {
          animation: sidebar-glow 2s infinite;
        }

        /* ── Font Families ── */
        .font-playfair {
          font-family: 'Playfair Display', serif;
        }

        .font-dm-sans {
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <Sidebar collapsible="icon" {...props}>

        {/* ══ HEADER ═══════════════════════════════════════════════════════════ */}
        <SidebarHeader className=" relative overflow-hidden p-0 bg-transparent">
          {/* Radial glow blob top-right */}
          <div className="  absolute -top-[30px] -right-[30px] w-[140px] h-[140px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(52,211,153,0.13)_0%,transparent_70%)]" />

          {isCollapsed ? (
            /* ── COLLAPSED ── */
            <div className="flex flex-col items-center justify-center py-[22px]">
              <div className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center bg-gradient-to-br  from-[#34D399] to-[#006838] shadow-[0_4px_18px_rgba(52,211,153,0.38),0_0_0_1px_rgba(52,211,153,0.22)]">
                <ShieldUser size={19} className="text-white" />
              </div>
            </div>
          ) : (
            /* ── EXPANDED ── */
            <div className="px-4 pt-3 pb-5">
              <img width={200} height={200} src="/white-bnb-logo.png" alt="BNB Logo" className=" hidden dark:brightness-0 dark:invert dark:block " />
                            <img width={200} height={200} src="/green-logo.png" alt="BNB Logo" className="dark:hidden" />


              {/* Glowing divider */}
              <div className="h-[1px] rounded-sm mb-3.5 bg-gradient-to-r  from-[rgba(52,211,153,0.65)] via-[rgba(52,211,153,0.15)] to-transparent" />

              {/* Admin info pill */}
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[rgba(52,211,153,0.07)] border border-[rgba(52,211,153,0.15)]">
                {/* Avatar */}
                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-[#34D399] to-[#0B7A43] shadow-[0_2px_10px_rgba(52,211,153,0.3)]">
                  <span className="text-[13px] font-bold text-white font-dm-sans">
                    {admin?.name?.[0]?.toUpperCase() ?? "A"}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-slate-800 dark:text-white/[0.92] font-dm-sans whitespace-nowrap overflow-hidden text-ellipsis">
                    {admin?.name ?? "Admin User"}
                  </div>
                  <div className="text-[11px] text-[#006838] dark:text-[#34D399] font-dm-sans font-semibold capitalize tracking-wide">
                    {admin?.role ?? "administrator"}
                  </div>
                </div>

                {/* Online pulse dot */}
                <div className="w-2 h-2 rounded-full shrink-0 bg-[#006838] animate-sidebar-pulse  dark:bg-[#34D399] shadow-[0_0_0_2px_rgba(52,211,153,0.22)]" />
              </div>
            </div>
          )}
        </SidebarHeader>
          <div className="h-[1px] rounded-sm  bg-gradient-to-r from-[rgba(52,211,153,0.65)] via-[rgba(52,211,153,0.15)] to-transparent ml-3" />
        {/* ══ CONTENT ══════════════════════════════════════════════════════════ */}
        <SidebarContent>
          {!isCollapsed && (
            <div className="px-[18px] pt-3 pb-1.5 text-[10px] font-bold tracking-[0.14em] uppercase text-slate-400 dark:text-white/20 font-dm-sans">
              Navigation
            </div>
          )}
          <NavMain items={filteredNavItems} />
        </SidebarContent>

        {/* ══ FOOTER ═══════════════════════════════════════════════════════════ */}
        <SidebarFooter>
          {!isCollapsed ? (
            <div className="flex flex-col gap-2">

              {/* System status */}
              <div className="flex items-center justify-between px-3 py-2 rounded-[10px] bg-slate-50 border border-slate-200 dark:bg-white/[0.03] dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-[7px] h-[7px] rounded-full bg-[#006838] animate-sidebar-glow shadow-[0_0_8px_rgba(59,130,246,0.6)] dark:bg-[#34D399] dark:shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="text-xs text-slate-500 dark:text-white/[0.42] font-dm-sans font-medium">
                    System Online
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#006838] dark:text-[rgba(52,211,153,0.8)] font-dm-sans tracking-wide px-2 py-0.5 bg-blue-50 dark:bg-[rgba(52,211,153,0.1)] rounded-full border border-blue-200 dark:border-[rgba(52,211,153,0.2)]">
                  v2.0
                </span>
              </div>

              {/* Gradient separator */}
              <div className="h-[1px] rounded-sm bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-[rgba(52,211,153,0.25)]" />

              <p className="text-[11px] text-center text-slate-400 dark:text-white/[0.14] font-dm-sans tracking-wide">
                © 2026 BNB Property Suite
              </p>
            </div>
          ) : (
            <div className="flex justify-center pb-2.5">
              <div className="w-[7px] h-[7px] rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] animate-sidebar-glow dark:bg-[#34D399] dark:shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            </div>
          )}
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </>
  );
}