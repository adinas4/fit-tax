"use client";

import * as React from "react";
import {
  MessageSquare,
  PhoneCall,
  CheckCheck,
  FileText,
  Trophy,
  ClipboardCheck,
  Users,
  Star,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { fetcher, formatDate } from "./_shared";
import { useAsyncResource } from "./_use-async";
import {
  LoadingState,
  ErrorState,
  EmptyState,
  SectionHeader,
  StatCard,
  StatusBadge,
  Field,
  ToggleButton,
} from "./_ui";

/* ---------------------------------- Dashboard ---------------------------------- */

export function DashboardSection() {
  const { data, error, loading, refetch } = useAsyncResource<any>(
    "/api/admin/dashboard"
  );

  if (loading && !data) return <LoadingState label="Memuat dashboard..." />;
  if (error && !data)
    return <ErrorState message={error} onRetry={refetch} />;

  const stats = data?.stats || {};
  const recent = data?.recentConsultations || [];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dashboard"
        description="Ringkasan aktivitas dan statistik konten situs."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Pesan Baru"
          value={stats.newConsultations ?? 0}
          hint="perlu ditindaklanjuti"
          icon={MessageSquare}
        />
        <StatCard
          label="Dihubungi"
          value={stats.contactedConsultations ?? 0}
          hint="sedang dalam proses"
          icon={PhoneCall}
        />
        <StatCard
          label="Total Konsultasi"
          value={stats.totalConsultations ?? 0}
          hint="baru + dihubungi"
          icon={CheckCheck}
        />
        <StatCard
          label="Artikel"
          value={stats.articles ?? 0}
          hint={`${stats.publishedArticles ?? 0} terpublikasi`}
          icon={FileText}
        />
        <StatCard
          label="Portofolio"
          value={stats.portfolioItems ?? 0}
          icon={Trophy}
        />
        <StatCard
          label="Layanan"
          value={stats.services ?? 0}
          icon={ClipboardCheck}
        />
        <StatCard
          label="Tim Konsultan"
          value={stats.teamMembers ?? 0}
          icon={Users}
        />
        <StatCard
          label="Testimonial"
          value={stats.testimonials ?? 0}
          hint="disetujui"
          icon={Star}
        />
      </div>

      <Card className="gap-0 p-0">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-navy">
              Pesan Konsultasi Terbaru
            </h3>
            <p className="text-xs text-muted-foreground">
              5 pesan terbaru dari pengunjung situs.
            </p>
          </div>
        </div>
        {recent.length === 0 ? (
          <EmptyState
            title="Belum ada pesan konsultasi"
            description="Pesan yang masuk akan tampil di sini."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-mist/60 hover:bg-mist/60">
                <TableHead>Nama</TableHead>
                <TableHead className="hidden sm:table-cell">Layanan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Waktu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-navy">
                    {r.fullName}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {r.serviceType}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {formatDate(r.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

/* ------------------------------ Consultations ------------------------------ */

type Consultation = {
  id: string;
  fullName: string;
  company?: string | null;
  email: string;
  whatsapp: string;
  serviceType: string;
  message: string;
  agreement?: boolean;
  status: "new" | "contacted" | "closed";
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
};

const STATUS_FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "new", label: "Baru" },
  { key: "contacted", label: "Dihubungi" },
  { key: "closed", label: "Selesai" },
];

export function ConsultationsSection() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const { data, error, loading, refetch } = useAsyncResource<{ items: Consultation[] }>(
    `/api/admin/consultations?status=${statusFilter}`,
    [statusFilter]
  );

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  const items = data?.items || [];

  const toggleExpand = (id: string) =>
    setExpanded((m) => ({ ...m, [id]: !m[id] }));

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await fetcher("/api/admin/consultations", {
        method: "PATCH",
        body: JSON.stringify({ id, status }),
      });
      toast({ title: "Berhasil", description: "Status diperbarui." });
      refetch();
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err?.message || "Gagal memperbarui status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Hapus pesan konsultasi ini? Tindakan tidak bisa dibatalkan."))
      return;
    try {
      await fetcher(`/api/admin/consultations?id=${id}`, { method: "DELETE" });
      toast({ title: "Berhasil", description: "Pesan dihapus." });
      setSelectedId(null);
      refetch();
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err?.message || "Gagal menghapus pesan.",
        variant: "destructive",
      });
    }
  };

  const selected = items.find((i) => i.id === selectedId) || null;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Pesan Konsultasi"
        description="Kelola permintaan konsultasi yang masuk dari situs."
      />

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <ToggleButton
            key={f.key}
            active={statusFilter === f.key}
            onClick={() => setStatusFilter(f.key)}
          >
            {f.label}
          </ToggleButton>
        ))}
      </div>

      <Card className="gap-0 p-0">
        {loading && items.length === 0 ? (
          <LoadingState label="Memuat pesan..." />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Tidak ada pesan"
            description="Belum ada pesan konsultasi pada kategori ini."
          />
        ) : (
          <div className="scroll-elegant max-h-[70vh] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Layanan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Waktu</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((c) => {
                  const isOpen = !!expanded[c.id];
                  return (
                    <React.Fragment key={c.id}>
                      <TableRow>
                        <TableCell className="align-middle">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            onClick={() => toggleExpand(c.id)}
                            aria-label={isOpen ? "Tutup" : "Buka"}
                          >
                            {isOpen ? (
                              <ChevronUp className="size-4" />
                            ) : (
                              <ChevronDown className="size-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium text-navy">
                          <button
                            type="button"
                            className="text-left hover:text-royal"
                            onClick={() => setSelectedId(c.id)}
                          >
                            {c.fullName}
                            {c.company ? (
                              <span className="block text-xs font-normal text-muted-foreground">
                                {c.company}
                              </span>
                            ) : null}
                          </button>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {c.email}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {c.serviceType}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={c.status} />
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                          {formatDate(c.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedId(c.id)}
                            >
                              Lihat
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(c.id)}
                              aria-label="Hapus"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {isOpen && (
                        <TableRow className="bg-mist/40 hover:bg-mist/40">
                          <TableCell colSpan={7} className="px-6 py-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-1">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                  Pesan
                                </p>
                                <p className="text-sm whitespace-pre-wrap text-foreground">
                                  {c.message}
                                </p>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">WhatsApp: </span>
                                  <a
                                    href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-royal hover:underline"
                                  >
                                    {c.whatsapp}
                                    <ExternalLink className="size-3" />
                                  </a>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Email: </span>
                                  <a
                                    href={`mailto:${c.email}`}
                                    className="text-royal hover:underline"
                                  >
                                    {c.email}
                                  </a>
                                </div>
                                {c.adminNotes && (
                                  <div>
                                    <span className="text-muted-foreground">Catatan admin: </span>
                                    <span>{c.adminNotes}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <ConsultationDetailDialog
        consultation={selected}
        onClose={() => setSelectedId(null)}
        onSaved={refetch}
      />
    </div>
  );
}

function ConsultationDetailDialog({
  consultation,
  onClose,
  onSaved,
}: {
  consultation: Consultation | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const [status, setStatus] = React.useState<string>("new");
  const [adminNotes, setAdminNotes] = React.useState<string>("");
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  // Sync form state when consultation changes (React "adjust state when prop changes" pattern).
  const [trackedId, setTrackedId] = React.useState<string | null>(null);
  if (consultation && consultation.id !== trackedId) {
    setTrackedId(consultation.id);
    setStatus(consultation.status);
    setAdminNotes(consultation.adminNotes || "");
  } else if (!consultation && trackedId !== null) {
    setTrackedId(null);
  }

  const handleSave = async () => {
    if (!consultation) return;
    setSaving(true);
    try {
      await fetcher("/api/admin/consultations", {
        method: "PATCH",
        body: JSON.stringify({ id: consultation.id, status, adminNotes }),
      });
      toast({ title: "Berhasil", description: "Perubahan disimpan." });
      onSaved();
      onClose();
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err?.message || "Gagal menyimpan perubahan.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!consultation) return;
    if (!window.confirm("Hapus pesan konsultasi ini?")) return;
    setDeleting(true);
    try {
      await fetcher(`/api/admin/consultations?id=${consultation.id}`, {
        method: "DELETE",
      });
      toast({ title: "Berhasil", description: "Pesan dihapus." });
      onSaved();
      onClose();
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err?.message || "Gagal menghapus pesan.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={!!consultation} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Pesan Konsultasi</DialogTitle>
          <DialogDescription>
            Perbarui status, tambahkan catatan admin, atau hubungi klien.
          </DialogDescription>
        </DialogHeader>

        {consultation && (
          <div className="scroll-elegant max-h-[60vh] space-y-4 overflow-y-auto pr-1">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nama Lengkap">
                <Input value={consultation.fullName} readOnly />
              </Field>
              <Field label="Perusahaan">
                <Input value={consultation.company || "-"} readOnly />
              </Field>
              <Field label="Email">
                <Input value={consultation.email} readOnly />
              </Field>
              <Field label="WhatsApp">
                <Input value={consultation.whatsapp} readOnly />
              </Field>
              <Field label="Jenis Layanan" className="sm:col-span-2">
                <Input value={consultation.serviceType} readOnly />
              </Field>
              <Field label="Pesan" className="sm:col-span-2">
                <Textarea
                  value={consultation.message}
                  readOnly
                  className="min-h-24 resize-none"
                />
              </Field>
              <Field label="Waktu Diterima">
                <Input value={formatDate(consultation.createdAt)} readOnly />
              </Field>
              <Field label="Status">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Baru</SelectItem>
                    <SelectItem value="contacted">Dihubungi</SelectItem>
                    <SelectItem value="closed">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Catatan Admin" className="sm:col-span-2">
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Catatan internal (tidak terlihat klien)..."
                  className="min-h-24"
                />
              </Field>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <a
                  href={`https://wa.me/${consultation.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="size-4" /> Hubungi via WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={`mailto:${consultation.email}`}>Kirim Email</a>
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting || saving}
            className="mr-auto"
          >
            {deleting ? "Menghapus..." : "Hapus"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Tutup
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-navy hover:bg-navy/90"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
