"use client";

import { useState } from "react";
import Image from "next/image";
import {
  PieChart, Pie, Cell, ComposedChart, BarChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { motion } from "framer-motion";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import CountUp from "@/components/CountUp";
import stockData from "@/data/shenzhen/stock.json";
import rentData from "@/data/shenzhen/rent-trend.json";
import tenantData from "@/data/shenzhen/tenants.json";
import landlordData from "@/data/shenzhen/landlords.json";
import eventData from "@/data/shenzhen/events.json";
import overview from "@/data/shenzhen/overview.json";

const CHART_COLORS = ["#ffd700", "#00f0ff", "#ff2d95", "#4d7cff", "#7c5cbf", "#ff6b6b", "#48dbfb", "#ff9ff3"];

const sections = [
  { id: "stock", label: "存量与新增" }, { id: "rent", label: "租金走势" },
  { id: "tenants", label: "客群分析" }, { id: "landlords", label: "业主方变化" }, { id: "events", label: "重要事件" },
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card border border-[rgba(255,255,255,0.06)] px-4 py-2 text-xs text-[#f5f5f7]">
      {label && <p className="text-[#a1a1a6] mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (<p key={i} style={{ color: p.color || "#ffd700" }}>{p.name}: {p.value}</p>))}
    </div>
  );
}

const bgImg = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=60";

export default function ShenzhenPage() {
  const [activeSection, setActiveSection] = useState("stock");
  const handleScrollTo = (id: string) => { setActiveSection(id); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return (
    <div>
      <section className="pt-32 pb-12 border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <p className="text-xs text-[#6e6e73] tracking-[0.2em] uppercase mb-4">Shenzhen Deep Dive</p>
            <h1 className="text-5xl font-light tracking-wider text-[#f5f5f7]">深圳市场深度数据</h1>
            <p className="mt-4 text-[#a1a1a6] text-sm">数据截至 {overview.period}，每月3号更新</p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-4 gap-4 mt-10">
              {[
                { label: "存量", value: overview.headline.totalStock, unit: "万㎡", d: 0 },
                { label: "空置率", value: overview.headline.vacancyRate, unit: "%", d: 1 },
                { label: "平均租金", value: overview.headline.avgRent, unit: "元/㎡", d: 0, accent: true },
                { label: "租金同比", value: overview.headline.yoyRentChange, unit: "%", d: 1, neg: true },
              ].map((kpi, i) => (
                <motion.div key={i} whileHover={{ y: -2 }} className="glass-card border border-[rgba(255,255,255,0.06)] p-5 text-center">
                  <p className="text-xs text-[#6e6e73] mb-2">{kpi.label}</p>
                  <p className={`text-2xl font-light tabular-nums ${kpi.neg ? "text-[#ff2d95]" : kpi.accent ? "text-[#ffd700]" : "text-[#f5f5f7]"}`}>
                    <CountUp end={kpi.value} decimals={kpi.d} suffix={kpi.unit} />
                  </p>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <nav className="sticky top-20 z-30 bg-[#0a0a10]/90 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-6xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {sections.map((s) => (
            <button key={s.id} onClick={() => handleScrollTo(s.id)} className={`shrink-0 px-4 py-3 text-xs tracking-wider transition-colors duration-300 ${activeSection === s.id ? "text-[#00f0ff] border-b border-[#00f0ff]" : "text-[#a1a1a6] hover:text-[#f5f5f7] border-b border-transparent"}`}>{s.label}</button>
          ))}
        </div>
      </nav>

      {/* Stock */}
      <section id="stock" className="relative py-24 scroll-mt-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none"><Image src={bgImg} alt="" fill className="object-cover opacity-[0.02]" sizes="100vw" /></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <ScrollReveal><h2 className="text-3xl font-light tracking-wider text-[#f5f5f7] mb-2">存量与新增供应</h2><p className="text-xs text-[#a1a1a6] mb-8">单位：万㎡</p></ScrollReveal>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={400}>
              <ComposedChart data={[...stockData.data, ...stockData.forecast.filter((f) => f.year > 2026)]} barGap={4}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <XAxis dataKey="year" stroke="#6e6e73" fontSize={12} tickLine={false} />
                <YAxis stroke="#6e6e73" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="stock" name="存量" fill="#00f0ff" radius={[2, 2, 0, 0]} barSize={24} animationDuration={1500} />
                <Bar dataKey="newSupply" name="新增供应" fill="rgba(255,255,255,0.06)" radius={[2, 2, 0, 0]} barSize={24} animationDuration={1500} />
                <Line type="monotone" dataKey="stock" name="存量趋势" stroke="#ffd700" strokeWidth={2} dot={{ r: 3, fill: "#ffd700", stroke: "#f5f5f7", strokeWidth: 1.5 }} animationDuration={2000} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Rent */}
      <section id="rent" className="relative py-24 border-t border-[rgba(255,255,255,0.06)] scroll-mt-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none"><Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=60" alt="" fill className="object-cover opacity-[0.025]" sizes="100vw" /></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <ScrollReveal><h2 className="text-3xl font-light tracking-wider text-[#f5f5f7] mb-2">租金走势</h2><p className="text-xs text-[#a1a1a6] mb-8">单位：元/㎡/月 | 2024年1月 — 2025年6月</p></ScrollReveal>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={400}>
              <ComposedChart data={rentData.data}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#6e6e73" fontSize={12} tickLine={false} tickFormatter={(v) => v.slice(2)} />
                <YAxis stroke="#6e6e73" fontSize={12} tickLine={false} axisLine={false} domain={["dataMin - 5", "dataMax + 5"]} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="rent" name="平均租金" fill="#ffd700" radius={[2, 2, 0, 0]} barSize={12} animationDuration={1800} />
                <Line type="monotone" dataKey="rent" name="租金趋势" stroke="#00f0ff" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#00f0ff", stroke: "#f5f5f7", strokeWidth: 2 }} animationDuration={2000} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <ScrollReveal delay={0.2}>
            <div className="mt-16">
              <h3 className="text-sm text-[#f5f5f7] tracking-wider mb-6">各子市场租金与空置率</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead><tr className="border-b border-[rgba(255,255,255,0.06)]"><th className="py-3 pr-8 text-xs text-[#6e6e73] font-normal">子市场</th><th className="py-3 px-4 text-xs text-[#6e6e73] font-normal text-right">存量(万㎡)</th><th className="py-3 px-4 text-xs text-[#6e6e73] font-normal text-right">空置率(%)</th><th className="py-3 px-4 text-xs text-[#6e6e73] font-normal text-right">租金(元/㎡/月)</th></tr></thead>
                  <tbody>
                    {overview.submarkets.map((m) => (
                      <tr key={m.name} className="border-b border-[rgba(255,255,255,0.04)]">
                        <td className="py-3 pr-8 text-[#f5f5f7]">{m.name}</td>
                        <td className="py-3 px-4 text-[#a1a1a6] text-right tabular-nums"><CountUp end={m.stock} /></td>
                        <td className="py-3 px-4 text-[#a1a1a6] text-right tabular-nums"><CountUp end={m.vacancy} decimals={1} /></td>
                        <td className="py-3 px-4 text-[#ffd700] text-right tabular-nums"><CountUp end={m.rent} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Tenants */}
      <section id="tenants" className="relative py-24 border-t border-[rgba(255,255,255,0.06)] scroll-mt-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none"><Image src={bgImg} alt="" fill className="object-cover opacity-[0.02]" sizes="100vw" /></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <ScrollReveal><h2 className="text-3xl font-light tracking-wider text-[#f5f5f7] mb-8">客群分析</h2></ScrollReveal>
          <div className="grid grid-cols-2 gap-8">
            <ScrollReveal delay={0.1}><div><p className="text-xs text-[#a1a1a6] mb-4">租户行业分布</p><div className="h-[350px]"><ResponsiveContainer width="100%" height="100%" minHeight={350}><PieChart><Pie data={tenantData.industryBreakdown} dataKey="share" nameKey="industry" cx="50%" cy="50%" outerRadius={120} innerRadius={60} stroke="#f5f5f7" strokeWidth={1} animationDuration={1500}>{tenantData.industryBreakdown.map((_, i) => (<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />))}</Pie><Tooltip content={<ChartTooltip />} /><Legend wrapperStyle={{ fontSize: "11px", color: "#0f0f18" }} /></PieChart></ResponsiveContainer></div></div></ScrollReveal>
            <ScrollReveal delay={0.2}><div><p className="text-xs text-[#a1a1a6] mb-4">租赁面积段分布</p><div className="h-[350px]"><ResponsiveContainer width="100%" height="100%" minHeight={350}><BarChart data={tenantData.areaBreakdown} layout="vertical" margin={{ left: 60 }}><CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" horizontal={false} /><XAxis type="number" stroke="#6e6e73" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} /><YAxis dataKey="range" type="category" stroke="#6e6e73" fontSize={12} tickLine={false} axisLine={false} /><Tooltip content={<ChartTooltip />} /><Bar dataKey="share" name="占比" fill="#00f0ff" radius={[0, 2, 2, 0]} barSize={24} animationDuration={1500} /></BarChart></ResponsiveContainer></div></div></ScrollReveal>
          </div>
          <StaggerContainer className="grid grid-cols-3 gap-4 mt-8">
            {[{ title: "科技企业持续扩张", desc: tenantData.trends.techRising }, { title: "金融行业稳健", desc: tenantData.trends.financeStable }, { title: "小面积需求上升", desc: tenantData.trends.smallUnitRising }].map((t, i) => (
              <StaggerItem key={i}><motion.div whileHover={{ y: -2 }} className="glass-card border border-[rgba(255,255,255,0.06)] p-5"><p className="text-xs text-[#00f0ff] mb-2">{t.title}</p><p className="text-xs text-[#a1a1a6] leading-relaxed">{t.desc}</p></motion.div></StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Landlords */}
      <section id="landlords" className="py-24 border-t border-[rgba(255,255,255,0.06)] scroll-mt-32">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal><h2 className="text-3xl font-light tracking-wider text-[#f5f5f7] mb-2">业主方变化</h2><p className="text-xs text-[#a1a1a6] mb-8">深圳甲级写字楼主要业主方市场份额与格局演变</p></ScrollReveal>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b border-[rgba(255,255,255,0.06)]"><th className="py-3 pr-8 text-xs text-[#6e6e73] font-normal">业主方</th><th className="py-3 px-4 text-xs text-[#6e6e73] font-normal">类型</th><th className="py-3 px-4 text-xs text-[#6e6e73] font-normal text-right">存量(万㎡)</th><th className="py-3 px-4 text-xs text-[#6e6e73] font-normal text-right">市场份额</th><th className="py-3 px-4 text-xs text-[#6e6e73] font-normal">趋势</th><th className="py-3 px-4 text-xs text-[#6e6e73] font-normal table-cell">代表项目</th></tr></thead>
              <tbody>
                {landlordData.landlords.map((l) => (
                  <tr key={l.name} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(18,18,30,0.7)] transition-colors">
                    <td className="py-3 pr-8 text-[#f5f5f7]">{l.name}</td>
                    <td className="py-3 px-4 text-[#a1a1a6]">{l.type}</td>
                    <td className="py-3 px-4 text-[#a1a1a6] text-right tabular-nums"><CountUp end={l.stock} /></td>
                    <td className="py-3 px-4 text-[#ffd700] text-right tabular-nums"><CountUp end={l.marketShare} decimals={1} />%</td>
                    <td className="py-3 px-4"><span className={`text-xs ${l.trend === "up" ? "text-[#ffd700]" : l.trend === "down" ? "text-[#ff2d95]" : "text-[#a1a1a6]"}`}>{l.trend === "up" ? "↑ 上升" : l.trend === "down" ? "↓ 下降" : "→ 稳定"}</span></td>
                    <td className="py-3 px-4 text-[#a1a1a6] text-xs table-cell">{l.keyProjects?.join("、") || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <StaggerContainer className="grid grid-cols-3 gap-4 mt-10">
            {landlordData.shifts.map((s, i) => (<StaggerItem key={i}><motion.div whileHover={{ y: -2 }} className="glass-card border border-[rgba(255,255,255,0.06)] p-5"><p className="text-xs text-[#00f0ff] mb-2">{s.trend}</p><p className="text-xs text-[#a1a1a6] leading-relaxed">{s.description}</p></motion.div></StaggerItem>))}
          </StaggerContainer>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="relative py-24 border-t border-[rgba(255,255,255,0.06)] scroll-mt-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none"><Image src={bgImg} alt="" fill className="object-cover opacity-[0.02]" sizes="100vw" /></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <ScrollReveal><h2 className="text-3xl font-light tracking-wider text-[#f5f5f7] mb-8">重要事件时间线</h2></ScrollReveal>
          <div className="relative"><div className="absolute left-4 top-0 bottom-0 w-px bg-[#232836]" /><StaggerContainer className="space-y-8">
            {eventData.events.map((e, i) => (<StaggerItem key={i}><div className="relative pl-12"><motion.div whileHover={{ scale: 1.3 }} className={`absolute left-[13px] top-1.5 w-2 h-2 rounded-full border ${e.impact === "positive" ? "bg-[#ffd700]/20 border-[#ffd700]/50" : e.impact === "negative" ? "bg-[#ff2d95]/20 border-[#ff2d95]/50" : "bg-[#00f0ff]/20 border-[#00f0ff]/50"}`} /><div className="flex flex-row items-baseline gap-4"><span className="text-xs text-[#6e6e73] tabular-nums shrink-0 w-16">{e.date}</span><div><span className="text-[10px] text-[#6e6e73] uppercase mr-2">[{e.type === "new_supply" ? "新增供应" : e.type === "transaction" ? "交易" : e.type === "leasing" ? "租赁" : e.type === "policy" ? "政策" : "市场"}]</span><p className="text-sm text-[#f5f5f7] inline">{e.title}</p><p className="text-xs text-[#a1a1a6] mt-1">{e.description}</p></div></div></div></StaggerItem>))}
          </StaggerContainer></div>
        </div>
      </section>
    </div>
  );
}
