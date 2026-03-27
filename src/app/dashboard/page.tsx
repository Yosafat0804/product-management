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
} from "lucide-react";
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
        console.error("Failed to fetch products:", error);
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 md:p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="relative">
            <h1 className="text-2xl md:text-3xl font-bold">
              Selamat Datang, {user?.firstName}! 👋
            </h1>
            <p className="mt-2 text-indigo-100 max-w-lg">
              Kelola produk Anda dengan mudah. Lihat ringkasan data produk dan
              lakukan manajemen dari sini.
            </p>
            <Link href="/products">
              <Button
                variant="secondary"
                className="mt-4 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
              >
                Kelola Produk
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Produk
              </CardTitle>
              <div className="rounded-lg bg-indigo-500/10 p-2">
                <Package className="h-4 w-4 text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-3xl font-bold">{totalProducts}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Produk tersedia di database
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rata-rata Rating
              </CardTitle>
              <div className="rounded-lg bg-emerald-500/10 p-2">
                <Star className="h-4 w-4 text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-3xl font-bold">
                  {avgRating.toFixed(1)}
                  <span className="text-lg text-muted-foreground">/5</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Dari produk terbaru
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Nilai
              </CardTitle>
              <div className="rounded-lg bg-amber-500/10 p-2">
                <DollarSign className="h-4 w-4 text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="text-3xl font-bold">
                  ${totalValue.toFixed(0)}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Total harga produk terbaru
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Products */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-400" />
                Produk Terbaru
              </CardTitle>
              <CardDescription>5 produk teratas dari database</CardDescription>
            </div>
            <Link href="/products">
              <Button variant="outline" size="sm" className="border-border/50">
                Lihat Semua
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {recentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 rounded-lg border border-border/30 bg-background/50 p-3 hover:bg-accent/50 transition-colors group"
                  >
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {product.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge
                          variant="secondary"
                          className="text-xs capitalize"
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
                      <p className="text-sm font-semibold text-indigo-400">
                        ${product.price}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
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
