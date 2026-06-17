"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import CountUp from "@/components/CountUp";
import overview from "@/data/shenzhen/overview.json";
import beijing from "@/data/compare/beijing.json";
import shanghai from "@/data/compare/shanghai.json";
import rentData from "@/data/shenzhen/rent-trend.json";
import stockData from "@/data/shenzhen/stock.json";
import tenantData from "@/data/shenzhen/tenants.json";

const IMG = {
  tower: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=1200&q=80",
  glass: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
  reflect: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=1200&q=80",
  bgTexture: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=60",
  bgLobby: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=60",
};

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "rgba(18,18,30,0.85)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 4,
    fontSize: 11,
    color: "#f5f5f7",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
};

export default function Home() {
  const { headline } = overview;
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const titleChars = [..."深·天际"];

  return (
    <div>
      {/* ===== Hero — CSS gradient background, no Unsplash image ===== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* The fluid gradient is in layout.tsx as bg-fluid-gradient — hero just needs content */}

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-6 text-center py-40">
          <ScrollReveal direction="none">
            <p className="text-xs tracking-[0.3em] text-[#6e6e73] uppercase mb-8">Shenzhen Office Market Intelligence</p>
          </ScrollReveal>

          <ScrollReveal delay={0.15} direction="none">
            <h1 className="heading-mega text-[#f5f5f7] mb-6 flex items-center justify-center">
              {titleChars.map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={char === "·" ? "text-[#00f0ff]" : ""}
                >
                  {char}
                </motion.span>
              ))}
            </h1>
            <p className="text-lg text-[#a1a1a6] font-serif italic tracking-[0.2em]">OfficeSky</p>
          </ScrollReveal>

          <ScrollReveal delay={0.35} direction="none">
            <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
              {[
                { label: headline.totalStockLabel, value: headline.totalStock, unit: headline.totalStockUnit },
                { label: headline.avgRentLabel, value: headline.avgRent, unit: headline.avgRentUnit, sub: `${headline.yoyRentChange}%` },
                { label: headline.vacancyRateLabel, value: headline.vacancyRate, unit: headline.vacancyRateUnit },
              ].map((m, i) => (
                <div key={i} className="glass-card glass-card-hover p-6 text-center" data-cursor-hover>
                  <p className="text-[10px] text-[#6e6e73] tracking-wider uppercase mb-2">{m.label}</p>
                  <div className="text-2xl font-light text-[#f5f5f7] tabular-nums">
                    <CountUp end={m.value} />
                  </div>
                  <span className="text-xs text-[#a1a1a6]">{m.unit}</span>
                  {m.sub && <p className="text-[10px] text-[#ffd700] mt-0.5">{m.sub} YoY</p>}
                </div>
              ))}
            </div>
          </ScrollReveal>

          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="w-px h-12 bg-gradient-to-b from-[#00f0ff] to-transparent mx-auto" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== Tier-1 Comparison ===== */}
      <section className="relative py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image src={IMG.bgTexture} alt="" fill className="object-cover opacity-[0.02]" sizes="100vw" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <ScrollReveal direction="none">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.2em] text-[#6e6e73] uppercase mb-4">Tier-1 Cities Comparison</p>
              <h2 className="heading-section text-[#f5f5f7]">一线城市写字楼市场对比</h2>
              <p className="mt-4 text-[#a1a1a6] max-w-lg mx-auto text-xs">北京、上海、深圳甲级写字楼核心指标横向对比，数据截至2026年6月</p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-3 gap-6">
            {[beijing, shanghai, overview].map((city) => (
              <StaggerItem key={city.city}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="group relative glass-card glass-card-hover p-8" data-cursor-hover>
                  <p className="text-xs text-[#00f0ff] tracking-[0.2em] uppercase mb-6">{city.city}</p>
                  <div className="space-y-5">
                    <div>
                      <span className="text-xs text-[#6e6e73]">存量 </span>
                      <span className="text-xl font-light text-[#f5f5f7] tabular-nums ml-2">
                        <CountUp end={city.headline.totalStock} />
                      </span>
                      <span className="text-xs text-[#a1a1a6] ml-1">{city.headline.totalStockUnit}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[#6e6e73]">平均租金 </span>
                      <span className="text-xl font-light text-[#f5f5f7] tabular-nums ml-2">
                        <CountUp end={city.headline.avgRent} />
                      </span>
                      <span className="text-xs text-[#a1a1a6] ml-1">{city.headline.avgRentUnit}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[#6e6e73]">空置率 </span>
                      <span className="text-xl font-light text-[#f5f5f7] tabular-nums ml-2">
                        <CountUp end={city.headline.vacancyRate} decimals={1} />
                      </span>
                      <span className="text-xs text-[#a1a1a6] ml-1">{city.headline.vacancyRateUnit}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[#6e6e73]">租金同比 </span>
                      <span className={`text-xl font-light tabular-nums ml-2 ${city.headline.yoyRentChange < 0 ? "text-[#ff2d95]" : "text-[#ffd700]"}`}>
                        {city.headline.yoyRentChange > 0 ? "+" : ""}{city.headline.yoyRentChange}
                      </span>
                      <span className="text-xs text-[#a1a1a6] ml-1">%</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ScrollReveal delay={0.3} direction="none">
            <div className="text-center mt-10">
              <Link href="/compare" className="group inline-flex items-center gap-2 text-xs text-[#00f0ff] hover:text-[#f5f5f7] transition-colors duration-300" data-cursor-hover>
                查看完整对比
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== Deep Dive + Charts ===== */}
      <section className="relative py-32 border-t border-[rgba(255,255,255,0.06)]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image src={IMG.tower} alt="" fill className="object-cover opacity-[0.02]" sizes="100vw" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 gap-20">
            {/* Left — detailed descriptions */}
            <ScrollReveal>
              <p className="text-xs tracking-[0.2em] text-[#6e6e73] uppercase mb-4">Deep Dive</p>
              <h2 className="heading-section text-[#f5f5f7] mb-8">深圳市场<br />深度数据</h2>

              <div className="space-y-6">
                <div>
                  <p className="text-xs text-[#f5f5f7] tracking-wider mb-1">存量与新增供应</p>
                  <p className="text-xs text-[#a1a1a6] leading-relaxed">
                    追踪深圳甲级写字楼历史存量变化及年度新增供应，含未来两年预测。当前存量
                    <span className="text-[#ffd700]"> {overview.headline.totalStock}万㎡</span>
                    ，2026年预计新增 <span className="text-[#ffd700]">20万㎡</span>。
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#f5f5f7] tracking-wider mb-1">租金月度走势</p>
                  <p className="text-xs text-[#a1a1a6] leading-relaxed">
                    逐月追踪平均租金变化，同比与环比双维度分析。当前均价
                    <span className="text-[#ffd700]"> {overview.headline.avgRent}元/㎡/月</span>
                    ，同比
                    <span className="text-[#ff2d95]"> {overview.headline.yoyRentChange}%</span>
                    ，市场仍处调整通道。
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#f5f5f7] tracking-wider mb-1">客群行业分布</p>
                  <p className="text-xs text-[#a1a1a6] leading-relaxed">
                    按行业与租赁面积段两个维度拆解租户结构。科技/互联网占比
                    <span className="text-[#ffd700]"> 32.5%</span>
                    为最大租户群，小面积需求持续上升。
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#f5f5f7] tracking-wider mb-1">业主方格局演变</p>
                  <p className="text-xs text-[#a1a1a6] leading-relaxed">
                    从国资、外资、民营三大维度跟踪主要业主方市场份额变化，关注资产交易与轻资产化趋势。
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#f5f5f7] tracking-wider mb-1">重要市场事件</p>
                  <p className="text-xs text-[#a1a1a6] leading-relaxed">
                    按时间线记录大宗交易、政策变动、标杆租赁及新增供应入市节点，每月更新。
                  </p>
                </div>
              </div>

              <Link href="/shenzhen" className="group inline-flex items-center gap-2 mt-10 text-xs text-[#00f0ff] hover:text-[#f5f5f7] transition-colors duration-300" data-cursor-hover>
                进入完整数据看板
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
              </Link>
            </ScrollReveal>

            {/* Right — 2×2 dynamic charts */}
            <ScrollReveal delay={0.2} direction="left">
              <div className="grid grid-cols-2 gap-4">
                {/* Rent trend — cyan */}
                <div className="glass-card p-4" data-cursor-hover>
                  <p className="text-[10px] text-[#6e6e73] mb-1 uppercase tracking-wider">租金走势</p>
                  <p className="text-sm font-light text-[#f5f5f7] mb-2">
                    <CountUp end={overview.headline.avgRent} />
                    <span className="text-[10px] text-[#a1a1a6] ml-1">元/㎡/月</span>
                  </p>
                  <div className="h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={rentData.data.slice(-12)}>
                        <Tooltip {...TOOLTIP_STYLE} />
                        <Bar dataKey="rent" fill="#00f0ff" radius={[2, 2, 0, 0]} barSize={10} animationDuration={1800} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Stock growth — gold */}
                <div className="glass-card p-4" data-cursor-hover>
                  <p className="text-[10px] text-[#6e6e73] mb-1 uppercase tracking-wider">存量增长</p>
                  <p className="text-sm font-light text-[#f5f5f7] mb-2">
                    <CountUp end={overview.headline.totalStock} />
                    <span className="text-[10px] text-[#a1a1a6] ml-1">万㎡</span>
                  </p>
                  <div className="h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stockData.data}>
                        <Tooltip {...TOOLTIP_STYLE} />
                        <Bar dataKey="stock" fill="#ffd700" radius={[2, 2, 0, 0]} barSize={12} animationDuration={1800} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Vacancy — cyan */}
                <div className="glass-card p-4" data-cursor-hover>
                  <p className="text-[10px] text-[#6e6e73] mb-1 uppercase tracking-wider">子市场空置率</p>
                  <p className="text-sm font-light text-[#f5f5f7] mb-2">
                    <CountUp end={overview.headline.vacancyRate} decimals={1} />
                    <span className="text-[10px] text-[#a1a1a6] ml-1">% 全市平均</span>
                  </p>
                  <div className="h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={overview.submarkets} layout="vertical" margin={{ left: 52, right: 8 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" stroke="#6e6e73" fontSize={10} tickLine={false} axisLine={false} width={52} />
                        <Tooltip {...TOOLTIP_STYLE} />
                        <Bar dataKey="vacancy" fill="#00f0ff" radius={[0, 2, 2, 0]} barSize={10} animationDuration={1800} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Tenant industry — magenta */}
                <div className="glass-card p-4" data-cursor-hover>
                  <p className="text-[10px] text-[#6e6e73] mb-1 uppercase tracking-wider">租户行业 TOP4</p>
                  <p className="text-sm font-light text-[#f5f5f7] mb-2">
                    科技 <span className="text-[#00f0ff]">{tenantData.industryBreakdown[0].share}%</span>
                    <span className="text-[10px] text-[#a1a1a6] ml-2">金融 {tenantData.industryBreakdown[1].share}%</span>
                  </p>
                  <div className="h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={tenantData.industryBreakdown.slice(0, 5)} layout="vertical" margin={{ left: 52, right: 8 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="industry" stroke="#6e6e73" fontSize={10} tickLine={false} axisLine={false} width={52} />
                        <Tooltip {...TOOLTIP_STYLE} />
                        <Bar dataKey="share" fill="#ff2d95" radius={[0, 2, 2, 0]} barSize={10} animationDuration={1800} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== Project Search Teaser ===== */}
      <section className="relative py-32 border-t border-[rgba(255,255,255,0.06)]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image src={IMG.bgLobby} alt="" fill className="object-cover opacity-[0.02]" sizes="100vw" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <p className="text-xs tracking-[0.2em] text-[#6e6e73] uppercase mb-4">Project Diagnosis</p>
              <h2 className="heading-section text-[#f5f5f7] mb-4">重点项目诊断</h2>
              <p className="text-[#a1a1a6] text-xs max-w-md leading-relaxed mb-8">
                搜索深圳写字楼项目，获取详细诊断分析——包括SWOT评估、租金对比与综合评分
              </p>
              <Link href="/projects" className="group inline-flex items-center gap-3 px-8 py-4 glass-card glass-card-hover text-xs text-[#f5f5f7]" data-cursor-hover>
                <svg className="w-4 h-4 text-[#00f0ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                搜索项目
                <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="ml-1">→</motion.span>
              </Link>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.2}>
              <div className="relative h-80 overflow-hidden img-overlay-duotone">
                <Image src={IMG.reflect} alt="写字楼玻璃幕墙" fill className="object-cover opacity-45" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== Full-bleed image with duotone ===== */}
      <section className="relative h-[60vh] overflow-hidden border-t border-[rgba(255,255,255,0.06)]">
        <motion.div
          initial={{ scale: 1.05 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={IMG.glass}
            alt="现代写字楼"
            fill
            className="object-cover opacity-40"
            sizes="100vw"
            priority
          />
          {/* Subtle gradient overlay — keeps text readable without hiding the image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a10]/70 via-[#f5f5f7]/20 to-transparent" />
        </motion.div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <ScrollReveal direction="none">
            <p className="text-xs text-[#ffd700] tracking-[0.2em] font-serif italic drop-shadow-lg">understanding the city through its skyline</p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
