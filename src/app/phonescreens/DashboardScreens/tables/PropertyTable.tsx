"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdPhone, MdEmail, MdEdit } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { AiOutlineHeart, AiOutlineBackward, AiOutlineForward } from "react-icons/ai";
import { IoIosHeart } from "react-icons/io";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { GoArrowLeft } from "react-icons/go";
import { Mail, MapPin, User } from "lucide-react";
import PropertyImageSlider from "@/app/component/slides/PropertyImageSlider";
import Loader from "@/app/component/loaders/Loader";

export interface LabelConfig {
  key: string;
  label: string;
}

interface LeadsSectionProps<T extends Record<string, any>> {
  leads: T[];
  labelLeads: LabelConfig[];
  allLabelLeads?: LabelConfig[];
  isPropertyPage?: boolean;
  onAdd?: (id: string) => void;
  onEdit?: (id: string) => void;
  onWhatsappClick?: (lead: T) => void;
  onMailClick?: (lead: T) => void;
  onFavourite?: (lead: T) => void;
  loader?: boolean;
  hasMorePropertys?: boolean;
  fetchMore?: () => Promise<void>;
}

export default function PropertyTable<T extends Record<string, any>>({
  leads,
  labelLeads,
  allLabelLeads,
  onAdd,
  onEdit,
  onWhatsappClick,
  onMailClick,
  onFavourite,
  loader,
  hasMorePropertys,
  fetchMore,
}: LeadsSectionProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsperpage = 10;
  const [viewAll, setViewAll] = useState(false);
  const [viewLeadData, setViewLeadData] = useState<T | null>(null);

  const totalPages = Math.ceil(leads.length / itemsperpage);
  const startIndex = (currentPage - 1) * itemsperpage;
  const paginatedLeads = leads.slice(startIndex, startIndex + itemsperpage);

  const nextPage = async () => {
    if (currentPage < totalPages) { setCurrentPage((p) => p + 1); return; }
    if (hasMorePropertys && fetchMore) {
      await fetchMore();
      const newTotal = Math.ceil((leads.length + itemsperpage) / itemsperpage);
      if (currentPage < newTotal) setCurrentPage((p) => p + 1);
    }
  };

  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  const getDisplayedPages = () => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage === 1) return [1, 2, 3];
    if (currentPage === totalPages) return [totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const pages = getDisplayedPages();

  if (loader) return <Loader label="Loading Properties..." />;

  return (
    <div className="font-sans  px-4 pb-8">

      {/* ================= DETAIL DRAWER ================= */}
      <AnimatePresence>
        {viewAll && viewLeadData && (
          <motion.div
            className="fixed inset-0 z-[1000] bg-[#f5f6f1] flex flex-col overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
          >
            {/* Hero */}
            <div className="relative w-full h-[310px] bg-[#eef0e9] overflow-hidden flex-shrink-0">
              <PropertyImageSlider
                images={
                  viewLeadData?.PropertyImage?.length
                    ? viewLeadData.PropertyImage
                    : ["/siteplan2.png"]
                }
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

              <button
                className="absolute top-[10px] left-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center"
                onClick={() => { setViewAll(false); setViewLeadData(null); }}
              >
                <GoArrowLeft size={20} />
              </button>

              <button
                className="absolute top-[10px] right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center"
                onClick={() => onFavourite?.(viewLeadData)}
              >
                {viewLeadData.isFavourite
                  ? <IoIosHeart size={20} className="text-red-500" />
                  : <AiOutlineHeart size={20} className="text-gray-500" />}
              </button>

              <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                <div className="text-white text-2xl font-bold leading-tight drop-shadow-lg mb-2">
                  {viewLeadData.Description || viewLeadData.Name || "Property Detail"}
                </div>

                {(viewLeadData.Price || viewLeadData.Budget) && (
                  <span className="inline-flex items-center bg-[var(--color-primary)] text-white font-bold px-4 py-1 rounded-full shadow-lg">
                    ₹ {viewLeadData.Price || viewLeadData.Budget}
                  </span>
                )}
              </div>
            </div>

            {/* Sheet */}
            <div className="bg-white rounded-t-[26px] overflow-y-auto -mt-5 px-5 pt-6 pb-12 flex-1 relative">
              <div className="w-10 h-1 bg-black/10 rounded-full mx-auto mb-6" />

              {/* CTA Row */}
              <div className="flex gap-3 mb-6">
                {viewLeadData.ContactNumber && (
                  <a
                    href={`tel:+91${viewLeadData.ContactNumber}`}
                    className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl bg-[#eef5e9] text-[var(--color-primary)] text-xs font-semibold uppercase active:scale-95 transition"
                  >
                    <MdPhone size={22} />
                    Call
                  </a>
                )}

                {viewLeadData.ContactNumber && (
                  <button
                    onClick={() =>{  setViewAll(false);
  setViewLeadData(null);
  onWhatsappClick?.(viewLeadData)}}
                    className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl bg-[#e7f8ef] text-[#1aab58] text-xs font-semibold uppercase active:scale-95 transition"
                  >
                    <FaWhatsapp size={22} />
                    WhatsApp
                  </button>
                )}

                {(viewLeadData.Email || viewLeadData.email) && (
                  <button
                    onClick={() => onMailClick?.(viewLeadData)}
                    className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl bg-[#e8f2fb] text-[#0077b6] text-xs font-semibold uppercase active:scale-95 transition"
                  >
                    <MdEmail size={22} />
                    Email
                  </button>
                )}
              </div>

              {/* Property Info */}
              <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
                Property Information
              </div>

     
                                    {allLabelLeads?.map((item, j) => (
                                        <div
                                            key={j}
                                            className={`flex ${viewLeadData?.[item.key]?.length > 30 && "flex-col gap-2"} justify-between p-3 bg-gray-50 rounded-lg`}
                                        >
                                            <span className="font-semibold text-gray-700 text-sm">
                                                {item.label}
                                            </span>

                                            {item.label === "Contact No" ? (
                                                <a
                                                    href={`tel:+91${viewLeadData?.[item.key] ?? ""}`}
                                                    className="text-[var(--color-primary)] font-medium hover:underline text-sm"
                                                >
                                                    {viewLeadData?.[item.key] ?? ""}
                                                </a>
                                            ) : (
                                                <span className={`text-gray-900 font-medium text-right max-w-[60%] text-sm ${viewLeadData?.[item.key]?.length > 15 && "flex-col gap-2 max-w-full"} `}>
                                                    <p className="  text-left"> {viewLeadData?.[item.key] ?? ""}</p>
                                                </span>
                                            )}
                                        </div>
                                    ))}
                             
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= EMPTY ================= */}
      {paginatedLeads.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-[#eef0e9] flex items-center justify-center text-3xl mb-3">
            🏠
          </div>
          <div className="font-semibold text-lg">No Properties Found</div>
          <div className="text-sm text-gray-500">No properties available right now.</div>
        </div>
      )}

      {/* ================= CARDS ================= */}
      {paginatedLeads.map((lead, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-[22px] overflow-hidden mb-4 border border-black/5 shadow-md hover:shadow-xl transition active:scale-[0.985]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          {/* Image */}
          <div className="relative w-full h-[210px] bg-[#eef0e9] overflow-hidden group">
            <img
              src={lead.SitePlan?.length > 0 ? lead.SitePlan : "/siteplan2.png"}
              className={` ${lead.SitePlan?.length>0 ? "w-full h-full object-cover":" w-full h-full object-contain"} transition-transform duration-500 group-hover:scale-105`}
              onClick={() => { setViewAll(true); setViewLeadData(lead); }}
            />
{lead.SitePlan?.length > 0 ? <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" /> : null}
            

            {lead.Campaign && (
              <div className="absolute top-3 left-3 bg-[var(--color-primary)] text-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                {lead.Campaign}
              </div>
            )}

            <div className="absolute top-3 right-3 flex gap-2">
              <button
                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow flex items-center justify-center active:scale-90 transition"
                onClick={() => onFavourite?.(lead)}
              >
                {lead.isFavourite
                  ? <IoIosHeart size={16} className="text-red-500" />
                  : <AiOutlineHeart size={16} className="text-gray-600" />}
              </button>

              <button
                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow flex items-center justify-center active:scale-90 transition"
                onClick={() => onEdit?.(lead._id)}
              >
                <MdEdit size={16} className="text-[var(--color-primary)]" />
              </button>
            </div>

            {(lead.Price || lead.Budget) && (
              <div className="absolute bottom-3 left-3 bg-black/70 text-white text-sm font-bold px-3 py-1 rounded-md backdrop-blur-md">
                ₹ {lead.Price || lead.Budget}
              </div>
            )}

            {lead.Status && (
              <div className="absolute bottom-3 right-3 bg-[var(--color-primary)]/90 text-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide backdrop-blur-md">
                {lead.Status}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="px-4 py-4">
            {lead.Description && (
              <div className="text-base font-semibold text-gray-900 line-clamp-2 mb-2">
                {lead.Description}
              </div>
            )}

            {(lead.City || lead.Location) && (
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <MapPin size={13} className="text-[var(--color-primary)]" />
                {[lead.City, lead.Location].filter(Boolean).join(" — ")}
              </div>
            )}

            {lead.ContactNumber && (
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <MdPhone size={13} className="text-[var(--color-primary)]" />
                {lead.ContactNumber}
              </div>
            )}

            {(lead.Email || lead.email) && (
              <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
                <Mail size={13} className="text-[var(--color-primary)]" />
                <span className="truncate max-w-[220px]">
                  {lead.Email || lead.email}
                </span>
              </div>
            )}

            <div className="h-px bg-black/5 my-3" />

            <div className="flex items-center justify-between">
              {lead.Name && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <User size={13} className="text-[var(--color-primary)]" />
                  {lead.Name}
                </div>
              )}

              <button
                className="bg-[var(--color-primary)] text-white text-xs font-semibold px-5 py-2 rounded-full active:scale-95 transition"
                onClick={() => { setViewAll(true); setViewLeadData(lead); }}
              >
                View Detail →
              </button>
            </div>
          </div>
        </motion.div>
      ))}

      {/* ================= PAGINATION ================= */}
      {paginatedLeads.length > 0 && (
        <div className="flex justify-center gap-2 mt-4">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="w-9 h-9 rounded-full border border-black/10 bg-white flex items-center justify-center disabled:opacity-30">
            <AiOutlineBackward size={13} />
          </button>

          <button onClick={prevPage} disabled={currentPage === 1} className="w-9 h-9 rounded-full border border-black/10 bg-white flex items-center justify-center disabled:opacity-30">
            <GrFormPrevious size={15} />
          </button>

          {pages.map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border ${
                num === currentPage
                  ? "bg-[var(--color-primary)] text-white border-[#4a7c2f]"
                  : "bg-white border-black/10"
              }`}
            >
              {num}
            </button>
          ))}

          <button onClick={nextPage} disabled={!hasMorePropertys && currentPage === totalPages} className="w-9 h-9 rounded-full border border-black/10 bg-white flex items-center justify-center disabled:opacity-30">
            <GrFormNext size={15} />
          </button>

          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="w-9 h-9 rounded-full border border-black/10 bg-white flex items-center justify-center disabled:opacity-30">
            <AiOutlineForward size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
