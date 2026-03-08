import { useRef, useEffect, useState } from "react";
import { LyricLine } from "@/hooks/publicAPI/lyrics";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ListMusic } from "lucide-react";

interface Props {
  lyrics: LyricLine[];
  activeLyricIndex: number;
  onSeek?: (timeMs: number) => void;
}

export default function LyricsPanel({
  lyrics,
  activeLyricIndex,
  onSeek,
}: Props) {
  const [open, setOpen] = useState(false);
  const activeRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (!open) return;
  //   activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  // }, [activeLyricIndex, open]);
  useEffect(() => {
    if (!open || !activeRef.current) return;

    const element = activeRef.current;
    const container = element.parentElement;
    if (!container) return;

    const target =
      element.offsetTop - container.clientHeight / 2 + element.clientHeight / 2;

    const start = container.scrollTop;
    const distance = target - start;
    const duration = 800;
    let startTime: number | null = null;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);

      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      container.scrollTop = start + distance * ease;

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [activeLyricIndex, open]);
  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <button className="opacity-80 hover:opacity-100">
          <ListMusic className="size-6" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="bg-card/80 backdrop-blur-2xl border-none">
        <DrawerHeader>
          <DrawerTitle>Lyrics</DrawerTitle>
        </DrawerHeader>
        {!lyrics.length ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No lyrics available
          </div>
        ) : (
          <div className="overflow-y-auto h-full px-6 py-[calc(50vh-100px)] space-y-8 text-center overflow-x-hidden">
            {lyrics.map((line, i) => (
              <div
                key={i}
                ref={i === activeLyricIndex ? activeRef : null}
                onClick={() => onSeek?.(line.time)}
                className={cn(
                  "transform-gpu  text-lg transition-all duration-500 cursor-pointer select-none",
                  i === activeLyricIndex
                    ? "text-foreground font-semibold text-3xl"
                    : "text-muted-foreground hover:text-white/70",
                )}
              >
                {line.text}
              </div>
            ))}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
