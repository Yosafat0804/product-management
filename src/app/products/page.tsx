"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  getProducts,
  searchProducts,
  deleteProduct,
  type Product,
} from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteDialog } from "@/components/delete-dialog";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  Package,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/utils";

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const skip = (page - 1) * ITEMS_PER_PAGE;
      const data = debouncedQuery
        ? await searchProducts(debouncedQuery, ITEMS_PER_PAGE, skip)
        : await getProducts(ITEMS_PER_PAGE, skip);
      setProducts(data.products);
      setTotal(data.total);
    } catch (error) {
      console.error("Gagal memuat produk:", error);
      toast.error("Gagal memuat produk");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setTotal((prev) => prev - 1);
      toast.success(`"${deleteTarget.title}" berhasil dihapus`);
      setDeleteTarget(null);
    } catch {
      toast.error("Gagal menghapus produk");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-up">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <div className="rounded-xl bg-indigo-500/10 p-2.5">
                <Package className="h-5 w-5 text-indigo-400" />
              </div>
              <span className="gradient-text">Daftar Produk</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5 ml-[52px]">
              {total} produk ditemukan
            </p>
          </div>
          <Link href="/products/create">
            <Button className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/20 transition-all duration-300 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 rounded-xl h-11 px-6">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Produk
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-md animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-card/60 border-border/30 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl backdrop-blur-sm transition-all duration-300"
          />
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="border-border/30 bg-card/60 overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="h-52 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex justify-between pt-1">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="rounded-2xl bg-indigo-500/10 p-5 mb-5">
                <Package className="h-12 w-12 text-indigo-400/50" />
              </div>
              <h3 className="text-lg font-semibold text-muted-foreground">
                Tidak ada produk ditemukan
              </h3>
              <p className="text-sm text-muted-foreground/60 mt-1.5">
                {debouncedQuery
                  ? "Coba kata kunci lain"
                  : "Mulai tambahkan produk baru"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <Card
                key={product.id}
                className="group border-border/20 bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/5 hover:border-indigo-500/20 animate-slide-up gradient-border"
                style={{ animationDelay: `${0.1 + index * 0.04}s` }}
              >
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    {/* Overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="secondary"
                        className="bg-black/50 text-white border-0 backdrop-blur-md text-[10px] uppercase tracking-wider font-medium"
                      >
                        {product.category}
                      </Badge>
                    </div>
                    {product.discountPercentage > 0 && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 text-[10px] font-bold shadow-lg shadow-red-500/30">
                          -{Math.round(product.discountPercentage)}%
                        </Badge>
                      </div>
                    )}

                    {/* Action buttons on hover */}
                    <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <Link href={`/products/${product.id}/edit`}>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-9 w-9 bg-white/90 hover:bg-white text-slate-700 hover:text-indigo-600 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-200 hover:scale-110"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-9 w-9 bg-white/90 hover:bg-white text-slate-700 hover:text-red-500 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-200 hover:scale-110"
                        onClick={() => setDeleteTarget(product)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <CardHeader className="p-0">
                        <CardTitle className="text-sm font-semibold line-clamp-1 group-hover:text-indigo-300 transition-colors duration-300">
                          {product.title}
                        </CardTitle>
                      </CardHeader>
                      <p className="text-xs text-muted-foreground/70 line-clamp-2 mt-1.5 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-end justify-between pt-1">
                      <div>
                        <p className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                          {formatRupiah(product.price)}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <span className="inline-flex items-center gap-0.5">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                            {product.rating}
                          </span>
                          <span className="text-border">•</span>
                          <span className="inline-flex items-center gap-0.5">
                            <ShoppingBag className="h-3 w-3" />
                            Stok: {product.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6 animate-fade-in">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-border/30 rounded-xl hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = page - 3 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "ghost"}
                    size="icon"
                    className={
                      page === pageNum
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 rounded-xl"
                        : "text-muted-foreground hover:text-foreground rounded-xl"
                    }
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border-border/30 rounded-xl hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        productName={deleteTarget?.title || ""}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </DashboardLayout>
  );
}
