import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)] bg-[#0a0a10]">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link href="/" className="text-lg font-light tracking-[0.2em] text-[#f5f5f7]">
              深<span className="text-[#00f0ff]">·</span>天际
            </Link>
            <p className="mt-3 text-xs text-[#6e6e73] leading-relaxed">
              OfficeSky — 深圳写字楼市场数据平台
              <br />
              数据每月3号更新
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.15em] text-[#6e6e73] uppercase mb-4">导航</h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-[#a1a1a6] hover:text-[#00f0ff] transition-colors">首页</Link>
              <Link href="/compare" className="text-sm text-[#a1a1a6] hover:text-[#00f0ff] transition-colors">一线城市对比</Link>
              <Link href="/shenzhen" className="text-sm text-[#a1a1a6] hover:text-[#00f0ff] transition-colors">深圳市场数据</Link>
              <Link href="/projects" className="text-sm text-[#a1a1a6] hover:text-[#00f0ff] transition-colors">项目诊断</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.15em] text-[#6e6e73] uppercase mb-4">数据维度</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-[#a1a1a6]">存量与新增</span>
              <span className="text-sm text-[#a1a1a6]">租金走势</span>
              <span className="text-sm text-[#a1a1a6]">客群分析</span>
              <span className="text-sm text-[#a1a1a6]">业主方变化</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.15em] text-[#6e6e73] uppercase mb-4">数据更新</h4>
            <div className="text-sm text-[#a1a1a6]">
              <p>下次更新：2026年7月3日</p>
              <p className="mt-2 text-xs text-[#6e6e73]">
                数据来源：公开市场信息整理
                <br />
                仅供参考，不构成投资建议
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[rgba(255,255,255,0.06)] flex flex-row justify-between items-center gap-2">
          <span className="text-xs text-[#6e6e73]">
            © 2026 深·天际 OfficeSky. All rights reserved.
          </span>
          <span className="text-xs text-[#6e6e73]">
            数据更新至 2026年6月
          </span>
        </div>
      </div>
    </footer>
  );
}
