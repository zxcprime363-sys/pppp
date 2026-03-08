// hooks/use-session.ts
import { useQuery } from "@tanstack/react-query";

type User = {
  id: string;
  email: string;
  bio: string;
  full_name: string;
  username: string;
  avatar_url: string;
  created_at: string;
};

export function useSession() {
  const { data, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await fetch("/api/session", { credentials: "include" });
      if (!res.ok) return null;
      const data = await res.json();
      return (data.user as User) ?? null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  return {
    user: data ?? null,
    isLoggedIn: !!data,
    isLoading,
  };
}
