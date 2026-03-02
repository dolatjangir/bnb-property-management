"use client";

import React from "react";

type LoaderProps = {
  label?: string;        // optional text
  size?: number;         // optional size (px)
};

export default function Loader({
  label = "Loading...",
  size = 48,
}: LoaderProps) {
  return (
    <div className="px-2 pb-4">
      <div className="w-full flex flex-col justify-center items-center py-16">
        <div className="relative" style={{ width: size, height: size }}>
          <div
            className="border-4 border-gray-200 rounded-full"
            style={{ width: size, height: size }}
          />
          <div
            className="border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin absolute top-0 left-0"
            style={{ width: size, height: size }}
          />
        </div>

        {label && (
          <p className="mt-4 text-lg text-gray-500 font-medium">
            {label}
          </p>
        )}
      </div>
    </div>
  );
}
