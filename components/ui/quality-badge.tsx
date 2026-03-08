import { cn } from "@/lib/utils";

export default function QualityBadge({ tag }: { tag: string }) {
  const labels: Record<string, string> = {
    LOSSLESS: "FLAC",
    HIRES_LOSSLESS: "Hi-Res",
    MQA: "MQA",
  };
  const colors: Record<string, string> = {
    LOSSLESS: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    HIRES_LOSSLESS: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    MQA: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-[10px] font-semibold tracking-widest border  uppercase",
        colors[tag] ?? "bg-zinc-800 text-zinc-400 border-zinc-700",
      )}
    >
      {labels[tag] ?? tag}
    </span>
  );
}
