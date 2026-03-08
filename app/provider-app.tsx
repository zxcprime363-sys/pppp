import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { AppSidebar } from "./sidebar/app-sidebar";
import { cn } from "@/lib/utils";
import Header from "./header";
import { SidebarRight } from "./sidebar/app-sidebar-right";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import { usePrimaryColorStore } from "@/store/dynamic-color";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePlayerStore } from "@/store/playback";
import { useAddTrack } from "@/hooks/user/add-tracks";
import { SupabaseTrack } from "@/hooks/user/playlist-tracks-id";
import ColorThief from "color-thief-browser";
import { Music } from "lucide-react";
import AudioPlayer from "./audio_player";
import { ScrollReset } from "./scroll-reset";
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTrack, setActiveTrack] = useState<SupabaseTrack | null>(null);

  const queue = usePlayerStore((state) => state.queue);

  const currentIndex = usePlayerStore((state) => state.currentIndex);

  const currentTrackCover = queue[currentIndex]?.cover_id;

  const isMobile = useIsMobile();
  const addToQueue = usePlayerStore((state) => state.addToQueue);

  const [activeId, setActiveId] = useState<string | null>(null);
  const primaryColor = usePrimaryColorStore((state) => state.primaryColor);
  const setPrimaryColor = usePrimaryColorStore(
    (state) => state.setPrimaryColor,
  );
  const addTrack = useAddTrack();
  console.log("cccc", primaryColor);
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || !activeTrack) return;

    const overId = String(over.id);
    if (overId === "queue-list") {
      addToQueue({
        track_id: String(activeTrack.track_id),
        album_id: activeTrack.track_album_id,
        artist_id: activeTrack.track_artist_id,
        title: activeTrack.track_title,
        artist: activeTrack.track_artist,
        duration: activeTrack.track_duration,
        cover_id: activeTrack.track_cover_id,
        quality: activeTrack.track_quality,
        explicit: activeTrack.explicit,
      });
      return;
    }

    if (overId.startsWith("playlist-")) {
      const playlistId = overId.replace("playlist-", "");
      addTrack.mutate({
        playlistId,
        track_id: activeTrack.track_id,
        track_album_id: activeTrack.track_album_id,
        track_artist_id: activeTrack.track_artist_id,
        track_title: activeTrack.track_title,
        track_artist: activeTrack.track_artist,
        track_duration: activeTrack.track_duration,
        track_cover_id: activeTrack.track_cover_id,
        explicit: activeTrack.explicit,
        track_quality: activeTrack.track_quality,
      });
      return;
    }
  }
  useEffect(() => {
    if (!currentTrackCover) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `/api/proxy-image?url=https://resources.tidal.com/images/${currentTrackCover.replace(/-/g, "/")}/750x750.jpg`;

    img.onload = () => {
      try {
        const thief = new ColorThief();
        const [r, g, b] = thief.getColor(img);
        setPrimaryColor(`${r}, ${g}, ${b}`);
        console.log("color extracted:", r, g, b);
      } catch (e) {
        console.error("ColorThief error:", e);
      }
    };
  }, [currentTrackCover]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <div
          className="fixed inset-0 transition-all duration-700"
          style={{
            background: `linear-gradient(to bottom, rgba(${primaryColor},0.8), var(--background) 45%, var(--background))`,
          }}
        />

        <DndContext
          onDragStart={(e) => {
            setActiveId(e.active.id as string);
            setActiveTrack(e.active.data.current?.track ?? null);
          }}
          onDragEnd={(e) => {
            handleDragEnd(e);
            setActiveId(null);
          }}
        >
          <AppSidebar />
          <SidebarInset
            className={cn(
              "relative min-w-0 overflow-hidden max-h-[calc(100vh-4px)]",
            )}
          >
            <ScrollReset>
              <div
                className="absolute inset-0 z-0 rounded-lg max-h-screen"
                style={{
                  background: `linear-gradient(to bottom,rgba(${primaryColor},0.5), var(--background) 40%, var(--background))`,
                }}
              />
              <div
                className="absolute inset-0 z-0 rounded-lg max-h-screen"
                style={{
                  background: `radial-gradient(ellipse 100% 60% at 50% 0%, rgba(${primaryColor},0.5), transparent 70%)`,
                }}
              />
              <Header />
              <div className="relative flex-1 z-10">{children}</div>
              <AudioPlayer />
            </ScrollReset>
          </SidebarInset>
          {!isMobile && currentTrackCover && <SidebarRight />}
          <DragOverlay dropAnimation={null}>
            {activeTrack ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-card text-white shadow-xl text-sm font-medium w-fit">
                <Music className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">
                  {activeTrack.track_title} - {activeTrack.track_artist}
                </span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </SidebarProvider>
      <Toaster />
    </ThemeProvider>
  );
}
