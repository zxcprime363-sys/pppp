"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DynamicBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const current = segments.at(-1);
  const parent = segments.at(-2);

  const format = (s: string) => decodeURIComponent(s).replace(/-/g, " ");

  // Single segment — just show the page
  if (segments.length <= 1) {
    return (
      <Breadcrumb className="ml-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">
              {format(current ?? "Home")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Multiple segments — show parent > current
  return (
    <Breadcrumb className="ml-1">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href={"/" + segments.slice(0, -1).join("/")}
            className="capitalize"
          >
            {format(parent!)}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="capitalize">
            {format(current!)}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
