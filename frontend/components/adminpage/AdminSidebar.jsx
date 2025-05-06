"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  MessageSquareIcon,
  SettingsIcon,
  UsersIcon,
  FileTextIcon,
  LogOutIcon,
} from "lucide-react";
import Logo from "../shared/Logo";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      name: "Översikt",
      href: "/admin",
      icon: HomeIcon,
    },
    {
      name: "AI-Bot Inställningar",
      href: "/admin/ai-settings",
      icon: MessageSquareIcon,
    },
    {
      name: "Systeminställningar",
      href: "/admin/system-settings",
      icon: SettingsIcon,
    },
    {
      name: "Användare",
      href: "/admin/users",
      icon: UsersIcon,
    },
    {
      name: "Loggfiler",
      href: "/admin/logs",
      icon: FileTextIcon,
    },
  ];

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="bg-card flex min-h-screen w-64 flex-col border-r p-5">
      <Logo />
      <nav className="mt-7 flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center rounded-md px-4 py-3 text-sm transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="text-muted-foreground hover:bg-accent hover:text-foreground flex w-full items-center rounded-md px-4 py-3 text-sm transition-colors"
        >
          <LogOutIcon className="mr-3 h-5 w-5" />
          Logga ut
        </button>
      </nav>
    </div>
  );
}
