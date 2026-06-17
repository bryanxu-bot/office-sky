"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = [
  { href: "/", label: "首页" },
  { href: "/compare", label: "一线城市" },
  { href: "/shenzhen", label: "深圳数据" },
  { href: "/projects", label: "项目诊断" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[rgba(10,10,16,0.7)] backdrop-blur-2xl border-b border-[rgba(255,255,255,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="group flex items-center gap-2.5" data-cursor-hover>
            <span className="text-lg font-light tracking-[0.2em] text-[#f5f5f7] group-hover:text-[#00f0ff] transition-colors duration-500">
              深<span className="text-[#00f0ff] mx-0.5">·</span>天际
            </span>
            <span className="inline text-[10px] tracking-[0.25em] text-[#6e6e73] uppercase mt-0.5 font-serif italic">
              OfficeSky
            </span>
          </Link>

          <div className="flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-cursor-hover
                className={`relative text-sm tracking-wider transition-colors duration-300 py-1 ${
                  pathname === link.href
                    ? "text-[#00f0ff]"
                    : "text-[#a1a1a6] hover:text-[#f5f5f7]"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-px bg-[#00f0ff]"
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </Link>
            ))}
          </div>

        </div>
      </div>

    </motion.nav>
  );
}
