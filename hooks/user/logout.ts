// hooks/use-logout.ts
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      queryClient.resetQueries({ queryKey: ["session"] });
      queryClient.resetQueries({ queryKey: ["playlists-get"] });
      queryClient.resetQueries({ queryKey: ["favorites"] });
      queryClient.resetQueries({ queryKey: ["recently-played"] });
      router.push("/sign-in");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return { logout };
}
