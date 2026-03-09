import { Badge } from "@/components/ui/badge";
import CardBar from "@/components/ui/card-bar";
import { useSession } from "@/hooks/user/session";
import { useRecentlyPlayed } from "@/hooks/user/recently_played";
import { Library, Lock } from "lucide-react";
import Design1 from "@/components/ui/design-1";
import HeaderRow from "@/components/ui/header-row";
import { Design1Skeleton } from "@/components/ui/Design1Skeleton";

export default function RecentlyPlayed() {
  const { data, isLoading } = useRecentlyPlayed();
  const history = data?.tracks ?? [];
  const { isLoggedIn } = useSession();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h1 className="font-medium lg:text-lg">Recently Played</h1>
        {!isLoggedIn && (
          <Badge variant="secondary">
            <Lock />
            Login required
          </Badge>
        )}
      </div>
      {history.length !== 0 && <HeaderRow number={false} />}
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Design1Skeleton key={i} number={false} />
        ))
      ) : history.length === 0 ? (
        <div className="flex items-center lg:h-40 gap-5 border border-dashed p-4 rounded-md">
          <div className="bg-card p-4 rounded-md">
            <Library className="size-10" />
          </div>
          <div>
            <h2 className="font-semibold lg:text-base text-sm text-muted-foreground">
              No recently played tracks
            </h2>
            <p className="lg:text-sm text-xs text-muted-foreground max-w-xs mt-2">
              {isLoggedIn
                ? "Your recently played songs will appear here. Start by playing your favorite music."
                : "Sign in to track your listening history and pick up where you left off."}
            </p>
          </div>
        </div>
      ) : (
        <div>
          {data?.tracks.slice(0, 3).map((recent, index) => (
            <Design1
              key={recent.id}
              single={{
                track_id: recent.track_id,
                album_id: recent.track_album_id,
                artist_id: recent.track_artist,
                title: recent.track_title,
                artist: recent.track_artist,
                cover_id: recent.track_cover_id,
                duration: recent.track_duration,
                quality: recent.track_quality,
                explicit: recent.explicit,
              }}
              index={index}
              playlist={[
                {
                  track_id: recent.track_id,
                  album_id: recent.track_album_id,
                  artist_id: recent.track_artist,
                  title: recent.track_title,
                  artist: recent.track_artist,
                  cover_id: recent.track_cover_id,
                  duration: recent.track_duration,
                  quality: recent.track_quality,
                  explicit: recent.explicit,
                },
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
