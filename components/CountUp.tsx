"use client";

import { useEffect, useState, useRef } from "react";

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function CountUp({
  end,
  duration = 2000,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: CountUpProps) {
  // Start from target value — SSR-safe, avoids showing 0 before animation
  const [val, setVal] = useState(end);
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || triggered.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          triggered.current = true;
          // Reset to 0 then animate up
          setVal(0);
          const start = performance.now();
          const step = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(end * eased);
            if (p < 1) {
              frameRef.current = requestAnimationFrame(step);
            } else {
              setVal(end);
            }
          };
          frameRef.current = requestAnimationFrame(step);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration]);

  const display = decimals > 0 ? val.toFixed(decimals) : Math.round(val);

  return (
    <span ref={ref} className={`ticker-digit ${className}`}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
