import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="pt-32 pb-24 text-center">
      <p className="text-[#8b8d97] text-sm">未找到该项目</p>
      <p className="text-xs text-[#5c5f6b] mt-2">请确认项目名称是否正确</p>
      <Link href="/projects" className="text-sm text-[#ffd700] mt-6 inline-block">
        ← 返回项目列表
      </Link>
    </div>
  );
}
