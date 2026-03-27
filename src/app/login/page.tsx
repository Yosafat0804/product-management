"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Eye, EyeOff, Package, Sparkles } from "lucide-react";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [touched, setTouched] = useState({ username: false, password: false });

  const validate = () => {
    if (!username.trim()) return "Nama pengguna wajib diisi";
    if (!password.trim()) return "Kata sandi wajib diisi";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTouched({ username: true, password: true });

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "Login gagal. Periksa username dan password.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950/80 to-slate-950 p-4 relative overflow-hidden noise-bg">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '1s' }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(oklch(0.8 0.15 270) 1px, transparent 1px), linear-gradient(90deg, oklch(0.8 0.15 270) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        {/* Floating badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-xs font-medium text-indigo-300">Sistem Manajemen Produk</span>
          </div>
        </div>

        <Card className="bg-card/60 backdrop-blur-2xl border-border/30 shadow-2xl shadow-indigo-500/5 animate-glow">
          <CardHeader className="text-center space-y-4 pb-2">
            <div className="mx-auto flex items-center justify-center w-18 h-18 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 shadow-xl shadow-indigo-500/30 animate-float">
              <Package className="h-9 w-9 text-white drop-shadow-lg" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold gradient-text">
                Selamat Datang
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1.5">
                Masuk ke Sistem Manajemen Produk
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2 animate-slide-up stagger-1">
                <Label htmlFor="username" className="text-sm font-medium">
                  Nama Pengguna
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan nama pengguna"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                  className={`h-11 bg-background/50 border-border/50 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-300 ${
                    touched.username && !username.trim() ? "border-destructive" : ""
                  }`}
                  disabled={isLoading}
                />
                {touched.username && !username.trim() && (
                  <p className="text-xs text-destructive animate-fade-in">Nama pengguna wajib diisi</p>
                )}
              </div>

              <div className="space-y-2 animate-slide-up stagger-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Kata Sandi
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    className={`h-11 pr-10 bg-background/50 border-border/50 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-300 ${
                      touched.password && !password.trim()
                        ? "border-destructive"
                        : ""
                    }`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-11 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {touched.password && !password.trim() && (
                  <p className="text-xs text-destructive animate-fade-in">Kata sandi wajib diisi</p>
                )}
              </div>

              {error && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 animate-scale-in">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="animate-slide-up stagger-3">
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-500 text-white font-semibold shadow-xl shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </Button>
              </div>

              <div className="relative animate-slide-up stagger-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/30" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card/60 px-3 text-muted-foreground">
                    Kredensial demo
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-indigo-500/5 to-violet-500/5 border border-indigo-500/10 px-4 py-3 space-y-1 animate-slide-up stagger-5">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-indigo-300">Nama Pengguna:</span>{" "}
                  <code className="bg-background/40 px-1.5 py-0.5 rounded text-foreground/80">emilys</code>
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-indigo-300">Kata Sandi:</span>{" "}
                  <code className="bg-background/40 px-1.5 py-0.5 rounded text-foreground/80">emilyspass</code>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer text */}
        <p className="text-center text-xs text-muted-foreground/50 mt-6 animate-fade-in stagger-6">
          © 2026 Sistem Manajemen Produk. Dibuat dengan Next.js & shadcn/ui
        </p>
      </div>
    </div>
  );
}
