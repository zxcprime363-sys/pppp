import Link from "next/link";
import { Hexagon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { label: "Products", href: "#" },
  { label: "About", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Contact", href: "#" },
];

const legalLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a]  w-full">
      {/* Top bar */}
      <div className=" px-6 py-5 flex items-center justify-between">
        <h3 className="text-xl font-bold">NEXTRAX</h3>

        <div className="flex items-center justify-center size-9 rounded-full border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-all"></div>
      </div>

      <Separator />

      {/* Bottom bar */}
      <div className=" px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="  leading-relaxed text-sm">
          <p>© 2026 Nextrax Music</p>
          <p>All rights reserved</p>
        </div>

        <div className="flex flex-col items-end gap-1.5 text-muted-foreground">
          <nav className="flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className=" font-semibold  hover:text-zinc-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <nav className="flex items-center gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="  hover:text-zinc-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
