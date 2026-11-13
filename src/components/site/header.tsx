"use client";

import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { NAV_ITEMS } from "@/lib/content";
import { useSettings, useWaLink } from "@/hooks/use-settings";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const settings = useSettings();
  const wa = useWaLink();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "bg-white/95 backdrop-blur-md shadow-[0_6px_30px_-12px_rgba(16,42,67,0.18)] border-b border-slate-200/70"
          : "bg-transparent"
      )}
    >
      <div className="container-x flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 md:h-20">
        <a href="#beranda" aria-label={settings.company.name} className="shrink-0">
          <Logo variant={solid ? "dark" : "light"} />
        </a>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                solid
                  ? "text-slate-700 hover:text-royal hover:bg-mist"
                  : "text-slate-100 hover:text-white hover:bg-white/10"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="hidden md:inline-flex bg-gold-gradient text-navy shadow-sm hover:opacity-90"
          >
            <a href={wa()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-1.5 h-4 w-4" />
              Hubungi Konsultan
            </a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Buka menu"
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-lg xl:hidden",
                  solid
                    ? "text-navy hover:bg-mist"
                    : "text-white hover:bg-white/10"
                )}
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-l-0 bg-white p-0"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <Logo variant="dark" />
                  <SheetClose asChild>
                    <button
                      aria-label="Tutup menu"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy hover:bg-mist"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </SheetClose>
                </div>
                <nav className="scroll-elegant flex-1 overflow-y-auto px-3 py-4">
                  {NAV_ITEMS.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <a
                        href={item.href}
                        className="block rounded-lg px-4 py-3 text-[15px] font-medium text-slate-700 transition-colors hover:bg-mist hover:text-royal"
                      >
                        {item.label}
                      </a>
                    </SheetClose>
                  ))}
                </nav>
                <div className="border-t border-slate-100 p-5">
                  <Button
                    asChild
                    className="w-full bg-gold-gradient text-navy hover:opacity-90"
                  >
                    <a href={wa()} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Hubungi Konsultan
                    </a>
                  </Button>
                  <p className="mt-3 text-center text-xs text-slate-500">
                    {settings.contact.phone}
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
