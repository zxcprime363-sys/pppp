import { cn } from "@/lib/utils";

export default function HeaderRow({ number = true }: { number?: boolean }) {
  return (
    <div
      className={cn(
        "grid grid-cols-[4fr_1fr] border-b border-zinc-800 pb-3 mb-4 text-muted-foreground text-sm py-2 lg:px-4",
        number
          ? "lg:grid-cols-[50px_50px_4fr_2fr_1fr_1fr]"
          : "lg:grid-cols-[50px_4fr_2fr_1fr_1fr]",
      )}
    >
      {number && <div className="hidden lg:block"></div>}
      <div className="hidden lg:block">#</div>
      <div>Title</div>
      <div className="hidden lg:block">Quality</div>
      <div className="hidden lg:block text-right">Duration</div>
      <div></div>
    </div>
  );
}
