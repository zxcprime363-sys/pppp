"use client";
import { useSession } from "@/hooks/user/session";
import AlbumAndSingles from "./albums_and_singles";
import SwiperPopular from "./popular-tracks";
import TopArtist from "./top_artist";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit, LogIn } from "lucide-react";
import RecentlyPlayed from "./recently_played";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import Footer from "./footer";
export default function Home() {
  const { isLoggedIn, isLoading } = useSession();
  return (
    <div className="lg:p-4 p-2 space-y-10">
      {!isLoggedIn && !isLoading && (
        <>
          <div className="relative overflow-hidden py-15">
            <div className="relative z-10 max-w-xl ">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-semibold mb-3">
                Music, Reimagined
              </p>
              <h1
                style={{
                  textShadow: "1px 1px 1px rgba(0,0,0,0.2)",
                }}
                className="text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-white"
              >
                <motion.span
                  className="bg-linear-to-r from-[rgb(237,236,233)] via-[rgb(94,84,72)] to-[rgb(172,149,119)] bg-clip-text text-transparent"
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  NEXTRAX
                </motion.span>
              </h1>
              <p className="mt-4  text-muted-foreground leading-relaxed ">
                Discover new music, explore top artists, and stream your
                favorite tracks. Sign in to unlock personalized playlists and
                recommendations.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link scroll={false} href="/sign-in">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  size="lg"
                  className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-300"
                >
                  <Link scroll={false} href="/sign-up">
                    <Edit className="w-4 h-4 mr-2" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right-side floating stat pills */}
            <div className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3">
              {[
                { label: "Tracks", value: "10M+" },
                { label: "Artists", value: "500K+" },
                { label: "Listeners", value: "2M+" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm px-5 py-3 text-center"
                >
                  <span className="text-xl font-bold text-white">
                    {stat.value}
                  </span>
                  <span className="text-xs text-zinc-400 mt-0.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      <SwiperPopular />
      <RecentlyPlayed />
      <TopArtist />
      <AlbumAndSingles />

      <Footer />
    </div>
  );
}
//  <span className="bg-linear-to-r from-[rgb(237,236,233)] via-[rgb(94,84,72)] to-[rgb(172,149,119)] bg-clip-text text-transparent">
//    NEXTRAX
//  </span>;
