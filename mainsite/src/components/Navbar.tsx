"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { BookOpen, Trophy, Users2, Calendar, MessageSquare, LogIn, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  {
    name: "Events",
    href: "/events",
    icon: Calendar,
  },
  
  {
    name: "Blog",
    href: "/blog",
    icon: BookOpen,
  },
  {
    name: "Leaderboards",
    href: "/leaderboards",
    icon: Trophy,
  },
  {
    name: "Chat",
    href: "/chat",
    icon: MessageSquare,
  },
];

export function Navbar() {
  const [active, setActive] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  return (
    <motion.div
      className={cn(
        "fixed inset-x-0 top-2 xs:top-4 z-50 mx-auto flex h-12 xs:h-14 sm:h-16 w-[98%] xs:w-[96%] max-w-7xl items-center justify-between rounded-full border border-white/[0.2] px-4 xs:px-6 sm:px-8 transition-colors duration-300",
        active ? "bg-black/70 backdrop-blur-md" : "bg-transparent backdrop-blur-md"
      )}
    >
      {/* Logo */}
      <Link
        href="/"
        className="relative z-10 flex items-center gap-1 xs:gap-2 text-lg xs:text-xl font-semibold text-white"
      >
        <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
          OPENGEEK <span className="text-xs sm:text-sm text-white/40">Community</span>
        </span>
        <span className="hidden xs:inline-block text-xs sm:text-sm text-white/50">Community</span>
      </Link>

      {/* Desktop Navigation - Hidden on Mobile */}
      <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
        <ul className="flex items-center gap-5 sm:gap-8">
          {navItems.map((item) => (
            <li key={item.name} className="relative group">
              <Link
                href={item.href}
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/70 transition-colors hover:text-white group relative px-3 py-2"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-lg transition-all duration-300 transform origin-center scale-75 group-hover:scale-110"></div>
                <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all duration-300 group-hover:scale-110 relative z-10" />
                <span className="relative z-10">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Desktop Login Button and Mobile Menu */}
      <div className="flex items-center gap-3">
        {/* Login Button - Hidden on Mobile */}
        <Link href="https://community.opengeek.in" target="_blank" className="hidden lg:block">
          <Button
            className="relative text-sm sm:text-base font-medium bg-gradient-to-r from-white/90 via-white/90 to-white/90 text-black hover:from-white hover:via-white hover:to-white transition-all duration-300 h-8 xs:h-9 sm:h-10 px-3 xs:px-4 sm:px-5 rounded-lg shadow-[0_0_0_1px_rgba(255,255,255,0.2)] hover:shadow-[0_0_0_2px_rgba(255,255,255,0.4),0_4px_6px_-1px_rgba(255,255,255,0.1),0_2px_4px_-1px_rgba(255,255,255,0.06)] backdrop-blur-sm"
          >
            <LogIn className="w-4 h-4" />
            Log In
          </Button>
        </Link>

        {/* Mobile Menu Button - Visible only on mobile */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-black/95 border-white/10">
              <SheetHeader>
                <SheetTitle className="text-white">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-8">
                <ul className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 text-base text-white/70 transition-colors hover:text-white group p-2 rounded-lg hover:bg-white/10"
                      >
                        <item.icon className="h-5 w-5 transition-colors group-hover:text-white" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  {/* Login Button in Mobile Menu */}
                  <li>
                    <Link
                      href="https://community.opengeek.in"
                      target="_blank"
                      className="flex items-center gap-3 text-base text-white/70 transition-colors hover:text-white group p-2 rounded-lg hover:bg-white/10"
                    >
                      <LogIn className="h-5 w-5 transition-colors group-hover:text-white" />
                      Log In
                    </Link>
                  </li>
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.div>
  );
}
