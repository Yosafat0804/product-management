"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { createProduct, getCategories } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Loader2, ImagePlus, X, Package, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "Nama produk wajib diisi";
    if (!form.price || Number(form.price) <= 0)
      newErrors.price = "Harga harus lebih dari 0";
    if (!form.description.trim())
      newErrors.description = "Deskripsi wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await createProduct({
        title: form.title,
        description: form.description,
        price: Number(form.price),
        category: form.category || undefined,
        brand: form.brand || undefined,
        stock: form.stock ? Number(form.stock) : undefined,
        thumbnail: imagePreview || undefined,
      });
      toast.success("Produk berhasil ditambahkan!");
      router.push("/products");
    } catch {
      toast.error("Gagal menambahkan produk");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-indigo-400 transition-colors duration-300 animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Produk
        </Link>

        <Card className="border-border/20 bg-card/50 backdrop-blur-sm shadow-xl shadow-indigo-500/3 animate-slide-up overflow-hidden">
          {/* Decorative top bar */}
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-2.5 border border-indigo-500/20">
                <Sparkles className="h-5 w-5 text-indigo-400" />
              </div>
              <span className="gradient-text">Tambah Produk Baru</span>
            </CardTitle>
            <CardDescription className="ml-[52px]">
              Isi form di bawah untuk menambahkan produk baru
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2 animate-slide-up stagger-1">
                <Label htmlFor="title">
                  Nama Produk <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Masukkan nama produk"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className={`h-11 bg-background/50 border-border/30 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl transition-all duration-300 ${
                    errors.title ? "border-destructive" : ""
                  }`}
                />
                {errors.title && (
                  <p className="text-xs text-destructive animate-fade-in">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2 animate-slide-up stagger-2">
                <Label htmlFor="description">
                  Deskripsi <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Masukkan deskripsi produk"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className={`min-h-[120px] bg-background/50 border-border/30 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl transition-all duration-300 ${
                    errors.description ? "border-destructive" : ""
                  }`}
                />
                {errors.description && (
                  <p className="text-xs text-destructive animate-fade-in">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-2 gap-4 animate-slide-up stagger-3">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Harga (Rp) <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className={`h-11 bg-background/50 border-border/30 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl transition-all duration-300 ${
                      errors.price ? "border-destructive" : ""
                    }`}
                  />
                  {errors.price && (
                    <p className="text-xs text-destructive animate-fade-in">{errors.price}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stok</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    className="h-11 bg-background/50 border-border/30 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl transition-all duration-300"
                  />
                </div>
              </div>

              {/* Category and Brand */}
              <div className="grid grid-cols-2 gap-4 animate-slide-up stagger-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) =>
                      setForm({ ...form, category: v ?? "" })
                    }
                  >
                    <SelectTrigger className="h-11 bg-background/50 border-border/30 rounded-xl">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat
                            .split("-")
                            .map(
                              (w) =>
                                w.charAt(0).toUpperCase() + w.slice(1)
                            )
                            .join(" ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Merek</Label>
                  <Input
                    id="brand"
                    placeholder="Nama merek"
                    value={form.brand}
                    onChange={(e) =>
                      setForm({ ...form, brand: e.target.value })
                    }
                    className="h-11 bg-background/50 border-border/30 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl transition-all duration-300"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2 animate-slide-up stagger-5">
                <Label>Gambar Produk (Opsional)</Label>
                <div className="flex items-start gap-4">
                  {imagePreview ? (
                    <div className="relative h-36 w-36 rounded-2xl overflow-hidden border border-border/30 ring-2 ring-indigo-500/20 shadow-lg group">
                      <Image
                        src={imagePreview!}
                        alt="Pratinjau"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm"
                          onClick={() => setImagePreview(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-36 w-36 rounded-2xl border-2 border-dashed border-border/30 bg-indigo-500/5 cursor-pointer hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 group">
                      <ImagePlus className="h-8 w-8 text-muted-foreground/40 group-hover:text-indigo-400 transition-colors duration-300" />
                      <span className="text-xs text-muted-foreground mt-1.5 group-hover:text-indigo-300 transition-colors duration-300">
                        Unggah
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4 animate-slide-up stagger-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/20 transition-all duration-300 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 rounded-xl h-11 px-6"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Produk"
                  )}
                </Button>
                <Link href="/products">
                  <Button type="button" variant="outline" className="border-border/30 rounded-xl h-11 hover:bg-card/80 transition-all duration-300">
                    Batal
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
