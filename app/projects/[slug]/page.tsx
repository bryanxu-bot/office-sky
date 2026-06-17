"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import CountUp from "@/components/CountUp";
import projectsData from "@/data/projects/index.json";
import zhongminData from "@/data/projects/zhongmin-shidai.json";
import pinganData from "@/data/projects/pingan-finance.json";
import chinaResourcesData from "@/data/projects/china-resources-tower.json";
import oneExcellenceData from "@/data/projects/one-excellence.json";
import zhaoshangData from "@/data/projects/zhaoshang-plaza.json";
import vankeData from "@/data/projects/vanke-cloud-city.json";
import kingkeyData from "@/data/projects/kingkey-100.json";
import citymarkData from "@/data/projects/citymark-center.json";
import chengjianData from "@/data/projects/chengjian-yunqi.json";
import wuziData from "@/data/projects/wuzi-zhidi.json";
import diwangData from "@/data/projects/diwang-building.json";
import hankingData from "@/data/projects/hanking-finance.json";
import excellenceData from "@/data/projects/excellence-century.json";
import { use } from "react";

const projectDetails: Record<string, any> = {
  "zhongmin-shidai": zhongminData,
  "pingan-finance": pinganData,
  "china-resources-tower": chinaResourcesData,
  "one-excellence": oneExcellenceData,
  "zhaoshang-plaza": zhaoshangData,
  "vanke-cloud-city": vankeData,
  "kingkey-100": kingkeyData,
  "citymark-center": citymarkData,
  "chengjian-yunqi": chengjianData,
  "wuzi-zhidi": wuziData,
  "diwang-building": diwangData,
  "hanking-finance": hankingData,
  "excellence-century": excellenceData,
};

interface Props { params: Promise<{ slug: string }>; }

const scoreLabels: Record<string, string> = {
  location: "区位价值", quality: "硬件品质", leasing: "租赁表现", investment: "投资价值", outlook: "发展前景",
};

const bgImg = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=60";

