"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  MessageSquareIcon,
  SettingsIcon,
  LogOutIcon,
  PanelLeftIcon,
  PanelRightIcon,
  Info,
  Plus,
} from "lucide-react";
import Logo from "../shared/Logo";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Set sidebar state based on mobile detection
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const navItems = [
    {
      name: "AI-Bot",
      href: "/admin",
      icon: MessageSquareIcon,
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Mobile sidebar
  if (isMobile) {
    return (
      <div className="relative">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40">
              <PanelRightIcon className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="bg-background flex h-screen w-full flex-col justify-between">
              <div className="flex h-16 items-center justify-between px-4">
                <Logo />
              </div>
              <Separator />
              <ScrollArea className="flex-1 py-2">
                <nav className="grid gap-1 px-2 py-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "transparent hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        <item.icon className="mr-2 h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </ScrollArea>
              <Separator />
              <div className="p-4">
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                  <LogOutIcon className="mr-2 h-5 w-5" />
                  <span>Logga ut</span>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Desktop sidebar implementation with toggle
  return (
    <div className="relative flex">
      <div
        className={cn(
          "bg-background duration flex flex-col border-r transition-all",
          isSidebarOpen ? "w-64" : "w-24",
        )}
      >
        {isSidebarOpen ? (
          <div className="flex h-16 items-center justify-between px-4">
            <Logo />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="toggle-button"
            >
              <PanelLeftIcon className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex h-24 flex-col items-center justify-center gap-2 py-3">
            <div className="flex w-full items-center justify-center">
              <Plus className="text-background bg-primary flex justify-center rounded-md" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="toggle-button"
            >
              <PanelRightIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
        <Separator />
        <ScrollArea className="flex-1">
          <nav className="grid gap-1 px-2 py-2">
            <TooltipProvider delayDuration={0}>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Tooltip key={item.name} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "transparent hover:bg-accent hover:text-accent-foreground",
                          !isSidebarOpen && "justify-center",
                        )}
                      >
                        <item.icon className={cn("h-5 w-5", isSidebarOpen && "mr-2")} />
                        {isSidebarOpen && <span>{item.name}</span>}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className={isSidebarOpen ? "hidden" : "block"}>
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </nav>
        </ScrollArea>
        <div className="fixed bottom-0 p-4">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn("w-full", isSidebarOpen ? "justify-start" : "justify-center")}
                onClick={handleLogout}
              >
                <LogOutIcon className={cn("h-5 w-5", isSidebarOpen && "mr-2")} />
                {isSidebarOpen && <span>Logga ut</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className={isSidebarOpen ? "hidden" : "block"}>
              Logga ut
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
