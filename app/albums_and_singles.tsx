// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import { swiperConfigBackdrop } from "@/lib/swiper_config";
// import { ArrowRight, Play } from "lucide-react";
// import Link from "next/link";
// import AlbumsSingles from "@/hooks/publicAPI/albums_singles";

// export default function AlbumAndSingles() {
//   const { data } = AlbumsSingles({ isPh: true });
//   const albums = data ?? [];
//   return (
//     <div className="relative overflow-hidden">
//       <div className="text-lg flex justify-between items-center">
//         <h2 className=" font-medium mb-2 flex items-center gap-3">
//           Top Albums
//         </h2>
//         <button className="text-sm font-medium cursor-pointer hover:underline flex justify-center items-center gap-2">
//           Show All <ArrowRight className="size-4.5" />
//         </button>
//       </div>
//       <Swiper {...swiperConfigBackdrop} className="">
//         {albums.map((album, i) => (
//           <SwiperSlide key={album.id} className="p-1 w-auto!">
//             {album.coverArt && (
//               <Link href={`/album/${album.id}`}>
//                 <div className="group relative lg:size-50 size-40 overflow-hidden rounded-sm ">
//                   <img
//                     src={album.coverArt}
//                     alt={album.name}
//                     className="h-full w-full object-cover group-hover:scale-110 transition duration-400"
//                   />

//                   <div className="absolute inset-0 bg-linear-to-b from-transparent  to-black/80 lg:opacity-0 opacity-100 group-hover:opacity-100 transition duration-200 flex flex-col justify-end lg:p-4 p-2">
//                     <div className="mt-2 font-medium text-sm lg:text-base line-clamp-1">
//                       {album.name}
//                     </div>
//                     <div className="lg:text-sm text-xs text-muted-foreground">
//                       {album.artist}
//                     </div>
//                   </div>
//                   <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-200 bg-foreground rounded-full p-2">
//                     <Play className="fill-background size-5.5" />
//                   </button>
//                 </div>
//               </Link>
//             )}
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// }
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { swiperConfigBackdrop } from "@/lib/swiper_config";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import AlbumsSingles from "@/hooks/publicAPI/albums_singles";
import { Skeleton } from "@/components/ui/skeleton";

export default function AlbumAndSingles() {
  const { data, isLoading } = AlbumsSingles({ isPh: true });
  const albums = data ?? [];

  return (
    <div className="relative overflow-hidden">
      <div className="text-lg flex justify-between items-center">
        <h2 className=" font-medium mb-2 flex items-center gap-3">
          Top Albums
        </h2>
        <button className="text-sm font-medium cursor-pointer hover:underline flex justify-center items-center gap-2">
          Show All <ArrowRight className="size-4.5" />
        </button>
      </div>
      <Swiper {...swiperConfigBackdrop} className="">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <SwiperSlide key={i} className="p-1 w-auto!">
                <Skeleton className="lg:size-50 size-40 rounded-sm" />
              </SwiperSlide>
            ))
          : albums.map((album) => (
              <SwiperSlide key={album.id} className="p-1 w-auto!">
                {album.coverArt && (
                  <Link href={`/album/${album.id}`}>
                    <div className="group relative lg:size-50 size-40 overflow-hidden rounded-sm">
                      <img
                        src={album.coverArt}
                        alt={album.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition duration-400"
                      />
                      <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/80 lg:opacity-0 opacity-100 group-hover:opacity-100 transition duration-200 flex flex-col justify-end lg:p-4 p-2">
                        <div className="mt-2 font-medium text-sm lg:text-base line-clamp-1">
                          {album.name}
                        </div>
                        <div className="lg:text-sm text-xs text-muted-foreground">
                          {album.artist}
                        </div>
                      </div>
                      <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-200 bg-foreground rounded-full p-2">
                        <Play className="fill-background size-5.5" />
                      </button>
                    </div>
                  </Link>
                )}
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
}
