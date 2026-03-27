"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import { getProducts, type Product } from "@/lib/products";
import {
  Package,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Star,
  ShoppingBag,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const { user } = useAuth();
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProducts(5, 0);
        setTotalProducts(data.total);
        setRecentProducts(data.products);
      } catch (error) {
        console.error("Gagal memuat produk:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalValue = recentProducts.reduce((sum, p) => sum + p.price, 0);
  const avgRating =
    recentProducts.length > 0
      ? recentProducts.reduce((sum, p) => sum + p.rating, 0) /
        recentProducts.length
      : 0;

  const statsCards = [
    {
      title: "Total Produk",
      value: totalProducts.toString(),
      subtitle: "Produk tersedia di database",
      icon: Package,
      gradient: "from-indigo-500 to-blue-500",
      bgGlow: "bg-indigo-500/8",
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-400",
      borderGlow: "hover:shadow-indigo-500/10",
    },
    {
      title: "Rata-rata Rating",
      value: `${avgRating.toFixed(1)}/5`,
      subtitle: "Dari produk terbaru",
      icon: Star,
      gradient: "from-amber-500 to-orange-500",
      bgGlow: "bg-amber-500/8",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      borderGlow: "hover:shadow-amber-500/10",
    },
    {
      title: "Total Nilai",
      value: formatRupiah(totalValue),
      subtitle: "Total harga produk terbaru",
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-500",
      bgGlow: "bg-emerald-500/8",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      borderGlow: "hover:shadow-emerald-500/10",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-6 md:p-8 text-white animate-gradient animate-slide-up">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-float" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-float-slow" />
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl" />
          </div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm mb-4 text-xs font-medium">
              <Sparkles className="h-3 w-3" />
              Dasbor Manajemen
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Selamat Datang, {user?.firstName}! 👋
            </h1>
            <p className="mt-2 text-indigo-100/90 max-w-lg leading-relaxed">
              Kelola produk Anda dengan mudah. Lihat ringkasan data produk dan
              lakukan manajemen dari sini.
            </p>
            <Link href="/products">
              <Button
                variant="secondary"
                className="mt-5 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm shadow-lg shadow-black/10 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Kelola Produk
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statsCards.map((stat, index) => (
            <Card
              key={stat.title}
              className={`group relative overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${stat.borderGlow} animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background glow */}
              <div className={`absolute -top-12 -right-12 w-32 h-32 ${stat.bgGlow} rounded-full blur-2xl transition-all duration-500 group-hover:w-40 group-hover:h-40`} />

              <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-xl ${stat.iconBg} p-2.5 transition-transform duration-300 group-hover:scale-110`}>
                  <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="relative">
                {isLoading ? (
                  <Skeleton className="h-9 w-28" />
                ) : (
                  <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                )}
                <p className="text-xs text-muted-foreground mt-1.5">
                  {stat.subtitle}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Products */}
        <Card className="border-border/30 bg-card/60 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2.5">
                <div className="rounded-xl bg-indigo-500/10 p-2">
                  <BarChart3 className="h-4 w-4 text-indigo-400" />
                </div>
                Produk Terbaru
              </CardTitle>
              <CardDescription className="mt-1.5">5 produk teratas dari database</CardDescription>
            </div>
            <Link href="/products">
              <Button variant="outline" size="sm" className="border-border/30 hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/30 transition-all duration-300">
                Lihat Semua
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3">
                    <Skeleton className="h-14 w-14 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {recentProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 rounded-xl border border-border/20 bg-background/40 p-3.5 hover:bg-indigo-500/5 hover:border-indigo-500/20 transition-all duration-300 group cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${0.4 + index * 0.08}s` }}
                  >
                    <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-muted/50 shrink-0 ring-1 ring-border/20 group-hover:ring-indigo-500/30 transition-all duration-300">
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate group-hover:text-indigo-300 transition-colors">
                        {product.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="text-[10px] capitalize bg-indigo-500/10 text-indigo-300 border-0"
                        >
                          {product.category}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Star className="h-3 w-3 text-amber-400 mr-0.5 fill-amber-400" />
                          {product.rating}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                        {formatRupiah(product.price)}
                      </p>
                      <div className="flex items-center text-[11px] text-muted-foreground mt-0.5">
                        <ShoppingBag className="h-3 w-3 mr-0.5" />
                        {product.stock}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
