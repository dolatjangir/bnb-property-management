"use client";

import { useState, useRef, useEffect } from "react";

interface ImageSliderProps {
  images: string[];
  autoPlay?: boolean;
  interval?: number; // milliseconds
}

export default function FoodImageSlider({
  images,
  autoPlay = true,
  interval = 4000,
}: ImageSliderProps) {
  const [current, setCurrent] = useState<number>(0);
  const startX = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null); // browser-safe

  if (!images || images.length === 0) return null;

  /* ▶️ START AUTOPLAY */
  const startAutoPlay = (): void => {
    if (!autoPlay || images.length <= 1) return;

    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
  };

  /* ⏸ STOP AUTOPLAY */
  const stopAutoPlay = (): void => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  /* 🔁 INIT AUTOPLAY */
  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [autoPlay, interval, images.length]);

  /* 👆 TOUCH HANDLERS */
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    startX.current = e.touches[0].clientX;
    stopAutoPlay(); // pause while swiping
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>): void => {
    if (startX.current === null) return;

    const diff = startX.current - e.changedTouches[0].clientX;

    if (diff > 50) {
      setCurrent((prev) => (prev + 1) % images.length);
    } else if (diff < -50) {
      setCurrent((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    }

    startX.current = null;
    startAutoPlay(); // ✅ resume autoplay
  };

  return (
    <div className="relative overflow-hidden bg-gray-300 h-[400px]">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((img: string, index: number) => (
          <div
            key={index}
            className="min-w-full flex items-center justify-center"
          >
            <img
              src={img}
              className="w-full h-full object-cover"
              alt={`slide-${index}`}
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2 flex gap-2 z-[1000]">
          {images.map((_: string, index: number) => (
            <button
              key={index}
              onClick={() => {
                setCurrent(index);
                startAutoPlay(); // ✅ resume autoplay
              }}
              className={`h-2 w-2 rounded-full transition-all
                ${
                  current === index
                    ? "bg-[var(--color-primary)] w-4"
                    : "bg-gray-300"
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
