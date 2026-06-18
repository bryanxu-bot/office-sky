"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import CountUp from "@/components/CountUp";
import type { DiagnosisResult } from "@/lib/types";

const scoreLabels: Record<string, string> = {
  location: "区位价值",
  quality: "硬件品质",
  leasing: "租赁表现",
  investment: "投资价值",
  outlook: "发展前景",
};

const bgImg =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=60";

function DiagnosisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name") || "";
  const address = searchParams.get("address") || "";
  const district = searchParams.get("district") || "";
  const businessArea = searchParams.get("businessArea") || "";
  const lng = searchParams.get("lng") || "";
  const lat = searchParams.get("lat") || "";

  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!name) {
      setLoading(false);
      setError("未提供项目名称");
      return;
    }

    let cancelled = false;

    async function generate() {
      try {
        const res = await fetch("/api/diagnosis/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            address,
            district,
            businessArea,
            location: lng && lat ? `${lng},${lat}` : undefined,
          }),
        });

        const data = await res.json();
        if (cancelled) return;

        if (!res.ok || data.error) {
          setError(data.error || "生成诊断失败");
        } else {
          setResult(data);
        }
      } catch {
        if (!cancelled) setError("网络请求失败，请重试");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    generate();
    return () => {
      cancelled = true;
    };
  }, [name, address, district, businessArea, lng, lat]);

  // Loading skeleton
  if (loading) {
    return (
      <div>
        <div className="pt-28 pb-0">
          <div className="max-w-5xl mx-auto px-6">
            <Link
              href="/projects"
              className="text-xs text-[#6e6e73] hover:text-[#00f0ff] transition-colors"
            >
              ← 返回项目搜索
            </Link>
          </div>
        </div>
        <section className="pt-8 pb-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="animate-pulse">
              <div className="h-4 w-32 bg-[#232836] rounded mx-auto mb-4" />
              <div className="h-10 w-64 bg-[#232836] rounded mx-auto mb-3" />
              <div className="h-4 w-48 bg-[#232836] rounded mx-auto" />
            </div>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mt-12 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5 text-[#00f0ff] animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm text-[#a1a1a6]">正在为「{name}」生成诊断报告...</p>
            </motion.div>
            <p className="text-xs text-[#6e6e73] mt-3">AI 正在分析项目区位、硬件、租赁表现及市场前景</p>
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (error || !result) {
    return (
      <div className="pt-32 pb-24 text-center">
        <p className="text-lg text-[#a1a1a6] mb-2">
          {error || "未能生成诊断报告"}
        </p>
        <p className="text-xs text-[#6e6e73] mb-6">
          请返回重试，或检查项目名称是否正确
        </p>
        <Link
          href="/projects"
          className="text-sm text-[#00f0ff] hover:underline"
        >
          ← 返回项目搜索
        </Link>
      </div>
    );
  }

  const d = result.diagnosis;

  return (
    <div>
      {/* Back link */}
      <div className="pt-28 pb-0">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            href="/projects"
            className="text-xs text-[#6e6e73] hover:text-[#00f0ff] transition-colors"
          >
            ← 返回项目搜索
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="pt-8 pb-16 border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-row items-end justify-between gap-6">
              <div>
                <p className="text-xs text-[#6e6e73] tracking-[0.15em] uppercase mb-3">
                  {district} {businessArea ? `· ${businessArea}` : ""}
                  <span className="ml-3 text-[#00f0ff] border border-[#00f0ff]/30 px-2 py-0.5 text-[10px]">
                    AI 诊断
                  </span>
                </p>
                <h1 className="text-4xl font-light tracking-wider text-[#f5f5f7]">
                  {name}
                </h1>
                <p className="text-sm text-[#a1a1a6] mt-2">{address}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Basic info from Amap */}
      <section className="py-12 border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "项目名称", value: name },
                { label: "所在区域", value: district || "未知" },
                { label: "商圈", value: businessArea || "未知" },
                { label: "地址", value: address || "未知" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -2 }}
                  className="glass-card border border-[rgba(255,255,255,0.06)] p-3 text-center"
                >
                  <p className="text-[10px] text-[#6e6e73] mb-1">
                    {item.label}
                  </p>
                  <p className="text-xs text-[#f5f5f7] truncate">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Diagnosis */}
      <section className="relative py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            src={bgImg}
            alt=""
            fill
            className="object-cover opacity-[0.025]"
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-light tracking-wider text-[#f5f5f7] mb-6">
              项目诊断
            </h2>
            <p className="text-sm text-[#a1a1a6] leading-relaxed max-w-3xl mb-12">
              {d.summary}
            </p>
          </ScrollReveal>

          {/* Scorecard */}
          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-5 gap-3 mb-16">
              {Object.entries(scoreLabels).map(([key, label]) => {
                const score = d.scorecard[key as keyof typeof d.scorecard] || 0;
                return (
                  <motion.div
                    key={key}
                    whileHover={{ y: -2 }}
                    className="glass-card border border-[rgba(255,255,255,0.06)] p-4 text-center"
                  >
                    <p className="text-[10px] text-[#6e6e73] mb-3">{label}</p>
                    <div className="relative w-12 h-12 mx-auto mb-2">
                      <svg
                        className="w-12 h-12 -rotate-90"
                        viewBox="0 0 40 40"
                      >
                        <circle
                          cx="20"
                          cy="20"
                          r="17"
                          fill="none"
                          stroke="#232836"
                          strokeWidth="2"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="17"
                          fill="none"
                          stroke={
                            score >= 7
                              ? "#ffd700"
                              : score >= 5
                                ? "#00f0ff"
                                : "#6b4e4e"
                          }
                          strokeWidth="2"
                          strokeDasharray={`${(score / 10) * 106.8} 106.8`}
                          strokeLinecap="round"
                        />
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

          {/* SWOT */}
          <div className="grid grid-cols-2 gap-6">
            {[
              {
                title: "优势 Strengths",
                accent: "text-[#ffd700]",
                border: "hover:border-[#ffd700]/20",
                symColor: "text-[#ffd700]/50",
                items: d.strengths,
                sym: "+",
              },
              {
                title: "劣势 Weaknesses",
                accent: "text-[#ff2d95]",
                border: "hover:border-[#ff2d95]/20",
                symColor: "text-[#ff2d95]/50",
                items: d.weaknesses,
                sym: "−",
              },
              {
                title: "机会 Opportunities",
                accent: "text-[#00f0ff]",
                border: "hover:border-[#00f0ff]/20",
                symColor: "text-[#00f0ff]/50",
                items: d.opportunities,
                sym: "○",
              },
              {
                title: "威胁 Threats",
                accent: "text-[#ff9f43]",
                border: "hover:border-[#ff9f43]/20",
                symColor: "text-[#ff9f43]/50",
                items: d.threats,
                sym: "△",
              },
            ].map((section, si) => (
              <ScrollReveal key={si} delay={0.2 + si * 0.05}>
                <div
                  className={`glass-card border border-[rgba(255,255,255,0.06)] p-6 ${section.border} transition-colors duration-500`}
                >
                  <p className={`text-xs ${section.accent} tracking-wider mb-4`}>
                    {section.title}
                  </p>
                  <ul className="space-y-3">
                    {section.items.map((item: { point: string }, i: number) => (
                      <li
                        key={i}
                        className="text-xs text-[#a1a1a6] leading-relaxed flex gap-2"
                      >
                        <span className={`${section.symColor} shrink-0 mt-0.5`}>
                          {section.sym}
                        </span>
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

      {/* Peer Comparison */}
      {result.peerComparison && result.peerComparison.length > 0 && (
        <section className="py-24 border-t border-[rgba(255,255,255,0.06)]">
          <div className="max-w-5xl mx-auto px-6">
            <ScrollReveal>
              <h2 className="text-3xl font-light tracking-wider text-[#f5f5f7] mb-8">
                周边竞品对比
              </h2>
            </ScrollReveal>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)]">
                    <th className="py-3 pr-8 text-xs text-[#6e6e73] font-normal">
                      项目
                    </th>
                    <th className="py-3 px-6 text-xs text-[#6e6e73] font-normal text-right">
                      租金(元/㎡)
                    </th>
                    <th className="py-3 px-6 text-xs text-[#6e6e73] font-normal text-right">
                      空置率(%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.peerComparison.map(
                    (p: { project: string; rent: number; vacancy: number }) => {
                      const isCurrent = p.project === name;
                      return (
                        <tr
                          key={p.project}
                          className={`border-b border-[rgba(255,255,255,0.04)] ${isCurrent ? "bg-[#00f0ff]/[0.04]" : ""}`}
                        >
                          <td className="py-3 pr-8">
                            <span
                              className={
                                isCurrent
                                  ? "text-[#ffd700]"
                                  : "text-[#f5f5f7]"
                              }
                            >
                              {p.project}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] text-[#ffd700] ml-2">
                                ← 当前
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-6 text-right text-[#a1a1a6] tabular-nums">
                            <CountUp end={p.rent} />
                          </td>
                          <td className="py-3 px-6 text-right text-[#a1a1a6] tabular-nums">
                            <CountUp end={p.vacancy} decimals={1} />
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="py-16 border-t border-[rgba(255,255,255,0.06)] text-center">
        <Link
          href="/projects"
          className="text-sm text-[#a1a1a6] hover:text-[#00f0ff] transition-colors"
        >
          ← 返回项目搜索
        </Link>
        <p className="text-[10px] text-[#6e6e73] mt-3">
          * 本诊断由 AI 生成，数据仅供参考，不构成投资建议
        </p>
      </section>
    </div>
  );
}

export default function AmapDiagnosisPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 pb-24 text-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-4 w-32 bg-[#232836] rounded" />
            <div className="h-10 w-64 bg-[#232836] rounded" />
          </div>
        </div>
      }
    >
      <DiagnosisContent />
    </Suspense>
  );
}
