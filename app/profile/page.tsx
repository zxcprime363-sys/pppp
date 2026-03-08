"use client";

import { Button } from "@/components/ui/button";
import { usePlaylists } from "@/hooks/user/get-playlist";
import { useSession } from "@/hooks/user/session";
import {
  Dot,
  Edit,
  Heart,
  Image,
  ListMusic,
  MoreHorizontal,
  Music,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormValues, SignUpResponse } from "../@modal/(.)sign-up/page";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tailspin } from "ldrs/react";
import { Textarea } from "@/components/ui/textarea";
import { useStats } from "@/hooks/user/stats";
import { coverUrl } from "@/lib/coverUrl";
import Link from "next/link";
import { useRecentlyPlayed } from "@/hooks/user/recently_played";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
const topArtists = [
  { name: "Cup of Joe" },
  { name: "Lofi Beats" },
  { name: "Dream Pop" },
];

const recentTracks = [
  { title: "Song A", artist: "Artist 1", time: "3h ago" },
  { title: "Song B", artist: "Artist 2", time: "5h ago" },
  { title: "Song C", artist: "Artist 3", time: "7h ago" },
];

const activity = Array.from({ length: 6 }, (_, i) => ({
  title: `Recently Played #${i + 1}`,
  artist: "Artist Name",
  ago: "3 hours ago",
}));
const updateProfileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  bio: z.string().optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
});
type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
export default function Profile() {
  const router = useRouter();
  const { user, isLoggedIn } = useSession();
  const { data } = useStats();
  const { data: playlists } = usePlaylists();
  const { data: recent } = useRecentlyPlayed();
  const listeningTime = formatListeningTime(data?.listening_time);
  const listenedToday = formatListeningTime(data?.listened_today);
  const tracks_played = data?.tracks_played;
  const user_stats = [
    {
      value: listeningTime,
      label: "Listening Time",
    }, // all time
    { value: listenedToday, label: "Listened Today" }, // today
    { value: "Cup of Joe", label: "Top Artist" },
    { value: tracks_played, label: "Tracks Played" },
  ];

  const form = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      full_name: user?.full_name ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
      bio: user?.bio ?? "",
      password: "",
    },
  });
  const mutation = useMutation({
    mutationFn: async (values: UpdateProfileValues) => {
      const { data } = await axios.post<SignUpResponse>(
        "/api/update-profile",
        values,
      );
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.error || "Sign up failed");
      }
    },
    onError: (error: any) => {
      form.setError("root", {
        message: error.response?.data?.error || "Something went wrong",
      });
    },
  });

  function onSubmit(values: UpdateProfileValues) {
    mutation.mutate(values);
  }

  return (
    <div className="">
      <div className="relative  p-6  space-y-3">
        <Button className="absolute right-6 top-6" variant="outline" size="lg">
          <Edit />
        </Button>

        <div className="relative w-fit">
          <div className="size-30 rounded-full  bg-zinc-800  flex items-center justify-center text-4xl font-bold  overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} className="h-full w-full" />
            ) : (
              user?.full_name.slice(0, 2)
            )}
          </div>
          <span className="absolute bottom-2 right-2 size-4 bg-green-500 rounded-full " />
        </div>

        <div className="">
          <h1 className="text-4xl font-bold line-clamp-1">{user?.full_name}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {user?.email} · Joined {formatJoinDate(user?.created_at)}
          </p>
          <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
            <span>
              <span className="text-white font-medium">
                {data?.playlist_count}
              </span>{" "}
              Playlists
            </span>
            <span>
              <span className="text-white font-medium">
                {data?.favorites_count}
              </span>{" "}
              Favorites
            </span>
          </div>
        </div>
      </div>
      {user?.bio && (
        <div className="flex justify-between items-center p-6">
          <p className="  leading-relaxed border-l-2 border-[#b29e84] pl-4">
            {user?.bio}
          </p>
        </div>
      )}
      <div className="lg:p-6 mt-3 bg-card">
        <div className="bg-border grid grid-cols-2 lg:grid-cols-4 gap-px">
          {user_stats.map((stat, i) => (
            <div
              key={i}
              className="relative lg:px-6 lg:py-2 p-4  overflow-hidden bg-card "
            >
              <p className="lg:text-3xl text-2xl font-semibold tracking-tight relative z-10">
                {stat.value}
              </p>
              <p className="text-muted-foreground text-xs mt-2 uppercase tracking-widest relative z-10">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      <section className="p-6">
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest mb-4">
          Playlist
        </p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {playlists?.playlists.slice(0, 4).map((pl, i) => {
            const covers = pl.playlist_tracks
              .slice(0, 4)
              .map((t) => t.track_cover_id);
            const rotate = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2"][
              i % 4
            ];
            return (
              <Link key={pl.id} href={`/playlist/${pl.id}`}>
                <div
                  className={`group cursor-pointer bg-card  p-2 rounded-lg shadow-xl hover:rotate-0 transition-all ${rotate}`}
                >
                  <div className="aspect-square rounded-md overflow-hidden bg-zinc-800">
                    {covers.length > 0 ? (
                      <div className="grid grid-cols-2 w-full h-full">
                        {covers.map((cover_id, i) => (
                          <img
                            key={i}
                            src={coverUrl(cover_id)}
                            className="w-full h-full object-cover"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center  font-black text-muted-foreground">
                        <Image className="size-10" />
                      </div>
                    )}
                  </div>
                  <p className="text-center text-sm font-semibold mt-3 truncate px-1">
                    {pl.title}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
function formatJoinDate(dateString?: string) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}
function formatListeningTime(seconds?: number) {
  if (!seconds || seconds <= 0) return "0h 0m";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${hours}h ${minutes}m`;
}
function fmt(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
