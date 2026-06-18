"use client";

import { ReactLenis } from "lenis/react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        lerp: 0.1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
