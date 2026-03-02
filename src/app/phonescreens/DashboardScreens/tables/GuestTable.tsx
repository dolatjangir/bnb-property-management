"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdPhone, MdEmail, MdEdit } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { AiOutlineHeart, AiOutlineBackward, AiOutlineForward } from "react-icons/ai";
import { IoIosHeart } from "react-icons/io";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { GoArrowLeft } from "react-icons/go";
import { Calendar, Phone } from "lucide-react";
import CustomerImageSlider from "@/app/component/slides/PropertyImageSlider";
import Loader from "@/app/component/loaders/Loader";

export interface LabelConfig {
  key: string;
  label: string;
}

interface LeadsSectionProps<T extends Record<string, any>> {
  leads: T[];
  labelLeads: LabelConfig[];
  allLabelLeads?: LabelConfig[];
  isGuestPage?: boolean;
  onAdd?: (id: string) => void;
  onEdit?: (id: string) => void;
  onWhatsappClick?: (lead: T) => void;
  onMailClick?: (lead: T) => void;
  onFavourite?: (lead: T) => void;
  loader?: boolean;
  hasMoreGuests?: boolean;
  fetchMore?: () => Promise<void>;
}

// Rotating avatar background colours
const AVATAR_BG = [
  "bg-emerald-500",
  "bg-teal-500",
  "bg-sky-600",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-indigo-500",
  "bg-fuchsia-500",
];

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function GuestTable<T extends Record<string, any>>({
  leads,
  labelLeads,
  allLabelLeads,
  onAdd,
  onEdit,
  onWhatsappClick,
  onMailClick,
  onFavourite,
  loader,
  hasMoreGuests,
  fetchMore,
}: LeadsSectionProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS = 10;
  const [viewAll, setViewAll] = useState(false);
  const [viewLeadData, setViewLeadData] = useState<T | null>(null);

  const totalPages = Math.ceil(leads.length / ITEMS);
  const paginatedLeads = leads.slice((currentPage - 1) * ITEMS, currentPage * ITEMS);

  const nextPage = async () => {
    if (currentPage < totalPages) { setCurrentPage((p) => p + 1); return; }
    if (hasMoreGuests && fetchMore) {
      await fetchMore();
      const newTotal = Math.ceil((leads.length + ITEMS) / ITEMS);
      if (currentPage < newTotal) setCurrentPage((p) => p + 1);
    }
  };
  const prevPage = () => { if (currentPage > 1) setCurrentPage((p) => p - 1); };

  const visiblePages = (() => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage === 1) return [1, 2, 3];
    if (currentPage === totalPages) return [totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 1, currentPage, currentPage + 1];
  })();

  const closeDrawer = () => { setViewAll(false); setViewLeadData(null); };
  const openDrawer = (lead: T) => { setViewLeadData(lead); setViewAll(true); };

  if (loader) return <Loader label="Loading Guests..." />;

  return (
    <div className=" min-h-screen px-2 pt-4 pb-12">

      {/* ═══════════════════════════════════════
          VIEW DETAIL DRAWER
      ═══════════════════════════════════════ */}
      <AnimatePresence>
        {viewAll && viewLeadData && (
          <>
            {/* Dim backdrop */}
            <motion.div
              className="fixed inset-0 z-[998] bg-black/50 backdrop-blur-[3px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
            />

            {/* Full-screen spring drawer */}
            <motion.div
              className="fixed inset-0 z-[999] flex flex-col overflow-hidden bg-[#f5f6f1]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
            >
              {/* ── Image hero ── */}
              <div className="relative w-full h-[400px] shrink-0 bg-[#d1d5c8] overflow-hidden">
                <CustomerImageSlider
                  images={
                    viewLeadData?.GuestImage?.length
                      ? viewLeadData.GuestImage
                      : ["/siteplan2.png"]
                  }
                />

                {/* bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />

                {/* Back btn */}
                <button
                  onClick={closeDrawer}
                  className="absolute top-3 left-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center border-0 cursor-pointer active:scale-90 transition-transform"
                >
                  <GoArrowLeft size={20} />
                </button>

                {/* Fav btn */}
                <button
                  onClick={() => onFavourite?.(viewLeadData)}
                  className="absolute top-3 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center border-0 cursor-pointer active:scale-90 transition-transform"
                >
                  {viewLeadData.isFavourite
                    ? <IoIosHeart size={20} color="#ef4444" />
                    : <AiOutlineHeart size={20} color="#6b7280" />}
                </button>

                {/* Overlaid name + contact chip */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-10 pointer-events-none">
                  <p className="text-white/60 text-[0.65rem] font-semibold tracking-[0.12em] uppercase mb-0.5">
                    Guest Profile
                  </p>
                  <h2 className="text-white text-[1.4rem] font-bold leading-tight tracking-tight drop-shadow-lg mb-2">
                    {viewLeadData.Name || viewLeadData.GuestName || "Guest"}
                  </h2>
                  {viewLeadData.ContactNumber && (
                    <span className="inline-flex items-center gap-1.5 bg-[var(--color-secondary)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      <Phone size={11} />
                      {viewLeadData.ContactNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* ── White bottom sheet ── */}
              <div className="flex-1 overflow-y-auto bg-white rounded-t-[26px] -mt-5 relative px-5 pt-4 pb-10">
                {/* Drag pill */}
                <div className="w-9 h-[3px] rounded-full bg-black/10 mx-auto mb-5" />

                {/* 4-column CTA strip */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {viewLeadData.ContactNumber && (
                    <a
                      href={`tel:+91${viewLeadData.ContactNumber}`}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-[#eef5e9] text-[#4a7c2f] text-[0.58rem] font-bold tracking-widest uppercase no-underline active:scale-90 transition-transform"
                    >
                      <MdPhone size={22} />
                      Call
                    </a>
                  )}
                  <button
                    onClick={() => onWhatsappClick?.(viewLeadData)}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-[#e7f8ef] text-[#1aab58] text-[0.58rem] font-bold tracking-widest uppercase border-0 cursor-pointer active:scale-90 transition-transform"
                  >
                    <FaWhatsapp size={22} />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => onMailClick?.(viewLeadData)}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-[#e8f2fb] text-[#0077b6] text-[0.58rem] font-bold tracking-widest uppercase border-0 cursor-pointer active:scale-90 transition-transform"
                  >
                    <MdEmail size={22} />
                    Email
                  </button>
                  {/* <button
                    onClick={() => onAdd?.(viewLeadData._id)}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-[#fff4e6] text-[#d97706] text-[0.58rem] font-bold tracking-widest uppercase border-0 cursor-pointer active:scale-90 transition-transform"
                  >
                    <Calendar size={22} />
                    Follow Up
                  </button> */}
                </div>

                {/* Section heading */}
                <p className="text-[0.67rem] font-bold tracking-[0.1em] uppercase text-[#8a9080] mb-3">
                  Guest Information
                </p>

                {/* Info rows */}
                <div className="flex flex-col gap-2">
                  {allLabelLeads?.map((item, j) => {
                    const val = viewLeadData?.[item.key];
                 
                    return (
                      <div
                        key={j}
                        className="flex items-start justify-between gap-3 px-3.5 py-3 bg-[#f5f6f1] rounded-[13px]"
                      >
                        <span className="text-[0.7rem] text-[#8a9080] font-medium shrink-0 whitespace-nowrap pt-[1px]">
                          {item.label}
                        </span>
                        {item.label === "Contact No" ? (
                          <a
                            href={`tel:+91${val}`}
                            className="text-[0.76rem] text-[var(--color-primary)] font-semibold text-right break-words no-underline"
                          >
                            {val}
                          </a>
                        ) : (
                          <span className="text-[0.76rem] text-[#1a1d16] font-semibold text-right break-words">
                            {val}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════
          EMPTY STATE
      ═══════════════════════════════════════ */}
      {paginatedLeads.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-[#eef0e9] flex items-center justify-center text-[2rem]">
            👥
          </div>
          <p className="text-[1rem] font-bold text-[#1a1d16]">No Guests Found</p>
          <p className="text-[0.78rem] text-[#8a9080]">No guest records available right now.</p>
        </div>
      )}

      {/* ═══════════════════════════════════════
          GUEST CARDS
      ═══════════════════════════════════════ */}
      {paginatedLeads.map((lead, index) => {
        const name: string = lead.Name || lead.GuestName || "Guest";
        const avatarBg = AVATAR_BG[index % AVATAR_BG.length];
        const hasPhoto = lead.GuestImage?.length > 0;

        return (
          <motion.div
            key={index}
            className="bg-white rounded-[22px] mb-4 overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-black/[0.04]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            {/* ── Top section: avatar + info + thumb ── */}
            <div className="flex items-start gap-3 p-4 pb-3">

              {/* Avatar column */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                {/* Avatar / photo */}
                <button
                  className={`w-14 h-14 rounded-2xl overflow-hidden ${avatarBg} flex items-center justify-center cursor-pointer border-0 p-0 active:scale-90 transition-transform`}
                  onClick={() => openDrawer(lead)}
                >
                  {hasPhoto ? (
                    <img
                      src={lead.GuestImage[0]}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-[0.95rem]">
                      {initials(name)}
                    </span>
                  )}
                </button>

                {/* Fav */}
                <button
                  onClick={() => onFavourite?.(lead)}
                  className="w-8 h-8 rounded-full bg-[#f5f6f1] flex items-center justify-center border-0 cursor-pointer active:scale-90 transition-transform"
                >
                  {lead.isFavourite
                    ? <IoIosHeart size={15} color="#ef4444" />
                    : <AiOutlineHeart size={15} color="#8a9080" />}
                </button>

                {/* Edit */}
                <button
                  onClick={() => onEdit?.(lead._id)}
                  className="w-8 h-8 rounded-full bg-[#f5f6f1] flex items-center justify-center border-0 cursor-pointer active:scale-90 transition-transform"
                >
                  <MdEdit size={15} color="#4a7c2f" />
                </button>
              </div>

              {/* Info column */}
              <div className="flex-1 min-w-0 pt-0.5">
                <button
                  className="text-left border-0 bg-transparent p-0 cursor-pointer w-full"
                  onClick={() => openDrawer(lead)}
                >
                  <p className="text-[#1a1d16] font-bold text-[0.97rem] leading-snug tracking-tight mb-2 line-clamp-1">
                    {name}
                  </p>
                </button>

                {labelLeads.map((item, j) => {
                  const val = lead[item.key];
                  if (!val) return null;
                  return (
                    <div key={j} className="flex items-start gap-1 mb-1.5">
                      <span className="text-[0.65rem] text-[#8a9080] font-semibold shrink-0 mt-[1px] whitespace-nowrap">
                        {item.label}
                      </span>
                      <span className="text-[#1a1d16] text-[0.68rem] font-medium leading-snug line-clamp-2 break-words min-w-0">
                        — {String(val)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Thumbnail */}
              <button
                className="w-[68px] h-[68px] rounded-xl overflow-hidden bg-[#eef0e9] shrink-0 border-0 cursor-pointer p-0 active:scale-90 transition-transform shadow-sm"
                onClick={() => openDrawer(lead)}
              >
                <img
                  src={hasPhoto ? lead.GuestImage[0] : "/siteplan2.png"}
                  alt={name}
                  className={`w-full h-full ${hasPhoto ? "object-cover" : "object-contain p-2"}`}
                />
              </button>
            </div>

            {/* ── Hairline divider ── */}
            <div className="h-px bg-black/[0.05] mx-4" />

            {/* ── Action footer ── */}
            <div className="flex items-center justify-between px-4 py-3 gap-2">

              {/* View details pill */}
              <button
                onClick={() => openDrawer(lead)}
                className="flex items-center gap-1.5 bg-[var(--color-secondary)] text-white text-[0.68rem] font-bold tracking-wide px-4 py-2 rounded-full border-0 cursor-pointer active:scale-95 transition-transform shadow-md shadow-emerald-900/20"
              >
                View Details
                <GrFormNext size={13} />
              </button>

              {/* Icon actions */}
              <div className="flex items-center gap-2">
                {/* Follow Up */}
                <button
                  onClick={() => onAdd?.(lead._id)}
                  className="w-9 h-9 rounded-full bg-[#fff4e6] flex items-center justify-center border-0 cursor-pointer active:scale-90 transition-transform"
                  title="Follow Up"
                >
                  <Calendar size={16} color="#d97706" />
                </button>

                {/* Call */}
                <a
                  href={`tel:+91${String(lead.ContactNumber || lead.ContactNo || "")}`}
                  className="w-9 h-9 rounded-full bg-[#eef5e9] flex items-center justify-center active:scale-90 transition-transform"
                  onClick={() => onAdd?.(lead._id)}
                >
                  <MdPhone size={17} color="#4a7c2f" />
                </a>

                {/* Email */}
                <button
                  onClick={() => onMailClick?.(lead)}
                  className="w-9 h-9 rounded-full bg-[#e8f2fb] flex items-center justify-center border-0 cursor-pointer active:scale-90 transition-transform"
                >
                  <MdEmail size={17} color="#0077b6" />
                </button>

                {/* WhatsApp */}
                <button
                  onClick={() => onWhatsappClick?.(lead)}
                  className="w-9 h-9 rounded-full bg-[#e7f8ef] flex items-center justify-center border-0 cursor-pointer active:scale-90 transition-transform"
                >
                  <FaWhatsapp size={17} color="#1aab58" />
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* ═══════════════════════════════════════
          PAGINATION
      ═══════════════════════════════════════ */}
      {paginatedLeads.length > 0 && (
                    <div className="flex items-center justify-center w-full pt-2">
                        <div className="flex items-center gap-1.5 bg-white rounded-2xl px-3 py-2"
                            style={{ boxShadow: "0 2px 12px -4px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)" }}>

                            {/* First */}
                            <button
                                onClick={() => setCurrentPage(1)}
                                className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <AiOutlineBackward size={13} />
                            </button>

                            {/* Prev */}
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <GrFormPrevious size={14} />
                            </button>

                            {/* Page numbers */}
                            <div className="flex items-center gap-1">
                                <AnimatePresence mode="popLayout">
                                    {visiblePages.map((num, i) => (
                                        <motion.button
                                            key={num}
                                            onClick={() => setCurrentPage(num)}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.15 }}
                                            className={`rounded-xl text-[12px] font-semibold transition-all duration-200 flex items-center justify-center ${
                                                num === currentPage
                                                    ? "w-9 h-9 bg-[var(--color-primary)] text-white shadow-[0_4px_12px_-2px_var(--color-primary)]"
                                                    : "w-8 h-8 bg-gray-50 text-gray-500 hover:bg-gray-100"
                                            }`}
                                        >
                                            {num}
                                        </motion.button>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Next */}
                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <GrFormNext size={14} />
                            </button>

                            {/* Last */}
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <AiOutlineForward size={13} />
                            </button>
                        </div>
                    </div>
                )}
    </div>
  );
}