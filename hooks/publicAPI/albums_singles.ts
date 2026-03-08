// "use client";
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";
// import { Albums } from "../types";

// export default function AlbumsSingles({ isPh }: { isPh: boolean }) {
//   const ph = "/popular-albums.json";
//   const international = "/popular-albums.json";
//   const toggle = isPh ? ph : international;
//   const query = useQuery<Albums[]>({
//     queryKey: ["top-albums-singles", isPh],
//     queryFn: async () => {
//       const res = await axios.get<Albums[]>(toggle);
//       return res.data;
//     },
//     retry: false,
//     staleTime: 1000 * 60 * 5,
//   });

//   return query;
// }
"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Albums } from "../types";

export default function AlbumsSingles({ isPh }: { isPh: boolean }) {
  const ph = "/popular-albums.json";
  const international = "/popular-albums.json";
  const toggle = isPh ? ph : international;
  const query = useQuery<Albums[]>({
    queryKey: ["top-albums-singles", isPh],
    queryFn: async () => {
      const res = await axios.get<Albums[]>(toggle);
      // Artificial delay of 1.5 seconds
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return res.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}