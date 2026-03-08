"use client";

import * as React from "react";
import {
  GalleryVerticalEnd,
  Gift,
  Heart,
  Home,
  LifeBuoy,
  ListVideo,
  MessageCircleWarning,
  Send,
  Settings,
  ThumbsUp,
  Tv,
  UserRound,
  UserRoundCog,
} from "lucide-react";
import logo from "@/assets/1.svg";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/hooks/user/session";
import { cn } from "@/lib/utils";
import { usePrimaryColorStore } from "@/store/dynamic-color";
import { IconBrandFacebook } from "@tabler/icons-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, isLoggedIn, isLoading } = useSession();
  const data = {
    user: {
      name: user?.full_name || "Guest Mode",
      email: user?.email || "",
      avatar: user?.avatar_url || "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Playlist",
        url: "#",
        icon: ListVideo,
        isActive: true,
        // items: orderedPlaylists.map((playlist) => ({
        //   title: playlist.name,
        //   url: `/playlist/${playlist.id}`,
        // })),
      },
    ],
    navSecondary: [
      {
        title: "Support Us",
        url: "#",
        icon: ThumbsUp,
      },
      {
        title: "Report a problem",
        url: "#",
        icon: MessageCircleWarning,
      },
    ],
    projects: [
      {
        name: "Favorites",
        url: "/favorites",
        icon: Heart,
      },
      {
        name: "Recently Played",
        url: "/recently-played",
        icon: GalleryVerticalEnd,
      },
      {
        name: "Settings",
        url: "#",
        icon: Settings,
      },
    ],
  };
  const primaryColor = usePrimaryColorStore((state) => state.primaryColor);
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground pointer-events-none mt-2"
        >
          <div className="flex aspect-square group-data-[collapsible=icon]:size-8 size-12 items-center justify-center rounded-lg   group-data-[collapsible=icon]:p-1 p-1 ">
            <img src={logo.src} alt="" />
          </div>
          <div>
            <h1 className="font-bold  text-xl tracking-wide ">
              NEXT<span className="text-[#b29e84]">RAX</span>
            </h1>
            <h1 className="text-xs tracking-wide text-muted-foreground font-medium">
              MUSIC
            </h1>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className=" pt-5">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                style={
                  pathname === "/"
                    ? {
                        backgroundColor: "rgba(48, 50, 39, 0.5)",
                      }
                    : undefined
                }
              >
                <Link href="/">
                  <Home />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                style={
                  pathname === "/profile"
                    ? {
                        backgroundColor: "rgba(48, 50, 39, 0.5)",
                      }
                    : undefined
                }
              >
                <Link href="/profile">
                  <UserRoundCog />
                  <span>User Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="https://zxcprime.icu">
                  <Tv />
                  <span>Movies & TV Shows</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <NavMain items={data.navMain} isLoggedIn={isLoggedIn} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
