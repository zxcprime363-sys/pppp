"use client";

import {
  ChevronRight,
  LogIn,
  Plus,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useState } from "react";

import {
  IconSquareNumber1,
  IconSquareNumber2,
  IconSquareNumber3,
  IconSquareNumber4,
  IconSquareNumber5,
  IconSquareNumber6,
  IconSquareNumber7,
  IconSquareNumber8,
  IconSquareNumber9,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useDroppable } from "@dnd-kit/core";
import { useCreatePlaylist } from "@/hooks/user/create-playlist";
import { usePlaylists } from "@/hooks/user/get-playlist";
import DroppablePlaylistItem from "../dnd/droppable";

export function NavMain({
  items,
  isLoggedIn,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  isLoggedIn: boolean;
}) {
  // const createPlaylist = usePlaylistStore((s) => s.createPlaylist);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const pathname = usePathname();
  // const handleCreate = () => {
  //   if (!title.trim()) return; // Require a name

  //   createPlaylist(title, description);
  //   setTitle(""); // Reset
  //   setDescription("");
  // };
  const numberIcons = [
    IconSquareNumber1,
    IconSquareNumber2,
    IconSquareNumber3,
    IconSquareNumber4,
    IconSquareNumber5,
    IconSquareNumber6,
    IconSquareNumber7,
    IconSquareNumber8,
    IconSquareNumber9,
  ];

  const handleCreate = () => {
    if (!title.trim()) return;

    createPlaylist.mutate({
      name: title,
      description,
    });

    setTitle("");
    setDescription("");
  };
  const createPlaylist = useCreatePlaylist();
  const { data } = usePlaylists();

  return (
    <SidebarGroup>
      <SidebarGroupLabel> Library</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <div className="flex">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>

                    <ChevronRight className="ml-auto  transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <button className="p-2  hover:bg-card rounded-md group-data-[collapsible=icon]:hidden">
                  <Link href={`/create-playlist`}>
                    <Plus className="size-5" />
                  </Link>
                </button>
              </div>
              <CollapsibleContent className="mt-3">
                <SidebarMenuSub>
                  {!data?.playlists?.length ? (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        className="pointer-events-none"
                      >
                        <span className="text-muted-foreground!">
                          <LogIn />
                          {!isLoggedIn ? (
                            <p>
                              <Link href={``}>Login</Link> to access playlists.
                            </p>
                          ) : (
                            "No playlist found."
                          )}
                        </span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ) : (
                    data.playlists.map((subItem, idx) => {
                      const Icon = numberIcons[idx];
                      return (
                        <DroppablePlaylistItem
                          key={subItem.id}
                          playlist={{ id: subItem.id, title: subItem.title }}
                          Icon={Icon}
                        />
                      );
                    })
                  )}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
