"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteDialog({
  open,
  onOpenChange,
  productName,
  onConfirm,
  isDeleting,
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card/95 backdrop-blur-2xl border-border/30 shadow-2xl shadow-red-500/5 rounded-2xl max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mb-2">
            <AlertTriangle className="h-7 w-7 text-red-400" />
          </div>
          <AlertDialogTitle className="text-center text-lg">Hapus Produk</AlertDialogTitle>
          <AlertDialogDescription className="text-center leading-relaxed">
            Apakah Anda yakin ingin menghapus{" "}
            <span className="font-semibold text-foreground">
              &quot;{productName}&quot;
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center gap-3 pt-2">
          <AlertDialogCancel disabled={isDeleting} className="rounded-xl border-border/30 hover:bg-card/80 transition-all duration-300">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white shadow-lg shadow-red-500/20 rounded-xl transition-all duration-300 hover:shadow-red-500/40 hover:scale-105 active:scale-95"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
