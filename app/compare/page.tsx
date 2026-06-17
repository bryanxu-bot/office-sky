"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import CountUp from "@/components/CountUp";
import beijing from "@/data/compare/beijing.json";
import shanghai from "@/data/compare/shanghai.json";
import szOverview from "@/data/shenzhen/overview.json";

const cities = [beijing, shanghai, szOverview];

const cityImages: Record<string, string> = {
  "北京": "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80",
  "上海": "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=800&q=80",
  "深圳": "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80",
};

const bgTexture = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=60";

export default function ComparePage() {
  return (
    <div>
      <section className="pt-32 pb-16 border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <ScrollReveal>
            <p className="text-xs text-[#6e6e73] tracking-[0.2em] uppercase mb-4">Tier-1 Cities Comparison</p>
            <h1 className="text-5xl font-light tracking-wider text-[#f5f5f7]">一线城市写字楼市场对比</h1>
            <p className="mt-4 text-[#a1a1a6] max-w-lg mx-auto text-sm">北京、上海、深圳甲级写字楼核心指标横向对比，数据截至2026年6月</p>
          </ScrollReveal>
        </div>
      </section>

      {/* City cards */}
      <section className="relative py-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image src={bgTexture} alt="" fill className="object-cover opacity-[0.025]" sizes="100vw" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <StaggerContainer className="grid grid-cols-3 gap-6">
            {cities.map((city) => (
              <StaggerItem key={city.city}>
                <motion.div whileHover={{ y: -4 }} className="group glass-card border border-[rgba(255,255,255,0.06)] overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <Image src={cityImages[city.city] || ""} alt={`${city.city}城市天际线`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a10] to-transparent" />
                    <div className="absolute bottom-4 left-6">
                      <p className="text-sm text-[#f5f5f7] font-medium tracking-wider">{city.city}</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-[#6e6e73]">存量</span>
                      <span className="text-xl font-light tabular-nums"><CountUp end={city.headline.totalStock} /><span className="text-xs text-[#a1a1a6] ml-1">{city.headline.totalStockUnit}</span></span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-[#6e6e73]">平均租金</span>
                      <div className="text-right">
                        <span className="text-xl font-light tabular-nums"><CountUp end={city.headline.avgRent} /></span>
                        <span className="text-xs text-[#a1a1a6] ml-1">{city.headline.avgRentUnit}</span>
                        <span className={`text-xs ml-2 ${city.headline.yoyRentChange < 0 ? "text-[#ff2d95]" : "text-[#ffd700]"}`}>
                          {city.headline.yoyRentChange > 0 ? "+" : ""}{city.headline.yoyRentChange}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-[#6e6e73]">空置率</span>
                      <span className="text-xl font-light tabular-nums"><CountUp end={city.headline.vacancyRate} decimals={1} /><span className="text-xs text-[#a1a1a6] ml-1">{city.headline.vacancyRateUnit}</span></span>
                    </div>
                  </div>
                  {"highlights" in city && (
                    <div className="px-6 pb-6">
                      <ul className="space-y-2">
                        {city.highlights.map((h: string, i: number) => (
                          <li key={i} className="text-xs text-[#a1a1a6] leading-relaxed flex gap-2"><span className="text-[#00f0ff] shrink-0">—</span>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Detail table */}
      <section className="relative py-16 border-t border-[rgba(255,255,255,0.06)]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image src={bgTexture} alt="" fill className="object-cover opacity-[0.02]" sizes="100vw" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <ScrollReveal><h2 className="text-3xl font-light tracking-wider text-[#f5f5f7] mb-8 text-center">核心指标明细</h2></ScrollReveal>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)]">
                  <th className="py-4 pr-8 text-xs text-[#6e6e73] tracking-wider uppercase font-normal">指标</th>
                  {cities.map((c) => (<th key={c.city} className="py-4 px-6 text-xs text-[#00f0ff] tracking-wider uppercase font-normal">{c.city}</th>))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { label: "甲级写字楼存量", key: "totalStock", unit: "totalStockUnit", d: 0 },
                  { label: "平均租金", key: "avgRent", unit: "avgRentUnit", d: 0 },
                  { label: "空置率", key: "vacancyRate", unit: "vacancyRateUnit", d: 1 },
                  { label: "租金同比变动", key: "yoyRentChange", unit: null, d: 1 },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-[rgba(255,255,255,0.04)]">
                    <td className="py-5 pr-8 text-[#a1a1a6]">{row.label}</td>
                    {cities.map((c) => {
                      const val = c.headline[row.key as keyof typeof c.headline];
                      const unit = row.unit ? c.headline[row.unit as keyof typeof c.headline] : "%";
                      return (
                        <td key={c.city} className="py-5 px-6">
                          <span className="text-xl font-light tabular-nums">
                            <CountUp end={Number(val)} decimals={row.d} />
                          </span>
                          <span className="text-xs text-[#a1a1a6] ml-1">{unit}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Insights */}
      <section className="py-24 border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal><h2 className="text-3xl font-light tracking-wider text-[#f5f5f7] mb-10">三城趋势洞察</h2></ScrollReveal>
          <StaggerContainer className="grid grid-cols-3 gap-5 text-left">
            {[
              { city: "北京", title: "结构性分化", desc: "金融街/CBD核心区供需健康，丽泽/通州新兴板块空置压力大。租金降幅收窄至3.1%，市场底部信号初现。" },
              { city: "上海", title: "供应洪峰", desc: "2024-2026年是上海写字楼供应高峰，前滩/北外滩/徐汇滨江集中入市，租金仍有下行空间。" },
              { city: "深圳", title: "高供应+高空置", desc: "前海/宝安/超总持续放量，空置率突破25%。但科技企业活跃，中长期需求基本面优于京沪。" },
            ].map((insight) => (
              <StaggerItem key={insight.city}>
                <motion.div whileHover={{ y: -2 }} className="glass-card border border-[rgba(255,255,255,0.06)] p-6">
                  <p className="text-xs text-[#00f0ff] mb-2 tracking-wider">{insight.city}</p>
                  <p className="text-sm text-[#f5f5f7] mb-2">{insight.title}</p>
                  <p className="text-xs text-[#a1a1a6] leading-relaxed">{insight.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
