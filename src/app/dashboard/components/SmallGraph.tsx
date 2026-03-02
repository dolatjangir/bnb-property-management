import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// ── Data unchanged ─────────────────────────────────────────────────────────────
const data = [
  { name: 'Sep', projects: 10, earnings: 10.6 },
  { name: 'Oct', projects: 14, earnings: 14.2 },
  { name: 'Nov', projects: 15, earnings: 20.5 },
  { name: 'Dec', projects: 16, earnings: 18.3 },
];

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(0,10,4,0.92)',
        border: '1px solid rgba(52,211,153,0.3)',
        borderRadius: 12,
        padding: '10px 16px',
        backdropFilter: 'blur(8px)',
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <p style={{ color: '#6EE7B7', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
          {label}
        </p>
        {payload.map((entry: any, i: number) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: i === 0 ? '#34D399' : 'rgba(255,255,255,0.7)',
              flexShrink: 0,
            }} />
            <span style={{ color: '#9CA3AF', fontSize: 12 }}>{entry.name}:</span>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ── Main Component ─────────────────────────────────────────────────────────────
const Dashboard = () => {
  const maxVal = Math.max(...data.map(d => Math.max(d.projects, d.earnings)));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes chart-rise {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0.5); }
          50%       { box-shadow: 0 0 0 6px rgba(52,211,153,0); }
        }
        .chart-widget {
          animation: chart-rise 0.5s ease both;
          font-family: 'DM Sans', sans-serif;
        }
        .stat-divider {
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(52,211,153,0.4), transparent);
          align-self: stretch;
        }
        .stat-box:hover .stat-value {
          color: #34D399 !important;
        }
        .legend-dot {
          animation: pulse-dot 2.5s infinite;
        }
      `}</style>

      <div className="chart-widget h-full lg:w-[440px] overflow-hidden rounded-2xl
        bg-white dark:bg-[#0d1f14]
        border border-[var(--color-primary-light)] dark:border-[#1a3a24]
        shadow-md dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
      ">

        {/* ── Chart area ── */}
        <div className="relative w-full overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #004A27 0%, #006838 45%, #0B7A43 100%)',
          }}
        >
          {/* Top: header row */}
          <div className="flex items-center justify-between px-5 pt-5 pb-2">
            <div>
              <p className="text-[11px] font-700 tracking-widest uppercase text-[#6EE7B7] mb-0.5">
                Monthly Overview
              </p>
              <h3 className="text-white font-bold leading-tight"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 18 }}
              >
                Followups by Month
              </h3>
            </div>

            {/* Legend pills */}
            <div className="flex flex-col gap-1.5">
              {[
                { label: 'Projects', dot: '#34D399' },
                { label: 'Earnings', dot: 'rgba(255,255,255,0.65)' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className="legend-dot w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: l.dot }} />
                  <span className="text-[11px] font-600 text-white/70">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="w-full h-[250px] sm:h-[280px] md:h-[310px] lg:h-[260px] xl:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 24, left: 0, bottom: 8 }}
                barGap={4}
              >
                <CartesianGrid
                  strokeDasharray="0"
                  stroke="rgba(255,255,255,0.1)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
                />
                <YAxis
                  type="number"
                  domain={[6, 18]}
                  ticks={[6, 8, 10, 12, 14, 16, 18]}
                  tickCount={7}
                  axisLine={false}
                  tickLine={false}
                  allowDataOverflow={true}
                  width={30}
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}
                  allowDecimals={false}
                  interval={0}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 4 }}
                  content={<CustomTooltip />}
                />
                {/* Projects bars — bright accent green */}
                <Bar dataKey="projects" name="Projects" barSize={14} radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-proj-${index}`}
                      fill={entry.projects === Math.max(...data.map(d => d.projects))
                        ? '#34D399'
                        : 'rgba(52,211,153,0.55)'}
                    />
                  ))}
                </Bar>
                {/* Earnings bars — white/frosted */}
                <Bar dataKey="earnings" name="Earnings ($M)" barSize={14} radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-earn-${index}`}
                      fill={entry.earnings === Math.max(...data.map(d => d.earnings))
                        ? 'rgba(255,255,255,0.95)'
                        : 'rgba(255,255,255,0.35)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,40,22,0.3))' }}
          />
        </div>

        {/* ── Footer stats ── */}
        <div className="
          bg-white dark:bg-[#0d1f14]
          border-t border-[var(--color-primary-light)] dark:border-[#1a3a24]
          px-5 py-4
        ">
          {/* Label row */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[var(--color-primary)] to-[#34D399]" />
            <p className="text-xs font-700 tracking-widest uppercase
              text-[var(--color-secondary-darker)] dark:text-[#6EE7B7]
            ">
              Followups by months
            </p>
          </div>

          {/* Stats row */}
          <div className="flex items-stretch justify-around gap-2 py-2">

            {/* This Month */}
            <div className="stat-box flex flex-col items-center gap-1 flex-1 px-2 py-3 rounded-xl
              hover:bg-[var(--color-primary-lighter)] dark:hover:bg-[#1a3a24]
              transition-colors duration-200 cursor-default
            ">
              <p className="text-[11px] font-600 uppercase tracking-wider
                text-[#9CA3AF] dark:text-[#6b7280]
              ">
                This Month
              </p>
              <p className="stat-value text-2xl font-bold leading-none transition-colors duration-200
                text-[var(--color-secondary-darker)] dark:text-white
              "
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                2
              </p>
              {/* Mini trend */}
              <span className="text-[10px] font-700 px-2 py-0.5 rounded-full
                bg-[var(--color-primary-lighter)] dark:bg-[#1a3a24]
                text-[var(--color-primary)] dark:text-[#6EE7B7]
              ">
                ↑ Active
              </span>
            </div>

            {/* Divider */}
            <div className="stat-divider" />

            {/* Next Month */}
            <div className="stat-box flex flex-col items-center gap-1 flex-1 px-2 py-3 rounded-xl
              hover:bg-[var(--color-primary-lighter)] dark:hover:bg-[#1a3a24]
              transition-colors duration-200 cursor-default
            ">
              <p className="text-[11px] font-600 uppercase tracking-wider
                text-[#9CA3AF] dark:text-[#6b7280]
              ">
                Next Month
              </p>
              <p className="stat-value text-2xl font-bold leading-none transition-colors duration-200
                text-[var(--color-secondary-darker)] dark:text-white
              "
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                1
              </p>
              <span className="text-[10px] font-700 px-2 py-0.5 rounded-full
                bg-[#FEF9C3] dark:bg-[#2d2a0a]
                text-[#854D0E] dark:text-[#FCD34D]
              ">
                ↗ Upcoming
              </span>
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default Dashboard;