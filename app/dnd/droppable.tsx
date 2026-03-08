"use client";

import { useDroppable } from "@dnd-kit/core";
import Link from "next/link";
import {
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export default function DroppablePlaylistItem({
  playlist,
  Icon,
}: {
  playlist: { id: string; title: string };
  Icon?: any;
}) {
  const pathname = usePathname();

  const { setNodeRef, isOver } = useDroppable({
    id: `playlist-${playlist.id}`,
  });

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        ref={setNodeRef}
        asChild
        className={`
          ${pathname === `/playlist/${playlist.id}` ? "bg-sidebar-accent" : ""}
          ${isOver ? "bg-green-500/20" : ""}
        `}
      >
        <Link href={`/playlist/${playlist.id}`}>
          {Icon && <Icon />}
          <span className="capitalize">{playlist.title}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}
