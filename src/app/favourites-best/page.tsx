"use client"
import { JSX, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdEdit, MdDelete, MdFavorite, MdHome, MdLocationOn, MdPerson } from "react-icons/md";
import { AiOutlineBackward, AiOutlineForward } from "react-icons/ai";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { FaHeart } from "react-icons/fa";

// ─── Demo data ────────────────────────────────────────────────────────────────
const sampleLeads = Array.from({ length: 9 }, (_, i) => ({
  _id: `id_${i}`,
  PropertyName: `Sunset Villa ${i + 1}`,
  Location: `Bandra West, Mumbai`,
  OwnerName: `Rajesh Sharma`,
  Budget: `₹${(45 + i * 5).toFixed(0)} Lakhs`,
  Status: i % 2 === 0 ? "Available" : "Negotiating",
}));

const labelLeads = [
  { label: "Property", key: "PropertyName" },
  { label: "Location", key: "Location" },
  { label: "Owner", key: "OwnerName" },
  { label: "Budget", key: "Budget" },
  { label: "Status", key: "Status" },
];

const ITEMS_PER_PAGE = 4;


type FieldKey = "PropertyName" | "Location" | "OwnerName";
// ─── Icon helper ──────────────────────────────────────────────────────────────
const fieldIcon = (key:any) => {
  const map: Record<FieldKey, JSX.Element>  = {
    PropertyName: <MdHome size={13} />,
    Location: <MdLocationOn size={13} />,
    OwnerName: <MdPerson size={13} />,
  };
  return map[key] ?? null;
};

// ─── Single Card ──────────────────────────────────────────────────────────────
function PropertyCard({ lead, index, onEdit, onDelete }:any) {
  const [pressed, setPressed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.32, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="fav-card"
    >
      {/* ── Header strip ─────────────────────────────── */}
      <div className="card-header">
        <div className="header-left">
          <span className="heart-icon"><FaHeart size={12} /></span>
          <span className="header-label">Saved Property</span>
        </div>
        <button
          className="edit-btn"
          onClick={() => onEdit?.(lead._id)}
          aria-label="Edit"
        >
          <MdEdit size={16} />
          <span>Edit</span>
        </button>
      </div>

      {/* ── Body ─────────────────────────────────────── */}
      <div className="card-body">
        <h2 className="property-name">{lead.PropertyName}</h2>
        <p className="property-location">
          <MdLocationOn size={14} className="loc-icon" />
          {lead.Location}
        </p>

        <div className="divider" />

        <div className="fields-grid">
          {labelLeads
            .filter((f) => !["PropertyName", "Location"].includes(f.key))
            .map((item) => (
              <div key={item.key} className="field-row">
                <span className="field-label">
                  {fieldIcon(item.key)}
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

      {/* ── Footer ───────────────────────────────────── */}
      <div className="card-footer">
        <span className="budget-pill">{lead.Budget}</span>
        <motion.button
          whileTap={{ scale: 0.88 }}
          className="delete-btn"
          onClick={() => {
            setPressed(true);
            setTimeout(() => { onDelete?.(lead); setPressed(false); }, 200);
          }}
          aria-label="Remove from favourites"
        >
          <MdDelete size={17} />
          Remove
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, setCurrentPage }:any) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        className="pg-btn"
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
      >
        <AiOutlineBackward size={14} />
      </button>
      <button
        className="pg-btn"
        onClick={() => setCurrentPage((p:any) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
      >
        <GrFormPrevious size={14} />
      </button>

      <AnimatePresence mode="popLayout">
        {pages.map((num) => (
          <motion.button
            key={num}
            layout
            onClick={() => setCurrentPage(num)}
            className={`pg-num ${num === currentPage ? "pg-active" : ""}`}
            whileTap={{ scale: 0.9 }}
          >
            {num}
          </motion.button>
        ))}
      </AnimatePresence>

      <button
        className="pg-btn"
        onClick={() => setCurrentPage((p:any) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
      >
        <GrFormNext size={14} />
      </button>
      <button
        className="pg-btn"
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
      >
        <AiOutlineForward size={14} />
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FavouritesPage() {
  const [leads] = useState(sampleLeads);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(leads.length / ITEMS_PER_PAGE);
  const paginated = leads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');

        :root {
          --primary: #C2185B;
          --primary-light: #F8BBD9;
          --primary-dark: #880E4F;
          --accent: #FF6090;
          --bg: #FDF0F5;
          --surface: #FFFFFF;
          --border: #F3C6D8;
          --text-main: #1A0A10;
          --text-sub: #7B5265;
          --text-muted: #B48A9B;
          --green: #00897B;
          --green-bg: #E0F2F1;
          --amber: #F57F17;
          --amber-bg: #FFF8E1;
          --radius: 18px;
          --radius-sm: 10px;
          --shadow: 0 4px 24px rgba(194,24,91,0.10);
          --shadow-hover: 0 8px 36px rgba(194,24,91,0.18);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          min-height: 100vh;
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
          align-items: center;
          gap: 3px;
          font-size: 12.5px;
          color: var(--text-sub);
          margin-top: 4px;
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
          background: #FDF0F5;
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
          background: #FFF0F3;
          border: 1px solid #FFCCD5;
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

      <div className="fav-page">
        {/* Page Header */}
        <div className="page-top">
          <p className="page-subtitle">Your saved properties</p>
          <h1 className="page-title">❤ Favourites</h1>
          <div className="page-count-badge">
            <FaHeart size={10} />
            {leads.length} properties saved
          </div>
        </div>

        {/* Empty State */}
        {leads.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon"><FaHeart size={30} /></div>
            <p className="empty-title">No favourites yet</p>
            <p className="empty-sub">
              Save properties you love and they'll appear here for quick access.
            </p>
          </div>
        )}

        {/* Cards */}
        {paginated.length > 0 && (
          <div className="cards-wrap">
            <AnimatePresence mode="popLayout">
              {paginated.map((lead, index) => (
                <PropertyCard
                  key={lead._id}
                  lead={lead}
                  index={index}
                  onEdit={(id:any) => console.log("Edit", id)}
                  onDelete={(l:any) => console.log("Delete", l)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </>
  );
}