"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl animate-float-slow" />
        </div>
        <div className="flex flex-col items-center gap-4 relative animate-scale-in">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse" />
            <div className="relative rounded-full bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-4 border border-indigo-500/20">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
            </div>
          </div>
          <div className="text-center mt-2">
            <p className="text-sm font-medium text-foreground/80">Memuat...</p>
            <p className="text-xs text-muted-foreground mt-1">Menyiapkan aplikasi untuk Anda</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
