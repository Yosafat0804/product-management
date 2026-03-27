"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  LogOut,
  ChevronLeft,
  Menu,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const navItems = [
  {
    label: "Dasbor",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Produk",
    href: "/products",
    icon: Package,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-card/80 backdrop-blur-sm border border-border/30 shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full flex flex-col border-r border-border/30 bg-sidebar/80 backdrop-blur-xl transition-all duration-300 ease-in-out",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo area */}
        <div
          className={cn(
            "flex items-center h-16 px-4 border-b border-border/20",
            collapsed ? "justify-center" : "gap-3"
          )}
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 text-white font-bold text-sm shrink-0 shadow-lg shadow-indigo-500/25 animate-glow">
            <Sparkles className="h-4 w-4" />
          </div>
          {!collapsed && (
            <span className="text-sm font-bold tracking-tight gradient-text truncate">
              Manajemen Produk
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/15 to-violet-500/15 text-indigo-300 shadow-sm border border-indigo-500/20"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-all duration-300",
                    isActive ? "text-indigo-400 drop-shadow-[0_0_6px_oklch(0.55_0.18_270/0.4)]" : ""
                  )}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <Separator className="opacity-20" />

        {/* User section */}
        <div className={cn("p-3 space-y-2", collapsed && "items-center")}>
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 bg-gradient-to-r from-indigo-500/5 to-transparent",
              collapsed && "justify-center px-2"
            )}
          >
            <Avatar className="h-9 w-9 shrink-0 ring-2 ring-indigo-500/20 ring-offset-2 ring-offset-sidebar">
              <AvatarImage src={user?.image} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-bold">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-sidebar-foreground">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            className={cn(
              "w-full text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 rounded-xl",
              collapsed ? "px-2 justify-center" : "justify-start"
            )}
            onClick={logout}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-2">Keluar</span>}
          </Button>
        </div>

        {/* Collapse toggle (desktop only) */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-5 -right-3 h-6 w-6 rounded-full border border-border/30 bg-card shadow-md hidden lg:flex hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft
            className={cn(
              "h-3 w-3 transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </aside>

      {/* Spacer for main content */}
      <div
        className={cn(
          "hidden lg:block shrink-0 transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64"
        )}
      />
    </>
  );
}
