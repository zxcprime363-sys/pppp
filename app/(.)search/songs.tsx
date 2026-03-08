import Design1 from "@/components/ui/design-1";
import { TrackApi, TrackQueue } from "@/hooks/types";

export default function Songs({
  tracks,
  playlist,
}: {
  tracks: TrackApi[];
  playlist: TrackQueue[];
}) {
  return (
    <div className="py-5 space-y-3">
      {tracks.map((track, index) => (
        <Design1
          key={track.id}
          single={{
            track_id: String(track.id),
            album_id: String(track.album.id),
            artist_id: String(track.artist.id),
            title: track.title,
            artist: track.artist.name,
            duration: track.duration,
            cover_id: String(track.album.cover),
            quality: track.audioQuality,
            explicit: track.explicit,
          }}
          playlist={playlist}
          index={index}
        />
      ))}
    </div>
  );
}
