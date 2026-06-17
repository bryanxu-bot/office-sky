"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const onLinkEnter = () => setHovering(true);
    const onLinkLeave = () => setHovering(false);

    // Spring-follow animation loop
    const animate = () => {
      const dx = targetRef.current.x - currentRef.current.x;
      const dy = targetRef.current.y - currentRef.current.y;
      currentRef.current.x += dx * 0.15;
      currentRef.current.y += dy * 0.15;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${currentRef.current.x}px`;
        cursorRef.current.style.top = `${currentRef.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Attach hover listeners to interactive elements
    const attachListeners = () => {
      const targets = document.querySelectorAll("a, button, [data-cursor-hover]");
      targets.forEach((el) => {
        el.addEventListener("mouseenter", onLinkEnter);
        el.addEventListener("mouseleave", onLinkLeave);
      });
    };

    attachListeners();
    // Re-attach on DOM changes (client-side navigation)
    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      document.querySelectorAll("a, button, [data-cursor-hover]").forEach((el) => {
        el.removeEventListener("mouseenter", onLinkEnter);
        el.removeEventListener("mouseleave", onLinkLeave);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${hovering ? "hovering" : ""}`}
      style={{
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -50%)",
      }}
      aria-hidden="true"
    />
  );
}
