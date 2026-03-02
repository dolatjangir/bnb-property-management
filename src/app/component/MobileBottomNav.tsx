"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  pTag: string;
  icon: React.ReactNode;
  url: string;
  gradient: string;
}

interface MobileBottomNavProps {
  items: NavItem[];
}

export default function MobileBottomNav({ items }: MobileBottomNavProps) {
  const pathname = usePathname();
  const activeIndex = items.findIndex((item) => pathname.startsWith(item.url));
  const hasActive = activeIndex !== -1;

  const navRef = useRef<HTMLDivElement>(null);
  const [pillLeft, setPillLeft] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const PILL_SIZE = 56;
  const navHeight = 64;
  const svgW = 400;

  useEffect(() => {
    // If no item is active, hide the pill and notch entirely
    if (!hasActive) {
      setPillLeft(null);
      return;
    }

    const el = itemRefs.current[activeIndex];
    const nav = navRef.current;
    if (!el || !nav) return;

    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setPillLeft(elRect.left - navRect.left + elRect.width / 2);
  }, [activeIndex, hasActive, pathname]);

  const activeItem = hasActive ? items[activeIndex] : null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-10 sm:hidden backdrop-blur-xl"
      style={{ height: navHeight }}
    >
      <style>{`
        @keyframes bnav-ring {
          0%   { opacity:.28; transform:scale(1);   }
          65%  { opacity:0;   transform:scale(1.6); }
          100% { opacity:0;   transform:scale(1.6); }
        }
        .pill-pulse::after {
          content:'';
          position:absolute;
          inset:0;
          border-radius:9999px;
          background:inherit;
          z-index:-1;
          animation:bnav-ring 2.4s ease-out infinite;
        }
        .bnav-link:active > div { transform: translateY(-14px) scale(0.92) !important; }
      `}</style>

      {/* Notched white SVG background — only shown when an item is active */}
      {pillLeft !== null && (
        <svg
          aria-hidden
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${svgW} ${navHeight}`}
          preserveAspectRatio="none"
          style={{ filter: "drop-shadow(0 -4px 16px rgba(0,0,0,0.09))" }}
        >
          <NotchShape
            svgW={svgW}
            navHeight={navHeight}
            pillLeft={pillLeft}
            navRef={navRef}
          />
        </svg>
      )}

      {/* Flat white bar — shown when no active item OR before first measurement */}
      {pillLeft === null && (
        <div className="absolute inset-0 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.09)]" />
      )}

      {/* Floating pill — only rendered when there's an active item */}
      {activeItem && (
        <div
          aria-hidden
          className="absolute pointer-events-none rounded-full pill-pulse"
          style={{
            top: "50%",
            transform: "translateY(calc(-50% - 16px))",
            left: pillLeft !== null ? pillLeft - PILL_SIZE / 2 : -999,
            width: PILL_SIZE,
            height: PILL_SIZE,
            transition: "left 0.4s cubic-bezier(0.34,1.2,0.64,1), opacity 0.2s ease",
            opacity: pillLeft !== null ? 1 : 0,
            outline: "4px solid #EAFBF3",
            outlineOffset: "0px",
            boxShadow: "0 8px 28px -4px rgba(0,0,0,0.28)",
          }}
        >
          <div
            className={`relative w-full h-full rounded-full bg-gradient-to-br ${activeItem.gradient}`}
          />
        </div>
      )}

      {/* Nav items */}
      <div
        ref={navRef}
        className="relative flex items-center h-full"
        style={{ paddingBottom: "env(safe-area-inset-bottom,0px)" }}
      >
        {items.map((item, idx) => {
          const isActive = activeIndex === idx;

          return (
            <Link
              key={item.url}
              href={item.url}
              ref={(el) => { itemRefs.current[idx] = el; }}
              className="bnav-link relative flex flex-col items-center justify-center flex-1 h-full gap-0.5 [-webkit-tap-highlight-color:transparent]"
            >
              {/* Icon — only lifts when this specific item is active */}
              <div
                className={[
                  "relative z-10 flex items-center justify-center rounded-full",
                  "transition-[transform,color] duration-[370ms] [transition-timing-function:cubic-bezier(0.34,1.4,0.64,1)]",
                  isActive
                    ? "text-white -translate-y-4 scale-110"
                    : "text-zinc-400 translate-y-0 scale-100",
                ].join(" ")}
              >
                {item.icon}
              </div>

              {/* Label — only lifts when this specific item is active */}
              <span
                className={[
                  "relative z-10 text-[8px] font-semibold tracking-tight leading-none",
                  "transition-[color,transform,opacity] duration-[370ms] [transition-timing-function:cubic-bezier(0.34,1.4,0.64,1)]",
                  isActive
                    ? "text-white opacity-100 -translate-y-4"
                    : "text-zinc-400 opacity-80 translate-y-0",
                ].join(" ")}
              >
                {item.pTag}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function NotchShape({
  svgW,
  navHeight,
  pillLeft,
  navRef,
}: {
  svgW: number;
  navHeight: number;
  pillLeft: number;
  navRef: React.RefObject<HTMLDivElement | null>;
}) {
  const navWidth = navRef.current?.getBoundingClientRect().width ?? window.innerWidth;
  const cx = (pillLeft / navWidth) * svgW;

  const r = 32;
const depth = 34;   // was 20 → deeper notch
const curveW = r + 18; // slightly wider to keep curve smooth


  const d = [
    `M0,0`,
    `H${cx - curveW}`,
    `C${cx - r - 4},0 ${cx - r},${depth * 0.5} ${cx - r + 2},${depth * 0.85}`,
    `A${r},${r} 0 0,0 ${cx + r - 2},${depth * 0.85}`,
    `C${cx + r},${depth * 0.5} ${cx + r + 4},0 ${cx + curveW},0`,
    `H${svgW}`,
    `V${navHeight}`,
    `H0`,
    `Z`,
  ].join(" ");

  return <path d={d} fill="white" />;
}