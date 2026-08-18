"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export function Loader() {
  const { progress, active } = useProgress();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // When progress hits 100, fade out after a tiny delay for smoothness
    if (progress === 100) {
      const timeout = setTimeout(() => setIsVisible(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-primary transition-opacity duration-700 ease-in-out ${
        progress === 100 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-border-subtle" />
          <div className="absolute inset-0 rounded-full border-2 border-gold border-t-transparent animate-spin" />
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-text-primary mb-2">
            AcdyOn
          </h2>
          <p className="text-xs font-medium tracking-widest text-text-tertiary">
            INITIALIZING {Math.round(progress)}%
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-[2px] bg-border-subtle rounded-full overflow-hidden mt-4">
          <div 
            className="h-full bg-gold transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
}