export default function ProjectDetailPage({ params }: Props) {
  const { slug } = use(params);
  const meta = projectsData.projects.find((p) => p.slug === slug);
  if (!meta) notFound();

  const detail = projectDetails[slug];
  if (!detail) {
    return (<div className="pt-32 pb-24 text-center"><p className="text-[#a1a1a6]">该项目的详细诊断报告正在编制中</p><Link href="/projects" className="text-sm text-[#00f0ff] mt-4 inline-block">← 返回项目列表</Link></div>);
  }

  const d = detail.diagnosis;

  return (
    <div>
      <div className="pt-28 pb-0"><div className="max-w-5xl mx-auto px-6"><Link href="/projects" className="text-xs text-[#6e6e73] hover:text-[#00f0ff] transition-colors">← 返回项目列表</Link></div></div>

      <section className="pt-8 pb-16 border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-row items-end justify-between gap-6">
              <div>
                <p className="text-xs text-[#6e6e73] tracking-[0.15em] uppercase mb-3">{detail.district} · {detail.submarket} · {detail.grade}</p>
                <h1 className="text-4xl font-light tracking-wider text-[#f5f5f7]">{detail.name}</h1>
                <p className="text-sm text-[#a1a1a6] mt-2">{detail.address}</p>
              </div>
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-3xl font-light text-[#ffd700]"><CountUp end={detail.avgRent} /></p>
                  <p className="text-xs text-[#6e6e73] mt-1">元/㎡/月</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-light text-[#f5f5f7]"><CountUp end={detail.occupancyRate} decimals={1} /></p>
                  <p className="text-xs text-[#6e6e73] mt-1">入驻率 %</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-12 border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "总建面", value: detail.totalArea }, { label: "办公面积", value: detail.officeArea },
                { label: "楼层数", value: `${detail.floors}层` }, { label: "入市年份", value: detail.yearBuilt },
                { label: "层高", value: detail.ceilingHeight }, { label: "电梯", value: `${detail.elevators}部` },
                { label: "停车位", value: `${detail.parkingSpaces}个` }, { label: "物业管理", value: detail.propertyManager },
                { label: "物业费", value: `${detail.managementFee}元/㎡` }, { label: "楼面面积", value: detail.floorPlate },
                { label: "绿色认证", value: detail.greenCert }, { label: "业主方", value: detail.landlord },
              ].map((item) => (
                <motion.div key={item.label} whileHover={{ y: -2 }} className="glass-card border border-[rgba(255,255,255,0.06)] p-3 text-center">
                  <p className="text-[10px] text-[#6e6e73] mb-1">{item.label}</p>
                  <p className="text-xs text-[#f5f5f7]">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none"><Image src={bgImg} alt="" fill className="object-cover opacity-[0.025]" sizes="100vw" /></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <ScrollReveal><h2 className="text-3xl font-light tracking-wider text-[#f5f5f7] mb-6">项目诊断</h2><p className="text-sm text-[#a1a1a6] leading-relaxed max-w-3xl mb-12">{d.summary}</p></ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-5 gap-3 mb-16">
              {Object.entries(scoreLabels).map(([key, label]) => {
                const score = d.scorecard[key as keyof typeof d.scorecard];
                return (
                  <motion.div key={key} whileHover={{ y: -2 }} className="glass-card border border-[rgba(255,255,255,0.06)] p-4 text-center">
                    <p className="text-[10px] text-[#6e6e73] mb-3">{label}</p>
                    <div className="relative w-12 h-12 mx-auto mb-2">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="17" fill="none" stroke="#232836" strokeWidth="2" />
                        <circle cx="20" cy="20" r="17" fill="none" stroke={score >= 7 ? "#ffd700" : score >= 5 ? "#00f0ff" : "#6b4e4e"} strokeWidth="2" strokeDasharray={`${(score / 10) * 106.8} 106.8`} strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-light text-[#f5f5f7]">
                        <CountUp end={score} decimals={1} />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 gap-6">
            {[
              { title: "优势 Strengths", accent: "text-[#ffd700]", border: "hover:border-[#ffd700]/20", symColor: "text-[#ffd700]/50", items: d.strengths, sym: "+" },
              { title: "劣势 Weaknesses", accent: "text-[#ff2d95]", border: "hover:border-[#ff2d95]/20", symColor: "text-[#ff2d95]/50", items: d.weaknesses, sym: "−" },
              { title: "机会 Opportunities", accent: "text-[#00f0ff]", border: "hover:border-[#00f0ff]/20", symColor: "text-[#00f0ff]/50", items: d.opportunities, sym: "○" },
              { title: "威胁 Threats", accent: "text-[#ff9f43]", border: "hover:border-[#ff9f43]/20", symColor: "text-[#ff9f43]/50", items: d.threats, sym: "△" },
            ].map((section, si) => (
              <ScrollReveal key={si} delay={0.2 + si * 0.05}>
                <div className={`glass-card border border-[rgba(255,255,255,0.06)] p-6 ${section.border} transition-colors duration-500`}>
                  <p className={`text-xs ${section.accent} tracking-wider mb-4`}>{section.title}</p>
                  <ul className="space-y-3">
                    {section.items.map((item: any, i: number) => (
                      <li key={i} className="text-xs text-[#a1a1a6] leading-relaxed flex gap-2">
                        <span className={`${section.symColor} shrink-0 mt-0.5`}>{section.sym}</span>
                        {item.point}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal><h2 className="text-3xl font-light tracking-wider text-[#f5f5f7] mb-8">周边竞品对比</h2></ScrollReveal>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b border-[rgba(255,255,255,0.06)]"><th className="py-3 pr-8 text-xs text-[#6e6e73] font-normal">项目</th><th className="py-3 px-6 text-xs text-[#6e6e73] font-normal text-right">租金(元/㎡)</th><th className="py-3 px-6 text-xs text-[#6e6e73] font-normal text-right">空置率(%)</th><th className="py-3 px-6 text-xs text-[#6e6e73] font-normal text-right">租金差值</th></tr></thead>
              <tbody>
                {detail.peerComparison.map((p: any) => {
                  const diff = p.rent - detail.avgRent;
                  const isCurrent = p.project === detail.name;
                  return (
                    <tr key={p.project} className={`border-b border-[rgba(255,255,255,0.04)] ${isCurrent ? "bg-[#00f0ff]/[0.04]" : ""}`}>
                      <td className="py-3 pr-8"><span className={isCurrent ? "text-[#ffd700]" : "text-[#f5f5f7]"}>{p.project}</span>{isCurrent && <span className="text-[10px] text-[#ffd700] ml-2">← 当前</span>}</td>
                      <td className="py-3 px-6 text-right text-[#a1a1a6] tabular-nums"><CountUp end={p.rent} /></td>
                      <td className="py-3 px-6 text-right text-[#a1a1a6] tabular-nums"><CountUp end={p.vacancy} decimals={1} /></td>
                      <td className={`py-3 px-6 text-right tabular-nums text-xs ${diff > 0 ? "text-[#ffd700]" : diff < 0 ? "text-[#ff2d95]" : "text-[#a1a1a6]"}`}>{diff > 0 ? "+" : ""}<CountUp end={Math.abs(diff)} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-[rgba(255,255,255,0.06)] text-center">
        <Link href="/projects" className="text-sm text-[#a1a1a6] hover:text-[#00f0ff] transition-colors">← 返回项目搜索</Link>
      </section>
    </div>
  );
}
