import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl font-light text-[#262936] mb-4">404</p>
        <p className="text-sm text-[#8b8d97]">页面未找到</p>
        <Link href="/" className="text-sm text-[#ffd700] mt-6 inline-block">
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}
