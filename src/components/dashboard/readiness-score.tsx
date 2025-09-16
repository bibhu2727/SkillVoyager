"use client"

import { useEffect, useState } from "react";

export function ReadinessScore({ score }: { score: number }) {
  const [offset, setOffset] = useState(251.2); // Circumference of circle
  const circumference = 2 * Math.PI * 40;

  useEffect(() => {
    const progress = score / 100;
    setOffset(circumference - progress * circumference);
  }, [score, circumference]);

  return (
    <div className="relative size-48">
      <svg className="size-full" width="100" height="100" viewBox="0 0 100 100">
        <circle
          className="text-muted/50"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
        <circle
          className="text-primary transition-all duration-1000 ease-in-out"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold text-gray-900 dark:text-white">{score}%</div>
        <div className="text-sm text-gray-800 dark:text-gray-200">Ready</div>
      </div>
    </div>
  );
}
