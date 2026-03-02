"use client";

import { useEffect, useMemo, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { MdPhone, MdEmail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

import { AiOutlineBackward, AiOutlineForward } from "react-icons/ai"
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { IoIosHeart } from "react-icons/io";
import Link from "next/link";

export interface LabelConfig {
    key: string;
    label: string;
}

interface LeadsSectionProps<T extends Record<string, any>> {
    leads: T[];
    labelLeads: LabelConfig[];
    onEdit?: (id: string) => void;
    onFavourite?: (lead: T) => void;
}

export default function RoomAllotmentTable<T extends Record<string, any>>({
    leads,
    labelLeads,
    onEdit,
    onFavourite,
}: LeadsSectionProps<T>) {
    const [toggleSearchDropdown, setToggleSearchDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsperpage = 10;

    const totalPages = Math.ceil(leads.length / itemsperpage);
    const startIndex = (currentPage - 1) * itemsperpage;
    const paginatedLeads = leads.slice(startIndex, startIndex + itemsperpage);
    const [loader, setLoader] = useState(true);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const getDisplayedPages = () => {
        if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage === 1) return [1, 2, 3];
        if (currentPage === totalPages) return [totalPages - 2, totalPages - 1, totalPages];
        return [currentPage - 1, currentPage, currentPage + 1];
    };
    const pages = getDisplayedPages();

    return (
        <>
            <style>{`
                @keyframes allot-card-in {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .allot-card {
                    animation: allot-card-in 0.32s cubic-bezier(0.22,1,0.36,1) both;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .allot-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px -8px rgba(0,0,0,0.13) !important;
                }
                .allot-edit-btn:hover { transform: scale(1.08); }
            `}</style>

            <div className="px-0 pb-6 space-y-3">
                {/* Empty state */}
                {paginatedLeads.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                            <MdDelete size={28} className="text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-400 font-medium">No allotment available</p>
                    </div>
                )}

                {/* Cards */}
                {paginatedLeads.map((lead, index) => (
                    <div
                        key={index}
                        className="allot-card relative bg-white rounded-2xl overflow-hidden"
                        style={{
                            animationDelay: `${index * 0.05}s`,
                            boxShadow: "0 2px 16px -4px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.05)",
                        }}
                    >
                        {/* Left accent bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-[var(--color-primary)]" />

                        <div className="pl-5 pr-4 pt-4 pb-0">
                            {/* Title row: first two labels as header + edit button */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex-1 min-w-0">
                                    {labelLeads[0] && (
                                        <p className="text-[13px] font-bold text-gray-900 truncate">
                                            {String(lead[labelLeads[0].key])}
                                        </p>
                                    )}
                                    {labelLeads[1] && (
                                        <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                                            {labelLeads[1].label}: {String(lead[labelLeads[1].key])}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => onEdit?.(lead._id)}
                                    className="allot-edit-btn shrink-0 w-9 h-9 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] transition-transform duration-200 border-none cursor-pointer"
                                >
                                    <MdEdit size={17} />
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gray-100 mb-3" />

                            {/* Remaining fields as attribute pills */}
                            <div className="flex flex-wrap gap-2 pb-4">
                                {labelLeads.slice(2).map((item, j) => (
                                    <div
                                        key={j}
                                        className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1"
                                    >
                                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                                            {item.label}
                                        </span>
                                        <span className="text-[10px] text-[var(--color-primary)] font-bold">
                                            {String(lead[item.key])}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer strip */}
                        <div className="bg-[var(--color-primary)]/5 border-t border-[var(--color-primary)]/10 px-5 py-2 flex items-center justify-between">
                            <span className="text-[10px] text-[var(--color-primary)]/60 font-medium tracking-wide uppercase">
                                Allotment #{index + 1 + startIndex}
                            </span>
                            <div className="flex items-center gap-3">
                                {/* Actions slot — matches original empty div structure */}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Pagination */}
                {paginatedLeads.length > 0 && (
                    <div className="flex items-center justify-center w-full pt-2">
                        <div
                            className="flex items-center gap-1.5 bg-white rounded-2xl px-3 py-2"
                            style={{ boxShadow: "0 2px 12px -4px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)" }}
                        >
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
                                    {pages.map((num) => (
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
        </>
    );
}