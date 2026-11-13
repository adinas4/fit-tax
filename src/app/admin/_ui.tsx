"use client";

import * as React from "react";
import { Loader2, AlertCircle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function LoadingState({ label = "Memuat..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-muted-foreground">
      <Loader2 className="size-5 animate-spin text-royal" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <AlertCircle className="size-6 text-destructive" />
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Coba lagi
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  title = "Belum ada data",
  description = "Tambahkan item baru untuk mulai mengelola konten.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <Inbox className="size-8 text-muted-foreground/60" />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="max-w-sm text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-navy sm:text-2xl">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="gap-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl font-bold text-navy sm:text-3xl">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && (
          <div className="flex size-10 items-center justify-center rounded-lg bg-mist">
            <Icon className="size-5 text-royal" />
          </div>
        )}
      </div>
    </Card>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium text-navy">
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    new: {
      label: "Baru",
      cls: "bg-royal/10 text-royal border-royal/20",
    },
    contacted: {
      label: "Dihubungi",
      cls: "bg-gold/15 text-gold border-gold/30",
    },
    closed: {
      label: "Selesai",
      cls: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
  };
  const entry = map[status] || {
    label: status,
    cls: "bg-muted text-muted-foreground border-border",
  };
  return (
    <Badge variant="outline" className={cn("capitalize", entry.cls)}>
      {entry.label}
    </Badge>
  );
}

export function ToggleButton({
  active,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { active?: boolean }) {
  return (
    <Button
      size="sm"
      variant={active ? "default" : "outline"}
      {...props}
      className={cn(
        active && "bg-navy text-white hover:bg-navy/90",
        props.className
      )}
    >
      {children}
    </Button>
  );
}

export function SaveCancelButton({
  onCancel,
  saving,
  saveLabel = "Simpan",
}: {
  onCancel: () => void;
  saving: boolean;
  saveLabel?: string;
}) {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
        Batal
      </Button>
      <Button type="submit" disabled={saving} className="bg-navy hover:bg-navy/90">
        {saving ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Menyimpan...
          </>
        ) : (
          saveLabel
        )}
      </Button>
    </div>
  );
}
