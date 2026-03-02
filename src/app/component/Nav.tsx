"use client";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { LuKey } from "react-icons/lu";
import { IoPersonOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "./ProtectedRoutes";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useThemeCustom } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<
    "notifications" | "quickAdd" | "adminMail" | null
  >(null);
  const router = useRouter();
  const { admin, logout } = useAuth();

  const notificationsRef = useRef<HTMLLIElement>(null);
  const quickAddRef = useRef<HTMLLIElement>(null);
  const adminMailRef = useRef<HTMLLIElement>(null);
  const { dark, toggleTheme } = useThemeCustom();

  const quickadds = [
    { name: "Add References", link: "/masters/references/add" },
    { name: "Add City", link: "/masters/city/add" },
    { name: "Add Location", link: "/masters/locations/add" },
    { name: "Add Functional Area", link: "/masters/functional-areas/add" },
    { name: "Add Industry", link: "/masters/industries/add" },
    { name: "Add Campaign", link: "/masters/campaign/add" },
    { name: "Add Income", link: "/masters/incomes/add" },
    { name: "Add Expenses", link: "/masters/expenses/add" },
    { name: "Add Status Type", link: "/masters/status-type/add" },
    { name: "Add Mail Template", link: "/masters/mail-templates/add" },
    { name: "Add Whatsapp Template", link: "/masters/whatsapp-templates/add" },
    { name: "Add Payment Method", link: "/masters/payment-methods/add" },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node) &&
        quickAddRef.current &&
        !quickAddRef.current.contains(e.target as Node) &&
        adminMailRef.current &&
        !adminMailRef.current.contains(e.target as Node)
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutDashboard = async () => {
    await logout();
    router.push("/admin");
  };

  const dropdownTransition =
    "transition-all duration-200 transform origin-top-right";

  const adminInitial = admin?.name?.[0]?.toUpperCase() ?? "A";

  return (
    <ProtectedRoute>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .navbar-root {
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Icon button base ── */
        .nav-icon-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          cursor: pointer;
          background: transparent;
          color: #006838;
          transition: background 0.18s ease, transform 0.15s ease;
          border: 1.5px solid transparent;
        }
        .dark .nav-icon-btn {
          color: #34D399;
        }
        .nav-icon-btn:hover {
          background: #EAFBF3;
          border-color: #D1F2E1;
          transform: translateY(-1px);
        }
        .dark .nav-icon-btn:hover {
          background: rgba(52, 211, 153, 0.15);
          border-color: rgba(52, 211, 153, 0.3);
        }
        .nav-icon-btn.active {
          background: #EAFBF3;
          border-color: #D1F2E1;
        }
        .dark .nav-icon-btn.active {
          background: rgba(52, 211, 153, 0.15);
          border-color: rgba(52, 211, 153, 0.3);
        }

        /* ── Text pill button ── */
        .nav-pill-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 13.5px;
          font-weight: 600;
          color: #005A30;
          background: transparent;
          border: 1.5px solid transparent;
          transition: all 0.18s ease;
          white-space: nowrap;
        }
        .dark .nav-pill-btn {
          color: #6EE7B7;
        }
        .nav-pill-btn:hover,
        .nav-pill-btn.active {
          background: #EAFBF3;
          border-color: #D1F2E1;
          transform: translateY(-1px);
        }
        .dark .nav-pill-btn:hover,
        .dark .nav-pill-btn.active {
          background: rgba(52, 211, 153, 0.15);
          border-color: rgba(52, 211, 153, 0.3);
        }

        /* ── Notification badge ── */
        .notif-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #F87171;
          border: 1.5px solid #fff;
          animation: notif-pulse 2.5s infinite;
        }
        .dark .notif-badge {
          border-color: #001208;
        }
        @keyframes notif-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(248,113,113,0.4); }
          50%       { box-shadow: 0 0 0 5px rgba(248,113,113,0); }
        }

        /* ── Avatar ── */
        .nav-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #34D399, #006838);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0,104,56,0.3);
        }
        .dark .nav-avatar {
          background: linear-gradient(135deg, #34D399, #0B7A43);
          box-shadow: 0 2px 8px rgba(52, 211, 153, 0.3);
        }

        /* ── Dropdown menus ── */
        .nav-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          z-index: 1000;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 40px rgba(0,104,56,0.14), 0 2px 8px rgba(0,0,0,0.06);
          border: 1px solid #D1F2E1;
          overflow: hidden;
        }
        .dark .nav-dropdown {
          background: #001208;
          border-color: rgba(52, 211, 153, 0.2);
          box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(52,211,153,0.1);
        }

        /* ── Dropdown header stripe ── */
        .nav-dropdown-header {
          padding: 14px 18px 12px;
          background: #EAFBF3;
          border-bottom: 1px solid #D1F2E1;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .dark .nav-dropdown-header {
          background: rgba(52, 211, 153, 0.1);
          border-color: rgba(52, 211, 153, 0.2);
        }

        /* ── Dropdown item ── */
        .nav-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 18px;
          font-size: 13.5px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: background 0.14s ease, padding-left 0.14s ease;
          border-bottom: 1px solid #EAFBF3;
          text-decoration: none;
        }
        .dark .nav-dropdown-item {
          color: #e2e8f0;
          border-color: rgba(52, 211, 153, 0.1);
        }
        .nav-dropdown-item:last-child { border-bottom: none; }
        .nav-dropdown-item:hover {
          background: #EAFBF3;
          padding-left: 22px;
          color: #006838;
        }
        .dark .nav-dropdown-item:hover {
          background: rgba(52, 211, 153, 0.15);
          color: #34D399;
        }
        .nav-dropdown-item svg,
        .nav-dropdown-item .react-icon {
          flex-shrink: 0;
          font-size: 15px;
          color: #006838;
          opacity: 0.7;
        }
        .dark .nav-dropdown-item svg,
        .dark .nav-dropdown-item .react-icon {
          color: #34D399;
        }
        .nav-dropdown-item:hover svg,
        .nav-dropdown-item:hover .react-icon {
          opacity: 1;
        }

        /* ── Divider ── */
        .nav-dropdown-divider {
          height: 1px;
          background: #D1F2E1;
          margin: 4px 0;
        }
        .dark .nav-dropdown-divider {
          background: rgba(52, 211, 153, 0.2);
        }

        /* ── Logout standalone btn ── */
        .nav-logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: transparent;
          border: 1.5px solid transparent;
          color: #F87171;
          cursor: pointer;
          font-size: 19px;
          transition: all 0.18s ease;
        }
        .dark .nav-logout-btn {
          color: #FCA5A5;
        }
        .nav-logout-btn:hover {
          background: #FEF2F2;
          border-color: #FECACA;
          transform: translateY(-1px);
        }
        .dark .nav-logout-btn:hover {
          background: rgba(248, 113, 113, 0.15);
          border-color: rgba(248, 113, 113, 0.3);
        }
      `}</style>

      <div className="navbar-root flex items-center h-full">
        <nav>
          <ul className="flex items-center gap-1.5">
            <li>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md transition bg-emerald-700 text-white bg-text-emerald-400 hover:bg-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </li>
            {/* ── Notifications ── */}
            <li ref={notificationsRef} className="relative max-md:hidden">
              <div
                className={`nav-icon-btn ${openMenu === "notifications" ? "active" : ""}`}
                onClick={() => setOpenMenu(openMenu === "notifications" ? null : "notifications")}
                onMouseEnter={() => setOpenMenu("notifications")}
              >
                <IoMdNotificationsOutline size={19} />
                <span className="notif-badge" />
              </div>

              <div
                className={`nav-dropdown ${dropdownTransition} ${
                  openMenu === "notifications"
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
                style={{ width: 320 }}
              >
                <div className="nav-dropdown-header">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold text-emerald-900 dark:text-emerald-100">
                      Notifications
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-400 text-white">
                      3
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 cursor-pointer">
                    View all
                  </span>
                </div>
                <div className="min-h-[200px] py-2">
                  <div className="flex flex-col items-center justify-center min-h-[180px] gap-2">
                    <IoMdNotificationsOutline size={32} className="text-emerald-200 dark:text-emerald-500/30 opacity-50" />
                    <p className="text-[13px] text-slate-400 font-medium">No new notifications</p>
                  </div>
                </div>
              </div>
            </li>

            {/* ── Quick Add ── */}
            <li ref={quickAddRef} className="relative max-md:hidden z-50">
              <div
                className={`nav-pill-btn ${openMenu === "quickAdd" ? "active" : ""}`}
                onClick={() => setOpenMenu(openMenu === "quickAdd" ? null : "quickAdd")}
                onMouseEnter={() => setOpenMenu("quickAdd")}
              >
                <span className="w-[22px] h-[22px] rounded-md bg-emerald-700 dark:bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <FaPlus size={9} color="#fff" />
                </span>
                <span>Quick Add</span>
                {openMenu === "quickAdd"
                  ? <MdKeyboardArrowUp size={16} className="text-emerald-700 dark:text-emerald-400" />
                  : <MdKeyboardArrowDown size={16} className="text-emerald-700 dark:text-emerald-400" />
                }
              </div>

              <div
                className={`nav-dropdown ${dropdownTransition} ${
                  openMenu === "quickAdd"
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
                style={{ width: 240, maxHeight: "calc(100vh - 80px)", overflowY: "auto" }}
              >
                <div className="nav-dropdown-header">
                  <span className="text-[13px] font-bold text-emerald-900 dark:text-emerald-100">
                    Quick Add
                  </span>
                </div>
                {quickadds.map((item, i) => (
                  <Link
                    key={item.name + i}
                    href={item.link}
                    onClick={() => setOpenMenu(null)}
                    className="nav-dropdown-item"
                  >
                    <span className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0 border border-emerald-100 dark:border-emerald-500/20">
                      <FaPlus size={8} className="text-emerald-700 dark:text-emerald-400" />
                    </span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </li>

            {/* ── Divider ── */}
            <li className="max-md:hidden w-px h-7 bg-emerald-100 dark:bg-emerald-500/20 mx-1" />

            {/* ── Admin Profile ── */}
            <li ref={adminMailRef} className="relative z-50">
              <div
                className={`nav-pill-btn ${openMenu === "adminMail" ? "active" : ""} py-[5px] pl-[6px] pr-2.5 gap-2`}
                onClick={() => setOpenMenu(openMenu === "adminMail" ? null : "adminMail")}
                onMouseEnter={() => setOpenMenu("adminMail")}
              >
                <div className="nav-avatar">
                  {adminInitial}
                </div>
                <div className="max-md:hidden leading-tight">
                  <div className="text-[13px] font-bold text-emerald-900 dark:text-emerald-100">
                    {admin?.name ?? "Admin"}
                  </div>
                  <div className="text-[10.5px] font-medium text-emerald-700 dark:text-emerald-400 capitalize">
                    {admin?.role ?? "administrator"}
                  </div>
                </div>
                {openMenu === "adminMail"
                  ? <MdKeyboardArrowUp size={15} className="text-emerald-700 dark:text-emerald-400" />
                  : <MdKeyboardArrowDown size={15} className="text-emerald-700 dark:text-emerald-400" />
                }
              </div>

              <div
                className={`nav-dropdown ${dropdownTransition} ${
                  openMenu === "adminMail"
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
                style={{ width: 220, right: 0 }}
              >
                <div className="nav-dropdown-header gap-2.5 flex-col items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="nav-avatar w-[38px] h-[38px] text-base">
                      {adminInitial}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                        {admin?.name ?? "Admin User"}
                      </div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium capitalize">
                        {admin?.role ?? "administrator"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Online</span>
                  </div>
                </div>

                <div className="py-1">
                  <div
                    className="nav-dropdown-item"
                    onClick={() => { setOpenMenu(null); router.push(`/users/edit/${admin?._id}`); }}
                  >
                    <IoPersonOutline className="react-icon" />
                    Edit Profile
                  </div>
                  <div
                    className="nav-dropdown-item"
                    onClick={() => { setOpenMenu(null); router.push("/users/change_password"); }}
                  >
                    <LuKey className="react-icon" />
                    Change Password
                  </div>

                  <div className="nav-dropdown-divider" />

                  <div
                    className="nav-dropdown-item text-red-400 dark:text-red-300"
                    onClick={() => { setOpenMenu(null); logoutDashboard(); }}
                  >
                    <CiLogout className="text-red-400 dark:text-red-300 opacity-100" size={16} />
                    Logout
                  </div>
                </div>
              </div>
            </li>

            {/* ── Standalone Logout ── */}
            <li>
              <div className="nav-logout-btn" onClick={logoutDashboard} title="Logout">
                <CiLogout />
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </ProtectedRoute>
  );
}