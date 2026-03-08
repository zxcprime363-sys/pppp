"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DynamicBreadcrumb from "@/components/ui/breadcrumb-dynamic";
import { useIsMobile } from "@/hooks/use-mobile";
export default function Header() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [firstTyped, setFirstTyped] = useState(false); // track first character
  const router = useRouter();
  const isMobile = useIsMobile();
  const handleSearch = useDebouncedCallback((value: string) => {
    if (value.trim()) {
      if (!firstTyped) {
        console.log("First character typed → push");
        router.push(`/search?q=${encodeURIComponent(value)}`, {
          scroll: false,
        });
        setFirstTyped(true);
      } else {
        console.log("Subsequent characters → replace");
        router.replace(`/search?q=${encodeURIComponent(value)}`, {
          scroll: false,
        });
      }
    } else {
      console.log("Input cleared → go back");
      router.back();
      setFirstTyped(false); // reset for next search
    }
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  return (
    <header className="sticky top-0  z-30 flex justify-between h-16 shrink-0 items-center gap-2 bg-background rounded-t-md ">
      <div className=" flex items-center gap-2 lg:px-4 px-2">
        <SidebarTrigger className="-ml-1" />
        <div className="h-4 w-px bg-muted"></div>
        <DynamicBreadcrumb />
      </div>

      <div className="flex items-center gap-3 lg:pr-4 pl-2 pr-3 lg:w-md relative">
        {!isMobile && (
          <div className="flex-1 hidden lg:block">
            <span className="p-3  absolute">
              <Search className="size-4 text-muted-foreground" />
            </span>
            <Input
              className="flex-1 pl-10  lg:border-none text-sm lg:text-base"
              placeholder="Search your favorite music..."
              value={query}
              type="search"
              onChange={handleChange}
            />
          </div>
        )}
        {isMobile && (
          <button onClick={() => setOpen((prev) => !prev)}>
            <Search className="size-5 text-muted-foreground" />
          </button>
        )}
        <div className="h-4 w-px bg-muted"></div>
        <Avatar className="size-9">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>

      {isMobile && open && (
        <div className="absolute inset-x-0 top-full bg-background pl-2 pr-3 pb-2">
          <span className="p-3  absolute">
            <Search className="size-4 text-muted-foreground" />
          </span>
          <Input
            className="flex-1 pl-10  lg:border-none text-sm lg:text-base"
            placeholder="Search your favorite music..."
            value={query}
            type="search"
            onChange={handleChange}
          />
        </div>
      )}
    </header>
  );
}
