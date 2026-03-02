"use client";

import "./globals.css";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./component/Nav";
import { AppSidebar } from "../components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "../components/ui/separator";
import ProtectedRoute from "./component/ProtectedRoutes";
import { AuthProvider } from "@/context/AuthContext";
import { Poppins, Manrope, Schibsted_Grotesk } from 'next/font/google'
import { PropertyImportProvider } from "@/context/PropertyImportContext";
import { ContactImportProvider } from "@/context/ContactImportContext";
import MobileHamburger from "./component/HamburgerMenu";
import Link from "next/link";
import { Router } from "next/router";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/theme/muiTheme";
import { PropertyFieldLabelProvider } from "@/context/property/PropertyFieldLabelContext";
import { BrickWallFire, DoorOpen, School, Star, Utensils } from "lucide-react";
import { BsPeople } from "react-icons/bs";
import MobileBottomNav from "./component/MobileBottomNav";
import { ThemeProviderCustom } from "@/context/ThemeContext";

const poppins = Schibsted_Grotesk({
  weight: '400',
  subsets: ['latin'],
})

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname === "/admin" || pathname === "/register";

  useEffect(() => {
    if (Router && "prefetch" in Router) {
      Router.prefetch = async () => {}; // override prefetch globally
    }
  }, []);

  const boxButtons = [
  { pTag: "Campaigns", icon: <BrickWallFire size={18} />, url: "/masters/campaign", gradient: "from-red-500 to-rose-600" },
  { pTag: "Property", icon: <School size={18} />, url: "/property", gradient: "from-purple-500 to-violet-600" },
  { pTag: "Guests", icon: <BsPeople size={18} />, url: "/guest", gradient: "from-teal-500 to-cyan-600" },
  { pTag: "Favorites", icon: <Star size={18} />, url: "/favourites", gradient: "from-blue-500 to-indigo-600" },
  { pTag: "Menus", icon: <Utensils size={18} />, url: "/foodmenu", gradient: "from-emerald-500 to-green-600" },
  { pTag: "Rooms", icon: <DoorOpen size={18} />, url: "/rooms", gradient: "from-slate-500 to-gray-600" },
];

  return (
    <html lang="en" className={`min-h-screen w-full overflow-x-hidden ${poppins.className}`}>
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="icon" href="/icons/favicon-16x16.png" />
       <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />
        <title>Prime Consultancy Leads</title>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <body className="min-h-screen w-full bg-violet-100 overflow-x-hidden">
        <AuthProvider>
          <ThemeProviderCustom>
          <PropertyImportProvider>
            <ContactImportProvider>
            <PropertyFieldLabelProvider>
               <ThemeProvider theme={theme}>
              {isAdminPage ? (
                <main className="min-h-screen ">{children}</main>
              ) : (
                <ProtectedRoute>
                  <SidebarProvider>
                    <div className="flex min-h-screen w-full overflow-hidden">
                      {/* Sidebar */}
                      <AppSidebar />

                      {/* Main Area */}
                      <SidebarInset className="flex flex-col flex-1 min-h-screen overflow-hidden">

                        {/* Navbar */}
<header
  className="max-sm:fixed max-sm:top-0 max-sm:left-0 max-sm:w-full flex items-center h-[62px] pr-4 bg-white dark:bg-[#000a04] border-b border-emerald-100 dark:border-emerald-500/10 shadow-[0_1px_12px_rgba(0,104,56,0.07)] dark:shadow-[0_1px_12px_rgba(0,0,0,0.3)] z-10 sticky top-0 font-['DM_Sans',sans-serif]"
>
  {/* ── Left: Sidebar trigger + separator ── */}
  <div className="flex items-center max-sm:hidden gap-1 pl-2 pr-3">
    {/* SidebarTrigger — styled wrapper */}
    <div
      className="flex items-center justify-center w-[34px] h-[34px] rounded-[9px] bg-emerald-50 dark:bg-emerald-500/10 border-[1.5px] border-emerald-100 dark:border-emerald-500/20 cursor-pointer transition-all duration-200 ease text-emerald-700 dark:text-emerald-400 flex-shrink-0 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:-translate-y-px"
    >
      <SidebarTrigger className="ml-1 cursor-pointer" />
    </div>

    {/* Vertical separator */}
    <div className="w-px h-5 mx-2 bg-emerald-100 dark:bg-emerald-500/20" />
  </div>

  {/* ── Center-left: Breadcrumb / Page context (desktop) ── */}
  <div className="hidden sm:flex items-center gap-6">
    <span className="text-[13px] font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-3 py-[3px] rounded-full">
      BNB Pro
    </span>
  </div>

  {/* ── Mobile: bottom nav + hamburger ── */}
  <MobileBottomNav items={boxButtons} />
  <MobileHamburger />

  {/* ── Mobile: Dashboard link ── */}
  <Link
    href="/dashboard"
    className="sm:hidden text-[13px] font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-3 py-[3px] rounded-full"
  >
    BNB <span className="text-emerald-400 dark:text-emerald-300 text-[10px] font-bold tracking-wider align-super font-['DM_Sans',sans-serif]">PRO</span>
  </Link>

  {/* ── Right: Navbar ── */}
  <div className="ml-auto">
    <Navbar />
  </div>
</header>
                        {/* Page Content */}
                        <main className="flex-1 overflow-y-auto  dark:bg-linear-to-br from-[var(--color-primary)] via-[var(--color-primary-dark)] to-[var(--color-primary-darker)] max-sm:mb-10">
                          {/* Mobile Sidebar Trigger */}
                          <div className="flex items-center gap-2 max-w-[100px] max-md:hidden md:hidden mt-4 ml-4">
                            <SidebarTrigger className="ml-1" />
                            <Separator
                              orientation="vertical"
                              className="mr-2 data-[orientation=vertical]:h-4"
                            />
                          </div>

                          {/* Actual Page */}
                          <div className="p-3 max-md:px-0 max-md:py-0 max-sm:mt-[52px]">
                            {children}</div>
                        </main>
                       
                      </SidebarInset>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              )}
              </ThemeProvider>
              </PropertyFieldLabelProvider>
            </ContactImportProvider>
          </PropertyImportProvider>
          </ThemeProviderCustom>
        </AuthProvider>
      </body>
    </html>
  );
}
