"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import CountUp from "@/components/CountUp";
import projectsData from "@/data/projects/index.json";

const fuse = new Fuse(projectsData.projects, {
  keys: ["name", "district", "submarket", "landlord", "tags", "address"],
  threshold: 0.3,
  distance: 100,
});

const bgImg = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=60";

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return projectsData.projects;
    return fuse.search(query.trim()).map((r) => r.item);
  }, [query]);

  return (
    <div>
      <section className="pt-32 pb-12 border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <p className="text-xs text-[#6e6e73] tracking-[0.2em] uppercase mb-4">Project Diagnosis</p>
            <h1 className="text-5xl font-light tracking-wider text-[#f5f5f7]">重点项目诊断</h1>
            <p className="mt-4 text-[#a1a1a6] text-sm">搜索深圳写字楼项目，查看详细诊断分析</p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="mt-10 max-w-xl mx-auto">
              <motion.div animate={{ borderColor: focused ? "rgba(0,240,255,0.5)" : "#232836", boxShadow: focused ? "0 0 0 4px rgba(0,240,255,0.04)" : "0 0 0 0px rgba(0,240,255,0)" }} className="relative border glass-card transition-colors">
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder="输入项目名称搜索..." className="w-full bg-transparent text-sm text-[#f5f5f7] placeholder-[#6e6e73] px-5 py-4 outline-none" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2"><svg className="w-4 h-4 text-[#00f0ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
              </motion.div>
              {query.trim() && (<motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-[#6e6e73] mt-3">找到 {results.length} 个匹配项目</motion.p>)}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative py-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none"><Image src={bgImg} alt="" fill className="object-cover opacity-[0.02]" sizes="100vw" /></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {results.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16"><p className="text-[#a1a1a6] text-sm">未找到匹配的项目</p><p className="text-xs text-[#6e6e73] mt-2">请尝试其他关键词</p></motion.div>
          ) : (
            <StaggerContainer className="grid grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {results.map((project) => (
                  <StaggerItem key={project.slug}>
                    <Link href={`/projects/${project.slug}`}>
                      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="group glass-card border border-[rgba(255,255,255,0.06)] p-6 hover:border-[#2c3140] transition-colors duration-500">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-sm text-[#f5f5f7] group-hover:text-[#00f0ff] transition-colors duration-300">{project.name}</h3>
                          <span className="text-[10px] text-[#6e6e73] border border-[rgba(255,255,255,0.06)] px-2 py-0.5">{project.grade}</span>
                        </div>
                        <div className="space-y-2 text-xs text-[#a1a1a6]">
                          <div className="flex justify-between">
                            <span>{project.submarket}</span>
                            <span className="text-[#ffd700] tabular-nums">¥<CountUp end={project.avgRent} />/㎡</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{project.totalArea}</span>
                            <span>空置 <CountUp end={project.vacancy} decimals={1} />%</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {project.tags.map((tag) => (<span key={tag} className="text-[10px] text-[#6e6e73] bg-[#0a0a10] px-2 py-0.5">{tag}</span>))}
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                          <span className="text-[10px] text-[#6e6e73]">{project.landlord}</span>
                          <span className="text-[10px] text-[#00f0ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300">查看诊断 →</span>
                        </div>
                      </motion.div>
                    </Link>
                  </StaggerItem>
                ))}
              </AnimatePresence>
            </StaggerContainer>
          )}
        </div>
      </section>
    </div>
  );
}
