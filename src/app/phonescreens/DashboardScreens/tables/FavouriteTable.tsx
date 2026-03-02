"use client";

import { useEffect, useMemo, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { MdPhone, MdEmail, MdLocationOn } from "react-icons/md";
import { FaHeart, FaWhatsapp } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";

import { AiOutlineBackward, AiOutlineForward } from "react-icons/ai"
import { IoIosHeart } from "react-icons/io";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
export interface LabelConfig {
    key: string;
    label: string;
}

interface LeadsSectionProps<T extends Record<string, any>> {
    leads: T[];
    labelLeads: LabelConfig[];
    onEdit?: (id: string) => void;
    onDelete?: (lead: T) => void;

}

function PropertyCard({ lead, index, onEdit, onDelete,  labelLeads }: any) {
  const [pressed, setPressed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.32,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fav-card"
    >
      {/* Header */}
      <div className="card-header">
        <div className="header-left">
          <span className="heart-icon">
            <FaHeart size={12} />
          </span>
          <span className="header-label">Saved Property</span>
        </div>

        <button
          className="edit-btn"
          onClick={() => onEdit?.(lead._id)}
        >
          <MdEdit size={16} />
          <span>Edit</span>
        </button>
      </div>

      {/* Body */}
      <div className="card-body">

        {/* OLD LOGIC — PropertyName + Location */}
        <h2 className="property-name">{lead.PropertyName}</h2>

        <p className="property-location ">
           <span className="text-[14px] font-semibold">{lead.SubLocation}</span>
          <span className="flex flex-row items-center text-[10px] font-semibold"><MdLocationOn size={14} className="loc-icon" />
          {lead.Location}</span>
        </p>

        <div className="divider" />

        {/* OLD labelLeads LOGIC */}
        <div className="fields-grid">
          {labelLeads.map((item: any, j: number) => (
            <div key={j} className="field-row">

              <span className="field-label">
                {item.label}
              </span>

              <span
                className={`field-value ${
                  item.key === "Status"
                    ? lead[item.key] === "Available"
                      ? "status-green"
                      : "status-amber"
                    : ""
                }`}
              >
                {String(lead[item.key])}
              </span>

            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="card-footer">

        {/* OLD LOGIC */}
        <span className="budget-pill">
          ₹{lead.Price}
        </span>

        <motion.button
          whileTap={{ scale: 0.88 }}
          className="delete-btn"
          onClick={() => {
            setPressed(true);
            setTimeout(() => {
              onDelete?.(lead);
              setPressed(false);
            }, 200);
          }}
        >
          <MdDelete size={17} />
          Remove
        </motion.button>

      </div>
    </motion.div>
  );
}

export default function FavouriteTable<T extends Record<string, any>>({
    leads,
    labelLeads,
    onEdit,
    onDelete,
}: LeadsSectionProps<T>) {
    const [toggleSearchDropdown, setToggleSearchDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsperpage = 10;

    const totalPages = Math.ceil(leads.length / itemsperpage);
    const startIndex = (currentPage - 1) * itemsperpage;
    const paginatedLeads = leads.slice(startIndex, startIndex + itemsperpage);
    const [loader, setLoader] = useState(true);
    const router = useRouter();

// console.log("fdfsdfdsfdssdf",leads[0].Price)
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    }

   const getDisplayedPages = () => {
        if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);

        if (currentPage === 1) return [1, 2, 3];
        if (currentPage === totalPages) return [totalPages - 2, totalPages - 1, totalPages];

        return [currentPage - 1, currentPage, currentPage + 1];
    };
    const pages = getDisplayedPages();


    const followupRedirect = () => {
        router.push('/followups/customer');
    }


  
    return (
        <>
         <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');

      :root {

  /* 🌿 Primary Theme */
  --primary: var(--color-primary);
  --primary-light: var(--color-primary-light);
  --primary-dark: var(--color-primary-dark);
  --accent: var(--color-accent);

  /* Backgrounds */
  --bg: var(--color-primary-lighter);
  --surface: #FFFFFF;
  --border: #D1F2E1;

  /* Text */
  --text-main: #052e1b;
  --text-sub: #166534;
  --text-muted: #6b7280;

  /* Status Colors */
  --green: #00897B;
  --green-bg: #E0F2F1;

  --amber: #F57F17;
  --amber-bg: #FFF8E1;

  /* Radius + Shadow */
  --radius: 18px;
  --radius-sm: 10px;

  --shadow: 0 4px 24px rgba(0, 104, 56, 0.10);
  --shadow-hover: 0 8px 36px rgba(0, 104, 56, 0.18);


  /* ===== Reference Colors ===== */

  --color-primary: #006838;
  --color-primary-dark: #005A30;
  --color-primary-darker: #004A27;
  --color-primary-light: #D1F2E1;
  --color-primary-lighter: #EAFBF3;

  --color-secondary: #0B7A43;
  --color-secondary-dark: #006838;
  --color-secondary-darker: #003D21;
  --color-secondary-light: #6EE7B7;

  --color-accent: #34D399;
  --color-muted: #A7F3D0;
  --color-destructive: #F87171;

  --color-gray: #6b7280;
  --color-textlightdark: #ffffff;
  --color-bglightdark: #000000;

  --table: #0B7A43;
}

       .fav-page-wrapper * {
  box-sizing: border-box;
}


        .fav-page {
          max-width: 430px;
          margin: 0 auto;
          padding: 0 0 100px;
          background: var(--bg);
          min-height: 100vh;

        }

        /* ── Page Header ── */
        .page-top {
       
          background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 60%, var(--accent) 100%);
          padding: 52px 20px 36px;
          position: relative;
          overflow: hidden;
           margin:8px;
           border-radius:10px
           
           

        }
        .page-top::before {
          content: '';
          position: absolute;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          top: -60px; right: -40px;
          
        }
        .page-top::after {
          content: '';
          position: absolute;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          bottom: 10px; left: -30px;
        }
        .page-title {
          font-family: 'Sora', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.3px;
        }
        .page-subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          margin-top: 4px;
        }
        .page-count-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          margin-top: 12px;
          backdrop-filter: blur(6px);
        }

        /* ── Cards Container ── */
        .cards-wrap {
          padding: 20px 16px 8px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* ── Card ── */
        .fav-card {
            margin: 10px 5px 10px 5px;
          background: var(--surface);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          overflow: hidden;
          transition: box-shadow 0.25s ease;
        }
        .fav-card:active {
          box-shadow: var(--shadow-hover);
        }

        /* Header */
        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(90deg, var(--primary-dark), var(--primary));
          padding: 10px 14px;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255,255,255,0.85);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.4px;
        }
        .heart-icon {
          color: #FFB3CB;
          display: flex;
        }
        .edit-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.28);
          color: #fff;
          font-size: 12px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 20px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s;
        }
        .edit-btn:active { background: rgba(255,255,255,0.3); }

        /* Body */
        .card-body { padding: 16px 16px 12px; }

        .property-name {
          font-family: 'Sora', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: -0.2px;
          line-height: 1.3;
        }
        .property-location {
          display: flex;
          align-items: start;
           flex-direction: column;
          gap: 1px;
          font-size: 12.5px;
          color: var(--text-sub);
          margin-top: 0px;
        }
        .loc-icon { color: var(--primary); flex-shrink: 0; }

        .divider {
          height: 1px;
          background: var(--border);
          margin: 12px 0;
          border-radius: 1px;
        }

        .fields-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .field-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .field-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
          min-width: 70px;
        }
        .field-value {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-main);
          text-align: right;
          flex: 1;
        }
        .status-green {
          background: var(--green-bg);
          color: var(--green);
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 600;
          display: inline-block;
        }
        .status-amber {
          background: var(--amber-bg);
          color: var(--amber);
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 600;
          display: inline-block;
        }

        /* Footer */
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px 12px;
          background:  var(--primary);
          border-top: 1px solid var(--border);
        }
        .budget-pill {
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: var(--primary-dark);
          background: var(--primary-light);
          padding: 5px 14px;
          border-radius: 20px;
        }
        .delete-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: var(--primary-light);
          border: 1px solid var(--primary-light);
          color: #D32F2F;
          font-size: 12.5px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 20px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s;
        }
        .delete-btn:active { background: #FFCDD2; }

        /* ── Empty State ── */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 64px 32px;
          text-align: center;
        }
        .empty-icon {
          width: 72px; height: 72px;
          background: var(--primary-light);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }
        .empty-title {
          font-family: 'Sora', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: var(--text-main);
        }
        .empty-sub {
          font-size: 13px;
          color: var(--text-sub);
          line-height: 1.6;
        }

        /* ── Pagination ── */
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 20px 16px 10px;
          flex-wrap: wrap;
        }
        .pg-btn {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-sub);
          display: grid;
          place-items: center;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          transition: all 0.2s;
        }
        .pg-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .pg-btn:not(:disabled):active { background: var(--primary-light); color: var(--primary); }

        .pg-num {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: var(--surface);
          border: 1px solid var(--border);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-sub);
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: all 0.22s;
          font-family: 'Sora', sans-serif;
        }
        .pg-active {
          background: linear-gradient(135deg, var(--primary-dark), var(--accent));
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(194,24,91,0.35);
          width: 38px; height: 38px;
        }
      `}</style>
            {/* LEAD CARDS */}
            <div className="fav-page-wrapper">
            <div className="fav-page">
            <div className="px-0 pb-4">
                  {/* Page Header */}
                        <div className="page-top">
                          <p className="page-subtitle">Your saved properties</p>
                          <h1 className="page-title">❤ Favourites</h1>
                          <div className="page-count-badge">
                            <FaHeart size={10} />
                            {leads.length} properties saved
                          </div>
                        </div>
                        {/* empty page */}
                {paginatedLeads.length === 0 && (
                    <div className="w-full flex justify-center items-center py-10 text-lg text-gray-500">
                          <div className="empty-state">
                                    <div className="empty-icon"><FaHeart size={30} /></div>
                                    <p className="empty-title">No favourites yet</p>
                                    <p className="empty-sub">
                                      Save properties you love and they'll appear here for quick access.
                                    </p>
                                  </div>
                    </div>
                )}
                {/* card */}
                {/* {paginatedLeads.map((lead, index) => (
                    <div key={index} className="w-full  bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 mb-0">
                        <div className="bg-[var(--color-primary)] h-2"></div>

                        <div className="flex justify-between items-start p-4">
                            <div>
                                {labelLeads.map((item, j) => (
                                    <div
                                        key={j}
                                        className="mb-2 grid grid-cols-[1fr_auto_2fr] items-center gap-2"
                                    >
                                        <span className="font-semibold text-black">
                                            {item.label}
                                        </span>

                                        <span className="text-gray-500">-</span>

                                        <span className="text-gray-700  break-words">
                                            {String(lead[item.key])}
                                        </span>
                                    </div>

                                ))}
                            </div>

                            <div className=" flex flex-col gap-4">

                                <button
                                    onClick={() => onEdit?.(lead._id)}
                                    className="p-2 bg-gray-100 rounded-full shadow text-[var(--color-primary)]"
                                >
                                    <MdEdit size={24} />

                                </button>

                            </div>



                        </div>

                        <div className="bg-[var(--color-primary)] p-3 flex justify-between">
                            { }

                            <div></div>

                            <div className="flex items-center gap-10">


                                <Button
                                    sx={{
                                        backgroundColor: "var(--color-primary)",
                                        color: "white",
                                        minWidth: "32px",
                                        height: "32px",
                                        borderRadius: "8px",
                                    }}
                                    onClick={() => onDelete?.(lead)}

                                ><MdDelete size={25} /></Button>



                            </div>
                        </div>
                    </div>
                ))} */}
                {/* new card */}
                {paginatedLeads.map((lead, index) => (
  <PropertyCard
    key={lead._id}
    lead={lead}
    index={index}
    onEdit={onEdit}
    onDelete={onDelete}
    labelLeads={labelLeads}
  />
))}
                {/* animated button */}
                {paginatedLeads.length > 0 && (
                    <div className="flex items-center justify-center w-full pt-6">
                        <div className="flex items-center space-x-2 p-2  rounded-lg">
                            <button onClick={() => setCurrentPage(1)} className=" h-[30px] w-[30px] bg-white rounded-full text-sm grid place-items-center"><AiOutlineBackward /> </button>
                            <button onClick={prevPage}
                                disabled={currentPage === 1}
                                className={`h-[30px] w-[30px] bg-white rounded-full text-sm grid place-items-center ${currentPage === 1 ? "bg-gray-200 opacity-50 cursor-not-allowed" : "bg-white "}`}><GrFormPrevious /></button>
                            <AnimatePresence mode="popLayout">
                                {pages.map((num, i) => (
                                    <motion.button
                                        key={i}
                                        onClick={() => setCurrentPage(num)}
                                        className={`h-[30px] w-[30px]  rounded-full text-sm grid place-items-center  ${num === currentPage ? " bg-[var(--color-primary)] text-white w-[35px] h-[35px]" : "bg-white text-black w-[30px] h-[30px]"
                                            }`}>
                                        {num}
                                    </motion.button>
                                ))}
                            </AnimatePresence>

                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className={`h-[30px] w-[30px] bg-white rounded-full text-sm grid place-items-center ${currentPage === totalPages ? "bg-gray-200 opacity-50 cursor-not-allowed" : "bg-white "}`}><GrFormNext /> </button>
                            <button onClick={() => setCurrentPage(totalPages)} className=" h-[30px] w-[30px] bg-white rounded-full text-sm grid place-items-center"><AiOutlineForward /> </button>
                        </div>
                    </div>)}
            </div>
            </div>
            </div>
            {/* <div>
        <button onClick={prevPage} 
        disabled = {currentPage === 1}
          className={`px-2 py-2 rounded-full border
      ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[var(--color-primary)] text-white"}
    `}>prev</button>
     <button onClick={nextPage} 
        disabled = {currentPage === totalPages}
          className={`px-4 py-2 rounded-xl border
      ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-[var(--color-primary)] text-white"}
    `}>next</button>
      </div> */}

        </>
    );
}
