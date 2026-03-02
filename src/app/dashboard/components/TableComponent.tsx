import React, { useEffect, useState } from 'react'
import { useDashboardData } from '../data/useDashboardSectionOne';
import { getLocation } from '@/store/masters/location/location';
import { getProperty } from '@/store/property';
import { MapPin, TrendingUp, Building2 } from 'lucide-react';

function TableComponent() {
  // ── All original state & logic — UNCHANGED ───────────────────────────────────
  const { locationStats, setLocationStats } = useDashboardData();
  const [loading, setLoading] = useState(true);

  const fetchLocationStats = async () => {
    try {
      setLoading(true);
      const locations = await getLocation();
      const customers = await getProperty();

      const locationMap: Record<string, number> = {};
      locations.forEach((loc: any) => { locationMap[loc.Name] = 0; });
      customers.forEach((customer: any) => {
        const loc = customer.Location || "Unknown";
        if (locationMap[loc] !== undefined) locationMap[loc] += 1;
      });

      const locationArray = Object.entries(locationMap).map(([location, count]) => ({
        location,
        customers: count,
      }));
      locationArray.sort((a, b) => b.customers - a.customers);
      setLocationStats(locationArray);
    } catch (error) {
      console.error("Error fetching location stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLocationStats(); }, []);

  // ── Derived: max for progress bar scaling ───────────────────────────────────
  const maxCount = locationStats.length > 0
    ? Math.max(...locationStats.map(d => d.customers), 1)
    : 1;

  // ── Rank colors ──────────────────────────────────────────────────────────────
  const rankStyle = (i: number) => {
    if (i === 0) return { bg: '#FFD700', text: '#78350F' };
    if (i === 1) return { bg: '#C0C0C0', text: '#374151' };
    if (i === 2) return { bg: '#CD7F32', text: '#fff' };
    return { bg: 'var(--color-primary-lighter,#EAFBF3)', text: 'var(--color-primary,#006838)' };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes row-slide {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes bar-fill {
          from { width: 0%; }
          to   { width: var(--bar-w); }
        }
        @keyframes shimmer-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        .loc-row {
          animation: row-slide 0.35s ease both;
          font-family: 'DM Sans', sans-serif;
        }
        .loc-bar {
          animation: bar-fill 0.9s ease both;
        }
        .shimmer-box {
          animation: shimmer-pulse 1.4s ease infinite;
        }
        /* custom scrollbar */
        .loc-scroll::-webkit-scrollbar { width: 3px; }
        .loc-scroll::-webkit-scrollbar-track { background: transparent; }
        .loc-scroll::-webkit-scrollbar-thumb {
          background: rgba(0,104,56,0.2);
          border-radius: 4px;
        }
      `}</style>

      <div
        className="
          w-full max-w-full sm:max-w-[500px] mx-auto overflow-hidden rounded-2xl
          bg-white dark:bg-[#0d1f14]
          border border-[var(--color-primary-light)] dark:border-[#1a3a24]
          shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        "
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >

        {/* ── Header ── */}
        <div className="
          px-5 pt-5 pb-4
          border-b border-[var(--color-primary-light)] dark:border-[#1a3a24]
          bg-[var(--color-primary-lighter)] dark:bg-[#091510]
        ">
          <div className="flex items-center justify-between">
            {/* Title block */}
            <div className="flex items-center gap-3">
              <div className="
                w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]
                shadow-md
              ">
                <MapPin size={16} color="#fff" />
              </div>
              <div>
                <p className="text-[10px] font-700 tracking-widest uppercase mb-0.5
                  text-[var(--color-primary)] dark:text-[#6EE7B7]
                ">
                  Location Insights
                </p>
                <h2
                  className="leading-tight text-[var(--color-secondary-darker)] dark:text-white"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700 }}
                >
                  Top Locations
                </h2>
              </div>
            </div>

            {/* Count pill */}
            <div className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-700
              bg-white dark:bg-[#0d1f14]
              border border-[var(--color-primary-light)] dark:border-[#1a3a24]
              text-[var(--color-primary)] dark:text-[#6EE7B7]
              shadow-sm
            ">
              <Building2 size={11} />
              {locationStats.length} locations
            </div>
          </div>

          {/* Column labels */}
          {!loading && locationStats.length > 0 && (
            <div className="flex items-center justify-between mt-4 px-1">
              <span className="text-[11px] font-700 uppercase tracking-wider
                text-[#9CA3AF] dark:text-[#6b7280]
              ">
                Location
              </span>
              <span className="text-[11px] font-700 uppercase tracking-wider
                text-[#9CA3AF] dark:text-[#6b7280]
              ">
                Properties
              </span>
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="loc-scroll max-h-[280px] overflow-y-auto px-4 py-3 space-y-1">

          {/* Loading skeleton */}
          {loading ? (
            <div className="py-6 space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="shimmer-box flex items-center justify-between gap-3"
                  style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-7 h-7 rounded-lg
                      bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24]
                    " />
                    <div className="h-3 rounded-full flex-1
                      bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24]
                    " />
                  </div>
                  <div className="w-8 h-3 rounded-full
                    bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24]
                  " />
                </div>
              ))}
              <p className="text-center text-xs pt-2
                text-[#9CA3AF] dark:text-[#6b7280]
              ">
                Fetching locations…
              </p>
            </div>
          ) : locationStats.length === 0 ? (
            <div className="py-10 flex flex-col items-center gap-3">
              <MapPin size={32} className="text-[var(--color-primary-light)] dark:text-[#1a3a24] opacity-60" />
              <p className="text-sm text-[#9CA3AF] dark:text-[#6b7280] font-500">
                No location data found
              </p>
            </div>
          ) : (
            locationStats.map((data, index) => {
              const barPct = Math.round((data.customers / maxCount) * 100);
              const rank = rankStyle(index);

              return (
                <div
                  key={index}
                  className="loc-row group flex items-center gap-3 px-3 py-3 rounded-xl cursor-default
                    hover:bg-[var(--color-primary-lighter)] dark:hover:bg-[#1a3a24]
                    transition-all duration-200
                    border border-transparent hover:border-[var(--color-primary-light)] dark:hover:border-[#2d5c3a]
                  "
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* Rank badge */}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-800 shadow-sm"
                    style={{ background: rank.bg, color: rank.text, fontWeight: 800 }}
                  >
                    {index + 1}
                  </div>

                  {/* Location + bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-600 truncate
                        text-[var(--color-secondary-darker)] dark:text-white
                        group-hover:text-[var(--color-primary)] dark:group-hover:text-[#6EE7B7]
                        transition-colors duration-200
                      ">
                        {data.location}
                      </span>
                      <span className="
                        text-[12px] font-700 ml-2 flex-shrink-0 tabular-nums
                        text-[var(--color-primary)] dark:text-[#6EE7B7]
                      ">
                        {data.customers}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 rounded-full overflow-hidden
                      bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24]
                    ">
                      <div
                        className="loc-bar h-full rounded-full"
                        style={{
                          '--bar-w': `${barPct}%`,
                          background: index === 0
                            ? 'linear-gradient(90deg, var(--color-primary), #34D399)'
                            : index === 1
                            ? 'linear-gradient(90deg, var(--color-primary-dark), var(--color-primary))'
                            : 'linear-gradient(90deg, var(--color-primary-lighter), var(--color-primary-light))',
                          animationDelay: `${index * 80 + 200}ms`,
                        } as React.CSSProperties}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Footer ── */}
        {!loading && locationStats.length > 0 && (
          <div className="
            px-5 py-3
            border-t border-[var(--color-primary-light)] dark:border-[#1a3a24]
            bg-[var(--color-primary-lighter)] dark:bg-[#091510]
            flex items-center justify-between
          ">
            <div className="flex items-center gap-2">
              <TrendingUp size={13} className="text-[var(--color-primary)] dark:text-[#6EE7B7]" />
              <span className="text-[12px] font-600
                text-[var(--color-primary)] dark:text-[#6EE7B7]
              ">
                Top: <span className="font-700">{locationStats[0]?.location}</span>
              </span>
            </div>
            <span className="text-[11px]
              text-[#9CA3AF] dark:text-[#6b7280]
            ">
              {locationStats.reduce((s, d) => s + d.customers, 0)} total
            </span>
          </div>
        )}

      </div>
    </>
  );
}

export default TableComponent;