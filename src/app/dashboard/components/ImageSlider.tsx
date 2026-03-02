"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface CardData {
  company: string;
  image: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
}

const cards: CardData[] = [
  {
    company: "Bedquest",
    image: "/crm-sliderImage.jfif",
    title: "We Made A Community Mural With AI",
    description:
      "Using tools like geofencing and keyword retargeting, we target customers based on location and behavior.",
    tags: ["CEO", "SEO", "Branding"],
    link: "#",
  },
  {
    company: "Apple",
    image: "/crm-siderImage7.png",
    title: "Reimagining Retail Experience",
    description:
      "Apple redefined in-store customer interactions using AR and personalized AI assistants.",
    tags: ["AR", "UX", "Retail"],
    link: "#",
  },
  {
    company: "Google",
    image: "/crm-sliderImage22.webp",
    title: "AI-Powered Workspace Tools",
    description:
      "Google Workspace now leverages AI to automate workflow and increase team productivity.",
    tags: ["AI", "Cloud", "Productivity"],
    link: "#",
  },
];

const SWIPE_THRESHOLD = 40;
const DRAG_RESISTANCE = 0.28;

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging]     = useState(false);
  // animKey increments each time we land on a new slide → triggers CSS re-animation
  const [animKey, setAnimKey]           = useState(0);

  const currentIndexRef = useRef(0);
  const isDraggingRef   = useRef(false);
  const isHorizontalRef = useRef<boolean | null>(null);
  const touchStartXRef  = useRef(0);
  const touchStartYRef  = useRef(0);
  const autoplayRef     = useRef<NodeJS.Timeout | null>(null);
  const rootRef         = useRef<HTMLDivElement>(null);  // the clip viewport
  const stageRef        = useRef<HTMLDivElement>(null);  // the scrolling stage (overflow visible)
  const slideWidthRef   = useRef(0);

  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  // ── Position slides imperatively ──────────────────────────────────────────
  // The STAGE is overflow:visible and wider than the viewport.
  // Each slide is a normal block child of the stage, same width as the viewport.
  // We translate the STAGE left/right to show the right slide.
  // The ROOT clips the stage — but the slides' *content* stays within their own
  // full-width box, so nothing clips awkwardly.
  const positionStage = useCallback((dragOffsetPx = 0, animate = false) => {
    if (!stageRef.current) return;
    const W   = slideWidthRef.current;
    const cur = currentIndexRef.current;
    const px  = cur * -W + dragOffsetPx;
    stageRef.current.style.transition = animate
      ? "transform 0.42s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      : "none";
    stageRef.current.style.transform = `translateX(${px}px)`;
  }, []);

  // ── Measure + initial position ────────────────────────────────────────────
  useEffect(() => {
    const measure = () => {
      if (rootRef.current) {
        slideWidthRef.current = rootRef.current.getBoundingClientRect().width;
        positionStage(0, false);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [positionStage]);

  // ── Land on a slide (used by autoplay, goTo, swipe end) ──────────────────
  const landOn = useCallback((next: number, animate = true) => {
    const clamped = Math.max(0, Math.min(cards.length - 1, next));
    currentIndexRef.current = clamped;
    setCurrentIndex(clamped);
    setAnimKey(k => k + 1); // re-trigger CSS content animation
    requestAnimationFrame(() => positionStage(0, animate));
  }, [positionStage]);

  // ── Autoplay ──────────────────────────────────────────────────────────────
  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      landOn((currentIndexRef.current + 1) % cards.length);
    }, 4000);
  }, [landOn]);

  useEffect(() => {
    startAutoplay();
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [startAutoplay]);

  const goTo = useCallback((idx: number) => {
    landOn(idx);
    startAutoplay();
  }, [landOn, startAutoplay]);

  // ── Native touch listeners ────────────────────────────────────────────────
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartXRef.current  = e.touches[0].clientX;
      touchStartYRef.current  = e.touches[0].clientY;
      isHorizontalRef.current = null;
      isDraggingRef.current   = true;
      setIsDragging(true);
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      // Remove transition so stage follows finger instantly
      if (stageRef.current) stageRef.current.style.transition = "none";
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.touches[0].clientX - touchStartXRef.current;
      const dy = e.touches[0].clientY - touchStartYRef.current;

      if (isHorizontalRef.current === null) {
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5)       isHorizontalRef.current = true;
        else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 5)  isHorizontalRef.current = false;
        else return;
      }

      if (isHorizontalRef.current === false) return;

      e.preventDefault();

      const idx     = currentIndexRef.current;
      const atStart = idx === 0 && dx > 0;
      const atEnd   = idx === cards.length - 1 && dx < 0;
      positionStage(atStart || atEnd ? dx * DRAG_RESISTANCE : dx, false);
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);

      const idx = currentIndexRef.current;

      if (isHorizontalRef.current !== true) {
        positionStage(0, true);
        startAutoplay();
        return;
      }

      const dx = e.changedTouches[0].clientX - touchStartXRef.current;

      if (Math.abs(dx) > SWIPE_THRESHOLD) {
        const next = dx < 0
          ? Math.min(idx + 1, cards.length - 1)
          : Math.max(idx - 1, 0);
        landOn(next);
      } else {
        positionStage(0, true);
      }

      startAutoplay();
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true  });
    el.addEventListener("touchmove",  onTouchMove,  { passive: false });
    el.addEventListener("touchend",   onTouchEnd,   { passive: true  });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove",  onTouchMove);
      el.removeEventListener("touchend",   onTouchEnd);
    };
  }, [positionStage, landOn, startAutoplay]);

  // ── Mouse drag ────────────────────────────────────────────────────────────
  const mouseStartX = useRef(0);
  const mouseDown   = useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    mouseDown.current   = true;
    mouseStartX.current = e.clientX;
    setIsDragging(true);
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    if (stageRef.current) stageRef.current.style.transition = "none";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!mouseDown.current) return;
    const dx      = e.clientX - mouseStartX.current;
    const idx     = currentIndexRef.current;
    const atStart = idx === 0 && dx > 0;
    const atEnd   = idx === cards.length - 1 && dx < 0;
    positionStage(atStart || atEnd ? dx * DRAG_RESISTANCE : dx, false);
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!mouseDown.current) return;
    mouseDown.current = false;
    setIsDragging(false);
    const dx  = e.clientX - mouseStartX.current;
    const idx = currentIndexRef.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      const next = dx < 0
        ? Math.min(idx + 1, cards.length - 1)
        : Math.max(idx - 1, 0);
      landOn(next);
    } else {
      positionStage(0, true);
    }
    startAutoplay();
  };

  const onMouseLeave = () => {
    if (mouseDown.current) {
      mouseDown.current = false;
      setIsDragging(false);
      positionStage(0, true);
      startAutoplay();
    }
  };

  return (
    <>
      <style>{`
        /* ── Clip viewport ── */
        .sl-root {
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 280px;
          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
        }
        @media (min-width: 640px) { .sl-root { height: 320px; } }

        /*
          Stage: a flex row of slides, each exactly viewport-wide.
          It lives OUTSIDE the root's overflow:hidden because it's a child,
          but its OWN overflow is visible — slides' content won't get clipped
          by each other. Only the root clips what's outside the viewport.
        */
        .sl-stage {
          display: flex;
          flex-direction: row;
          height: 100%;
          width: 100%;        /* will stretch to fit all slides via children */
          will-change: transform;
        }

        /* Each slide is exactly the viewport width */
        .sl-slide {
          flex: 0 0 100%;     /* exactly one viewport width */
          width: 100vw;       /* fallback */
          height: 100%;
          position: relative;
          overflow: hidden;   /* clip the image within the slide box */
        }

        /* ── Content entry animation ── */
        .sl-content-wrap {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 24px;
          pointer-events: none;
        }
        @media (min-width: 640px) { .sl-content-wrap { padding: 32px; } }

        /* All content children animate in when .sl-animate is added */
        .sl-animate .sl-badge   { animation: sl-fadeUp 0.45s 0.05s both ease-out; }
        .sl-animate .sl-title   { animation: sl-fadeUp 0.45s 0.15s both ease-out; }
        .sl-animate .sl-desc    { animation: sl-fadeUp 0.45s 0.25s both ease-out; }
        .sl-animate .sl-tags    { animation: sl-fadeUp 0.45s 0.35s both ease-out; }

        @keyframes sl-fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        .sl-root * { -webkit-tap-highlight-color: transparent; }
      `}</style>

      <section className="relative text-white">
        <div
          ref={rootRef}
          className="sl-root"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          {/* Stage — translates left/right to reveal slides */}
          <div ref={stageRef} className="sl-stage">
            {cards.map((card, idx) => (
              <div className="sl-slide" key={idx}>
                {/* Full-bleed image */}
                <img
                  src={card.image}
                  alt={card.title}
                  className="object-cover w-full h-full"
                  draggable={false}
                />

                {/* Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

                {/*
                  Content wrapper — key={animKey} remounts only the ACTIVE slide's
                  content so the CSS animation always replays on slide change.
                  Inactive slides keep their content static (no flicker).
                */}
                <div
                  className={`sl-content-wrap ${idx === currentIndex ? "sl-animate" : ""}`}
                  key={idx === currentIndex ? `active-${animKey}` : `idle-${idx}`}
                >
                  <div className="sl-badge mb-3">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md border border-white/30 text-white">
                      {card.company}
                    </span>
                  </div>

                  <h2 className="sl-title text-white text-2xl sm:text-3xl font-bold leading-tight mb-3 drop-shadow-2xl max-w-md">
                    {card.title}
                  </h2>

                  <p className="sl-desc text-white/90 text-sm sm:text-base leading-relaxed mb-4 max-w-lg drop-shadow-lg line-clamp-2">
                    {card.description}
                  </p>

                  <div className="sl-tags flex gap-2 flex-wrap">
                    {card.tags.map((tag, tidx) => (
                      <span
                        key={tidx}
                        className="px-3 py-1 text-xs font-medium bg-white/10 backdrop-blur-sm rounded-full text-white border border-white/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Vertical dot indicators */}
          <div className="absolute top-1/2 -translate-y-1/2 right-3 flex flex-col gap-1.5 z-10 pointer-events-auto">
            {cards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? "h-6 w-2 bg-white"
                    : "h-2 w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}