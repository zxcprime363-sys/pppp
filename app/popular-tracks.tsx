// "use client";

// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import { Navigation, Pagination, Keyboard, Scrollbar } from "swiper/modules";
// import { useState } from "react";
// import { SwiperOptions } from "swiper/types";
// import { ArrowLeftRight, ArrowRight, ArrowRightLeft, Play } from "lucide-react";
// import Link from "next/link";

// import usePopularTracks from "@/hooks/publicAPI/popular";
// export default function SwiperPopular() {
//   const [isPh, setIsPh] = useState(true);
//   const { data } = usePopularTracks({ isPh });

//   const tracks = data ?? [];
//   return (
//     <div className="relative overflow-hidden">
//       <div className="lg:text-lg  flex justify-between items-center">
//         <h2 className=" font-medium mb-2 flex items-center lg:gap-3 gap-1.5">
//           {isPh ? "PH Popular Songs" : "INT Popular Songs"}
//           <button onClick={() => setIsPh((prev) => !prev)}>
//             {isPh ? (
//               <ArrowRightLeft className="size-4.5" />
//             ) : (
//               <ArrowLeftRight className="size-4.5" />
//             )}
//           </button>
//         </h2>
//         <Link href="/popular">
//           <button className="text-sm text-muted-foreground font-medium cursor-pointer hover:underline flex justify-center items-center gap-2">
//             Show All <ArrowRight className="size-4.5" />
//           </button>
//         </Link>
//       </div>
//       <Swiper {...swiperConfigBackdrop} className="">
//         {tracks.map((track) => (
//           <SwiperSlide key={track.id} className="p-1 lg:w-42! ">
//             {track.coverArt && (
//               <Link href={`/album/${track.album.id}`}>
//                 <div className="group relative overflow-hidden rounded-sm ">
//                   <img
//                     src={track.coverArt}
//                     alt={track.album.name}
//                     className="h-full w-full object-cover group-hover:scale-110 transition duration-400"
//                   />

//                   <div className="absolute inset-0 bg-linear-to-b from-transparent  to-black/80 opacity-0 group-hover:opacity-100 transition duration-200"></div>
//                   <button className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition duration-200 bg-foreground rounded-full p-2">
//                     <Play className="fill-background size-5.5" />
//                   </button>
//                 </div>
//               </Link>
//             )}
//             <div className="mt-2 font-medium text-sm lg:text-base line-clamp-1 ">
//               {track.title}
//             </div>
//             <div className="lg:text-sm text-xs text-muted-foreground line-clamp-1">
//               {track.artist}
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// }
// const swiperConfigBackdrop: SwiperOptions = {
//   keyboard: { enabled: true },

//   modules: [Navigation, Pagination, Keyboard, Scrollbar],
//   slidesPerView: "auto",
//   spaceBetween: 3,
// };
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, Pagination, Keyboard, Scrollbar } from "swiper/modules";
import { useState } from "react";
import { SwiperOptions } from "swiper/types";
import { ArrowLeftRight, ArrowRight, ArrowRightLeft, Play } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

import usePopularTracks from "@/hooks/publicAPI/popular";

export default function SwiperPopular() {
  const [isPh, setIsPh] = useState(true);
  const { data, isLoading } = usePopularTracks({ isPh });

  const tracks = data ?? [];
  return (
    <div className="relative overflow-hidden">
      <div className="lg:text-lg  flex justify-between items-center">
        <h2 className=" font-medium mb-2 flex items-center lg:gap-3 gap-1.5">
          {isPh ? "PH Popular Songs" : "INT Popular Songs"}
          <button onClick={() => setIsPh((prev) => !prev)}>
            {isPh ? (
              <ArrowRightLeft className="size-4.5" />
            ) : (
              <ArrowLeftRight className="size-4.5" />
            )}
          </button>
        </h2>
        <Link href="/popular">
          <button className="text-sm text-muted-foreground font-medium cursor-pointer hover:underline flex justify-center items-center gap-2">
            Show All <ArrowRight className="size-4.5" />
          </button>
        </Link>
      </div>
      <Swiper {...swiperConfigBackdrop} className="">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <SwiperSlide key={i} className="p-1 lg:w-42! w-42!">
                <Skeleton className="aspect-square w-full rounded-sm" />
                <Skeleton className="mt-2 h-4 w-3/4 rounded" />
                <Skeleton className="mt-1.5 h-3 w-1/2 rounded" />
              </SwiperSlide>
            ))
          : tracks.map((track) => (
              <SwiperSlide key={track.id} className="p-1 lg:w-42! w-42!">
                {track.coverArt && (
                  <Link href={`/album/${track.album.id}`}>
                    <div className="group relative overflow-hidden rounded-sm">
                      <img
                        src={track.coverArt}
                        alt={track.album.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition duration-400"
                      />
                      <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/80 opacity-0 group-hover:opacity-100 transition duration-200"></div>
                      <button className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition duration-200 bg-foreground rounded-full p-2">
                        <Play className="fill-background size-5.5" />
                      </button>
                    </div>
                  </Link>
                )}
                <div className="mt-2 font-medium text-sm lg:text-base line-clamp-1">
                  {track.title}
                </div>
                <div className="lg:text-sm text-xs text-muted-foreground line-clamp-1">
                  {track.artist}
                </div>
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
}

const swiperConfigBackdrop: SwiperOptions = {
  keyboard: { enabled: true },
  modules: [Navigation, Pagination, Keyboard, Scrollbar],
  slidesPerView: "auto",
  spaceBetween: 3,
};
