"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, Star, Loader2, Upload, ImageUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
import {
  fetcher,
  formatShortDate,
  linesToArray,
  arrayToLines,
  csvToArray,
} from "./_shared";
import { useAsyncResource } from "./_use-async";
import {
  LoadingState,
  ErrorState,
  EmptyState,
  SectionHeader,
  Field,
} from "./_ui";

const ARTICLE_CATEGORIES = [
  "Regulasi Pajak",
  "Pajak Perusahaan",
  "Pajak Orang Pribadi",
  "SPT Tahunan",
  "PPN dan PPh",
  "Tips Kepatuhan Pajak",
  "Edukasi Perpajakan",
];

/* ------------------------------- Services ------------------------------- */

type Service = {
  id: string;
  name: string;
  slug: string;
  short: string;
  benefits: string[];
  details: string[];
  iconName: string;
  position: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

type ServiceForm = {
  name: string;
  short: string;
  benefits: string;
  details: string;
  iconName: string;
  position: number;
  published: boolean;
};

const EMPTY_SERVICE_FORM: ServiceForm = {
  name: "",
  short: "",
  benefits: "",
  details: "",
  iconName: "ClipboardCheck",
  position: 0,
  published: true,
};

export function ServicesSection() {
  const { toast } = useToast();
  const { data, error, loading, refetch } = useAsyncResource<{ items: Service[] }>(
    "/api/admin/services"
  );
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Service | null>(null);
  const [form, setForm] = React.useState<ServiceForm>(EMPTY_SERVICE_FORM);
  const [saving, setSaving] = React.useState(false);

  const items = data?.items || [];

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_SERVICE_FORM);
    setOpen(true);
  };
  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      name: s.name,
      short: s.short,
      benefits: arrayToLines(s.benefits),
      details: arrayToLines(s.details),
      iconName: s.iconName || "ClipboardCheck",
      position: s.position || 0,
      published: s.published,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.short) {
      toast({
        title: "Validasi",
        description: "Nama dan deskripsi singkat wajib diisi.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      short: form.short,
      benefits: linesToArray(form.benefits),
      details: linesToArray(form.details),
      iconName: form.iconName,
      position: Number(form.position) || 0,
      published: form.published,
    };
    try {
      if (editing) {
        await fetcher("/api/admin/services", {
          method: "PUT",
          body: JSON.stringify({ id: editing.id, ...payload }),
        });
        toast({ title: "Berhasil", description: "Layanan diperbarui." });
      } else {
        await fetcher("/api/admin/services", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast({ title: "Berhasil", description: "Layanan ditambahkan." });
      }
      setOpen(false);
      refetch();
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err?.message || "Gagal menyimpan layanan.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s: Service) => {
    if (!window.confirm(`Hapus layanan "${s.name}"?`)) return;
    try {
      await fetcher(`/api/admin/services?id=${s.id}`, { method: "DELETE" });
      toast({ title: "Berhasil", description: "Layanan dihapus." });
      refetch();
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err?.message || "Gagal menghapus layanan.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Layanan"
        description="Kelola daftar layanan yang ditampilkan di situs."
        action={
          <Button onClick={openCreate} className="bg-navy hover:bg-navy/90">
            <Plus className="size-4" /> Tambah Layanan
          </Button>
        }
      />

      <Card className="gap-0 p-0">
        {loading && items.length === 0 ? (
          <LoadingState label="Memuat layanan..." />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : items.length === 0 ? (
          <EmptyState title="Belum ada layanan" />
        ) : (
          <div className="scroll-elegant max-h-[70vh] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow>
                  <TableHead className="w-12">Pos</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="hidden md:table-cell">Icon</TableHead>
                  <TableHead className="hidden lg:table-cell">Deskripsi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-muted-foreground">{s.position}</TableCell>
                    <TableCell className="font-medium text-navy">{s.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {s.iconName}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground max-w-xs truncate">
                      {s.short}
                    </TableCell>
                    <TableCell>
                      {s.published ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                          Terbit
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() => openEdit(s)}
                          aria-label="Edit"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(s)}
                          aria-label="Hapus"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Layanan" : "Tambah Layanan"}</DialogTitle>
            <DialogDescription>
              Isi detail layanan. Manfaat dan detail ditulis satu per baris.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="scroll-elegant max-h-[60vh] space-y-4 overflow-y-auto pr-1">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nama Layanan" htmlFor="svc-name" className="sm:col-span-2">
                  <Input
                    id="svc-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Contoh: Compliance Tax"
                  />
                </Field>
                <Field label="Deskripsi Singkat" htmlFor="svc-short" className="sm:col-span-2">
                  <Textarea
                    id="svc-short"
                    value={form.short}
                    onChange={(e) => setForm({ ...form, short: e.target.value })}
                    placeholder="Satu kalimat ringkas tentang layanan..."
                    className="min-h-20"
                  />
                </Field>
                <Field label="Manfaat (satu per baris)" htmlFor="svc-benefits" className="sm:col-span-2">
                  <Textarea
                    id="svc-benefits"
                    value={form.benefits}
                    onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                    placeholder={"Manfaat 1\nManfaat 2\nManfaat 3"}
                    className="min-h-24 font-mono text-sm"
                  />
                </Field>
                <Field label="Detail (satu per baris)" htmlFor="svc-details" className="sm:col-span-2">
                  <Textarea
                    id="svc-details"
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    placeholder={"Detail 1\nDetail 2"}
                    className="min-h-24 font-mono text-sm"
                  />
                </Field>
                <Field label="Icon Name (lucide-react)" htmlFor="svc-icon">
                  <Input
                    id="svc-icon"
                    value={form.iconName}
                    onChange={(e) => setForm({ ...form, iconName: e.target.value })}
                    placeholder="ClipboardCheck"
                  />
                </Field>
                <Field label="Posisi (urutan)" htmlFor="svc-pos">
                  <Input
                    id="svc-pos"
                    type="number"
                    value={form.position}
                    onChange={(e) =>
                      setForm({ ...form, position: Number(e.target.value) })
                    }
                  />
                </Field>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Checkbox
                    id="svc-published"
                    checked={form.published}
                    onCheckedChange={(c) => setForm({ ...form, published: !!c })}
                  />
                  <Label htmlFor="svc-published" className="text-sm">
                    Publikasikan layanan ini
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={saving}
              >
                Batal
              </Button>
              <Button type="submit" disabled={saving} className="bg-navy hover:bg-navy/90">
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------- Portfolio ------------------------------- */

type Portfolio = {
  id: string;
  title: string;
  category: string;
  industry: string;
  year: string;
  challenge: string;
  approach: string;
  result: string;
  image: string | null;
  isExample: boolean;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
};

type PortfolioForm = {
  title: string;
  category: string;
  industry: string;
  year: string;
  challenge: string;
  approach: string;
  result: string;
  image: string;
  isExample: boolean;
  published: boolean;
};

const EMPTY_PORTFOLIO_FORM: PortfolioForm = {
  title: "",
  category: "",
  industry: "",
  year: String(new Date().getFullYear()),
  challenge: "",
  approach: "",
  result: "",
  image: "",
  isExample: true,
  published: true,
};

export function PortfolioSection() {
  const { toast } = useToast();
  const { data, error, loading, refetch } = useAsyncResource<{ items: Portfolio[] }>(
    "/api/admin/portfolio"
  );
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Portfolio | null>(null);
  const [form, setForm] = React.useState<PortfolioForm>(EMPTY_PORTFOLIO_FORM);
  const [saving, setSaving] = React.useState(false);

  const items = data?.items || [];

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_PORTFOLIO_FORM);
    setOpen(true);
  };
  const openEdit = (p: Portfolio) => {
    setEditing(p);
    setForm({
      title: p.title,
      category: p.category,
      industry: p.industry || "",
      year: p.year || "",
      challenge: p.challenge || "",
      approach: p.approach || "",
      result: p.result || "",
      image: p.image || "",
      isExample: p.isExample,
      published: p.published,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.category) {
      toast({
        title: "Validasi",
        description: "Judul dan kategori wajib diisi.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      image: form.image || null,
    };
    try {
      if (editing) {
        await fetcher("/api/admin/portfolio", {
          method: "PUT",
          body: JSON.stringify({ id: editing.id, ...payload }),
        });
        toast({ title: "Berhasil", description: "Portofolio diperbarui." });
      } else {
        await fetcher("/api/admin/portfolio", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast({ title: "Berhasil", description: "Portofolio ditambahkan." });
      }
      setOpen(false);
      refetch();
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err?.message || "Gagal menyimpan portofolio.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: Portfolio) => {
    if (!window.confirm(`Hapus portofolio "${p.title}"?`)) return;
    try {
      await fetcher(`/api/admin/portfolio?id=${p.id}`, { method: "DELETE" });
      toast({ title: "Berhasil", description: "Portofolio dihapus." });
      refetch();
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err?.message || "Gagal menghapus portofolio.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Portofolio"
        description="Kelola proyek dan studi kasus."
        action={
          <Button onClick={openCreate} className="bg-navy hover:bg-navy/90">
            <Plus className="size-4" /> Tambah Portofolio
          </Button>
        }
      />
      <Card className="gap-0 p-0">
        {loading && items.length === 0 ? (
          <LoadingState label="Memuat portofolio..." />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : items.length === 0 ? (
          <EmptyState title="Belum ada portofolio" />
        ) : (
          <div className="scroll-elegant max-h-[70vh] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead className="hidden md:table-cell">Kategori</TableHead>
                  <TableHead className="hidden sm:table-cell">Tahun</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-navy">
                      {p.title}
                      <span className="block text-xs font-normal text-muted-foreground">
                        {p.industry}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {p.category}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {p.year}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {p.published ? (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                            Terbit
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                        {p.isExample && (
                          <Badge variant="outline" className="text-gold border-gold/30">
                            Contoh
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() => openEdit(p)}
                          aria-label="Edit"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(p)}
                          aria-label="Hapus"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Portofolio" : "Tambah Portofolio"}</DialogTitle>
            <DialogDescription>
              Jelaskan tantangan, pendekatan, dan hasil proyek secara naratif.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="scroll-elegant max-h-[60vh] space-y-4 overflow-y-auto pr-1">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Judul" htmlFor="pf-title" className="sm:col-span-2">
                  <Input
                    id="pf-title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </Field>
                <Field label="Kategori" htmlFor="pf-cat">
                  <Input
                    id="pf-cat"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Contoh: Compliance Tax"
                  />
                </Field>
                <Field label="Industri" htmlFor="pf-ind">
                  <Input
                    id="pf-ind"
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  />
                </Field>
                <Field label="Tahun" htmlFor="pf-year">
                  <Input
                    id="pf-year"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                  />
                </Field>
                <Field label="URL Gambar" htmlFor="pf-img">
                  <Input
                    id="pf-img"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://..."
                  />
                </Field>
                <Field label="Tantangan" htmlFor="pf-challenge" className="sm:col-span-2">
                  <Textarea
                    id="pf-challenge"
                    value={form.challenge}
                    onChange={(e) => setForm({ ...form, challenge: e.target.value })}
                    className="min-h-20"
                  />
                </Field>
                <Field label="Pendekatan" htmlFor="pf-approach" className="sm:col-span-2">
                  <Textarea
                    id="pf-approach"
                    value={form.approach}
                    onChange={(e) => setForm({ ...form, approach: e.target.value })}
                    className="min-h-20"
                  />
                </Field>
                <Field label="Hasil" htmlFor="pf-result" className="sm:col-span-2">
                  <Textarea
                    id="pf-result"
                    value={form.result}
                    onChange={(e) => setForm({ ...form, result: e.target.value })}
                    className="min-h-20"
                  />
                </Field>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="pf-example"
                    checked={form.isExample}
                    onCheckedChange={(c) => setForm({ ...form, isExample: !!c })}
                  />
                  <Label htmlFor="pf-example" className="text-sm">
                    Tandai sebagai contoh
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="pf-published"
                    checked={form.published}
                    onCheckedChange={(c) => setForm({ ...form, published: !!c })}
                  />
                  <Label htmlFor="pf-published" className="text-sm">
                    Publikasikan
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={saving}
              >
                Batal
              </Button>
              <Button type="submit" disabled={saving} className="bg-navy hover:bg-navy/90">
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------- Articles ------------------------------- */

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  coverImage: string | null;
  author: string;
  readingMinutes: number;
  isPopular: boolean;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

type ArticleForm = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  coverImage: string;
  readingMinutes: number;
  isPopular: boolean;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
};

const EMPTY_ARTICLE_FORM: ArticleForm = {
  title: "",
  excerpt: "",
  content: "",
  category: ARTICLE_CATEGORIES[0],
  tags: "",
  coverImage: "",
  readingMinutes: 4,
  isPopular: false,
  published: true,
  seoTitle: "",
  seoDescription: "",
};

export function ArticlesSection() {
  const { toast } = useToast();
  const { data, error, loading, refetch } = useAsyncResource<{ items: Article[] }>(
    "/api/admin/articles"
  );
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Article | null>(null);
  const [form, setForm] = React.useState<ArticleForm>(EMPTY_ARTICLE_FORM);
  const [saving, setSaving] = React.useState(false);

  const items = data?.items || [];

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_ARTICLE_FORM);
    setOpen(true);
  };
  const openEdit = (a: Article) => {
    setEditing(a);
    setForm({
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      category: a.category,
      tags: a.tags || "",
      coverImage: a.coverImage || "",
      readingMinutes: a.readingMinutes || 4,
      isPopular: a.isPopular,
      published: a.published,
      seoTitle: a.seoTitle || "",
      seoDescription: a.seoDescription || "",
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.excerpt || !form.content || !form.category) {
      toast({
        title: "Validasi",
        description: "Judul, ringkasan, konten, dan kategori wajib diisi.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      tags: csvToArray(form.tags).join(", "),
      coverImage: form.coverImage || null,
      readingMinutes: Number(form.readingMinutes) || 4,
      isPopular: form.isPopular,
      published: form.published,
      seoTitle: form.seoTitle || null,
      seoDescription: form.seoDescription || null,
    };
    try {
      if (editing) {
        await fetcher("/api/admin/articles", {
          method: "PUT",
          body: JSON.stringify({ id: editing.id, ...payload }),
        });
        toast({ title: "Berhasil", description: "Artikel diperbarui." });
      } else {
        await fetcher("/api/admin/articles", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast({ title: "Berhasil", description: "Artikel ditambahkan." });
      }
      setOpen(false);
      refetch();
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err?.message || "Gagal menyimpan artikel.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (a: Article) => {
    if (!window.confirm(`Hapus artikel "${a.title}"?`)) return;
    try {
      await fetcher(`/api/admin/articles?id=${a.id}`, { method: "DELETE" });
      toast({ title: "Berhasil", description: "Artikel dihapus." });
      refetch();
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err?.message || "Gagal menghapus artikel.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Artikel"
        description="Kelola artikel dan wawasan perpajakan."
        action={
          <Button onClick={openCreate} className="bg-navy hover:bg-navy/90">
            <Plus className="size-4" /> Tambah Artikel
          </Button>
        }
      />
      <Card className="gap-0 p-0">
        {loading && items.length === 0 ? (
          <LoadingState label="Memuat artikel..." />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : items.length === 0 ? (
          <EmptyState title="Belum ada artikel" />
        ) : (
          <div className="scroll-elegant max-h-[70vh] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead className="hidden md:table-cell">Kategori</TableHead>
                  <TableHead className="hidden lg:table-cell">Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Diperbarui</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium text-navy">
                      {a.title}
                      <span className="block text-xs font-normal text-muted-foreground max-w-xs truncate">
                        {a.excerpt}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {a.category}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground max-w-[160px] truncate">
                      {a.tags}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {a.published ? (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                            Terbit
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                        {a.isPopular && (
                          <Badge variant="outline" className="text-gold border-gold/30 gap-1">
                            <Star className="size-3" /> Populer
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                      {formatShortDate(a.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() => openEdit(a)}
                          aria-label="Edit"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(a)}
                          aria-label="Hapus"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Artikel" : "Tambah Artikel"}</DialogTitle>
            <DialogDescription>
              Konten ditulis dalam format Markdown. Ringkasan tampil di daftar artikel.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="scroll-elegant max-h-[60vh] space-y-4 overflow-y-auto pr-1">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Judul" htmlFor="art-title" className="sm:col-span-2">
                  <Input
                    id="art-title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </Field>
                <Field label="Ringkasan" htmlFor="art-excerpt" className="sm:col-span-2">
                  <Textarea
                    id="art-excerpt"
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    className="min-h-20"
                  />
                </Field>
                <Field label="Konten (Markdown)" htmlFor="art-content" className="sm:col-span-2">
                  <Textarea
                    id="art-content"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="min-h-64 font-mono text-sm"
                  />
                </Field>
                <Field label="Kategori" htmlFor="art-cat">
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                  >
                    <SelectTrigger id="art-cat" className="w-full">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {ARTICLE_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Tags (pisahkan koma)" htmlFor="art-tags">
                  <Input
                    id="art-tags"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="pajak, spt, ppn"
                  />
                </Field>
                <Field label="URL Cover Image" htmlFor="art-cover" className="sm:col-span-2">
                  <Input
                    id="art-cover"
                    value={form.coverImage}
                    onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                    placeholder="https://..."
                  />
                </Field>
                <Field label="Durasi Baca (menit)" htmlFor="art-read">
                  <Input
                    id="art-read"
                    type="number"
                    value={form.readingMinutes}
                    onChange={(e) =>
                      setForm({ ...form, readingMinutes: Number(e.target.value) })
                    }
                  />
                </Field>
                <div className="flex flex-wrap items-center gap-4 pt-6">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="art-popular"
                      checked={form.isPopular}
                      onCheckedChange={(c) => setForm({ ...form, isPopular: !!c })}
                    />
                    <Label htmlFor="art-popular" className="text-sm">
                      Tandai populer
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="art-published"
                      checked={form.published}
                      onCheckedChange={(c) => setForm({ ...form, published: !!c })}
                    />
                    <Label htmlFor="art-published" className="text-sm">
                      Publikasikan
                    </Label>
                  </div>
                </div>
                <Field label="SEO Title" htmlFor="art-seo-title" className="sm:col-span-2">
                  <Input
                    id="art-seo-title"
                    value={form.seoTitle}
                    onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                  />
                </Field>
                <Field label="SEO Description" htmlFor="art-seo-desc" className="sm:col-span-2">
                  <Textarea
                    id="art-seo-desc"
                    value={form.seoDescription}
                    onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                    className="min-h-16"
                  />
                </Field>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={saving}
              >
                Batal
              </Button>
              <Button type="submit" disabled={saving} className="bg-navy hover:bg-navy/90">
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------- Team ------------------------------- */

type TeamMember = {
  id: string;
  name: string;
  role: string;
  credentials: string | null;
  bio: string | null;
  photoUrl: string | null;
  position: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

type TeamForm = {
  name: string;
  role: string;
  credentials: string;
  bio: string;
  photoUrl: string;
  position: number;
  published: boolean;
};

const EMPTY_TEAM_FORM: TeamForm = {
  name: "",
  role: "",
  credentials: "",
  bio: "",
  photoUrl: "",
  position: 0,
  published: true,
};

export function TeamSection() {
  const { toast } = useToast();
  const { data, error, loading, refetch } = useAsyncResource<{ items: TeamMember[] }>(
    "/api/admin/team"
  );
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<TeamMember | null>(null);
  const [form, setForm] = React.useState<TeamForm>(EMPTY_TEAM_FORM);
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const items = data?.items || [];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Gagal", description: "Berkas harus berupa gambar.", variant: "destructive" });
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast({ title: "Gagal", description: "Ukuran berkas melebihi 4 MB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal mengunggah");
      }
      setForm((f) => ({ ...f, photoUrl: json.url }));
      toast({ title: "Berhasil", description: "Foto diunggah." });
    } catch (err: any) {
      toast({ title: "Gagal unggah", description: err?.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_TEAM_FORM);
    setOpen(true);
  };
  const openEdit = (m: TeamMember) => {
    setEditing(m);
    setForm({
      name: m.name,
      role: m.role,
      credentials: m.credentials || "",
      bio: m.bio || "",
      photoUrl: m.photoUrl || "",
      position: m.position || 0,
      published: m.published,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role) {
      toast({
        title: "Validasi",
        description: "Nama dan peran wajib diisi.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      role: form.role,
      credentials: form.credentials || null,
      bio: form.bio || null,
      photoUrl: form.photoUrl || null,
      position: Number(form.position) || 0,
      published: form.published,
    };
    try {
      if (editing) {
        await fetcher("/api/admin/team", {
          method: "PUT",
          body: JSON.stringify({ id: editing.id, ...payload }),
        });
        toast({ title: "Berhasil", description: "Tim diperbarui." });
      } else {
        await fetcher("/api/admin/team", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast({ title: "Berhasil", description: "Anggota tim ditambahkan." });
      }
      setOpen(false);
      refetch();
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err?.message || "Gagal menyimpan data tim.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (m: TeamMember) => {
    if (!window.confirm(`Hapus anggota tim "${m.name}"?`)) return;
    try {
      await fetcher(`/api/admin/team?id=${m.id}`, { method: "DELETE" });
      toast({ title: "Berhasil", description: "Anggota tim dihapus." });
      refetch();
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err?.message || "Gagal menghapus anggota tim.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Tim Konsultan"
        description="Kelola profil tim konsultan pajak."
        action={
          <Button onClick={openCreate} className="bg-navy hover:bg-navy/90">
            <Plus className="size-4" /> Tambah Anggota
          </Button>
        }
      />
      <Card className="gap-0 p-0">
        {loading && items.length === 0 ? (
          <LoadingState label="Memuat tim..." />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : items.length === 0 ? (
          <EmptyState title="Belum ada anggota tim" />
        ) : (
          <div className="scroll-elegant max-h-[70vh] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow>
                  <TableHead className="w-12">Pos</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="hidden md:table-cell">Peran</TableHead>
                  <TableHead className="hidden lg:table-cell">Kredensial</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="text-muted-foreground">{m.position}</TableCell>
                    <TableCell className="font-medium text-navy">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50">
                          {m.photoUrl ? (
                            <img
                              src={m.photoUrl}
                              alt={m.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageUp className="size-4 text-slate-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="block truncate">{m.name}</span>
                          <span className="block text-xs font-normal text-muted-foreground md:hidden">
                            {m.role}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {m.role}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground max-w-xs truncate">
                      {m.credentials || "-"}
                    </TableCell>
                    <TableCell>
                      {m.published ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                          Terbit
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() => openEdit(m)}
                          aria-label="Edit"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(m)}
                          aria-label="Hapus"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Anggota Tim" : "Tambah Anggota Tim"}</DialogTitle>
            <DialogDescription>
              Profil konsultan yang tampil di halaman publik.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="scroll-elegant max-h-[60vh] space-y-4 overflow-y-auto pr-1">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nama" htmlFor="team-name">
                  <Input
                    id="team-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </Field>
                <Field label="Peran / Jabatan" htmlFor="team-role">
                  <Input
                    id="team-role"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Contoh: Senior Tax Consultant"
                  />
                </Field>
                <Field label="Kredensial" htmlFor="team-cred" className="sm:col-span-2">
                  <Input
                    id="team-cred"
                    value={form.credentials}
                    onChange={(e) => setForm({ ...form, credentials: e.target.value })}
                    placeholder="Sertifikasi Brevet Pajak A & B, Akuntan Publik"
                  />
                </Field>
                <Field label="Bio" htmlFor="team-bio" className="sm:col-span-2">
                  <Textarea
                    id="team-bio"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className="min-h-24"
                  />
                </Field>
                <Field label="Foto" htmlFor="team-photo" className="sm:col-span-2">
                  <div className="flex items-start gap-3">
                    <div className="flex size-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                      {form.photoUrl ? (
                        <img
                          src={form.photoUrl}
                          alt="Pratinjau foto"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageUp className="size-6 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input
                        id="team-photo"
                        value={form.photoUrl}
                        onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                        placeholder="https://... atau unggah berkas"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="team-photo-file"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="size-4 animate-spin" /> Mengunggah...
                            </>
                          ) : (
                            <>
                              <Upload className="size-4" /> Unggah Foto
                            </>
                          )}
                        </Button>
                        {form.photoUrl && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setForm({ ...form, photoUrl: "" })}
                          >
                            Hapus
                          </Button>
                        )}
                        <span className="text-xs text-slate-400">
                          PNG/JPG/WebP, maks 4 MB
                        </span>
                      </div>
                    </div>
                  </div>
                </Field>
                <Field label="Posisi (urutan)" htmlFor="team-pos">
                  <Input
                    id="team-pos"
                    type="number"
                    value={form.position}
                    onChange={(e) =>
                      setForm({ ...form, position: Number(e.target.value) })
                    }
                  />
                </Field>
                <div className="flex items-center gap-2 pt-6">
                  <Checkbox
                    id="team-published"
                    checked={form.published}
                    onCheckedChange={(c) => setForm({ ...form, published: !!c })}
                  />
                  <Label htmlFor="team-published" className="text-sm">
                    Publikasikan
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={saving}
              >
                Batal
              </Button>
              <Button type="submit" disabled={saving} className="bg-navy hover:bg-navy/90">
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------- Testimonials ------------------------------- */

type Testimonial = {
  id: string;
  clientName: string;
  company: string | null;
  role: string | null;
  message: string;
  rating: number;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
};

type TestimonialForm = {
  clientName: string;
  company: string;
  role: string;
  message: string;
  rating: number;
  approved: boolean;
};

const EMPTY_TESTIMONIAL_FORM: TestimonialForm = {
  clientName: "",
  company: "",
  role: "",
  message: "",
  rating: 5,
  approved: false,
};

export function TestimonialsSection() {
  const { toast } = useToast();
  const { data, error, loading, refetch } = useAsyncResource<{ items: Testimonial[] }>(
    "/api/admin/testimonials"
  );
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Testimonial | null>(null);
  const [form, setForm] = React.useState<TestimonialForm>(EMPTY_TESTIMONIAL_FORM);
  const [saving, setSaving] = React.useState(false);

  const items = data?.items || [];

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_TESTIMONIAL_FORM);
    setOpen(true);
  };
  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      clientName: t.clientName,
      company: t.company || "",
      role: t.role || "",
      message: t.message,
      rating: t.rating || 5,
      approved: t.approved,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName || !form.message) {
      toast({
        title: "Validasi",
        description: "Nama klien dan pesan wajib diisi.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    const payload = {
      clientName: form.clientName,
      company: form.company || null,
      role: form.role || null,
      message: form.message,
      rating: Number(form.rating) || 5,
      approved: form.approved,
    };
    try {
      if (editing) {
        await fetcher("/api/admin/testimonials", {
          method: "PUT",
          body: JSON.stringify({ id: editing.id, ...payload }),
        });
        toast({ title: "Berhasil", description: "Testimonial diperbarui." });
      } else {
        await fetcher("/api/admin/testimonials", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast({ title: "Berhasil", description: "Testimonial ditambahkan." });
      }
      setOpen(false);
      refetch();
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err?.message || "Gagal menyimpan testimonial.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (t: Testimonial) => {
    if (!window.confirm(`Hapus testimonial dari "${t.clientName}"?`)) return;
    try {
      await fetcher(`/api/admin/testimonials?id=${t.id}`, { method: "DELETE" });
      toast({ title: "Berhasil", description: "Testimonial dihapus." });
      refetch();
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err?.message || "Gagal menghapus testimonial.",
        variant: "destructive",
      });
    }
  };

  const toggleApprove = async (t: Testimonial) => {
    try {
      await fetcher("/api/admin/testimonials", {
        method: "PUT",
        body: JSON.stringify({ id: t.id, approved: !t.approved }),
      });
      toast({
        title: "Berhasil",
        description: t.approved
          ? "Testimonial dibatalkan persetujuan."
          : "Testimonial disetujui.",
      });
      refetch();
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err?.message || "Gagal mengubah status persetujuan.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Testimonial"
        description="Kelola testimoni klien dan persetujuan publikasinya."
        action={
          <Button onClick={openCreate} className="bg-navy hover:bg-navy/90">
            <Plus className="size-4" /> Tambah Testimonial
          </Button>
        }
      />
      <Card className="gap-0 p-0">
        {loading && items.length === 0 ? (
          <LoadingState label="Memuat testimonial..." />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : items.length === 0 ? (
          <EmptyState title="Belum ada testimonial" />
        ) : (
          <div className="scroll-elegant max-h-[70vh] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow>
                  <TableHead>Klien</TableHead>
                  <TableHead className="hidden md:table-cell">Perusahaan</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium text-navy">
                      {t.clientName}
                      {t.role && (
                        <span className="block text-xs font-normal text-muted-foreground">
                          {t.role}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {t.company || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gold">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={
                              i < t.rating
                                ? "size-3.5 fill-gold"
                                : "size-3.5 text-muted-foreground/40"
                            }
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {t.approved ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                          Disetujui
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                      {formatShortDate(t.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant={t.approved ? "outline" : "default"}
                          onClick={() => toggleApprove(t)}
                          className={
                            t.approved
                              ? ""
                              : "bg-emerald-600 hover:bg-emerald-700 text-white"
                          }
                        >
                          {t.approved ? "Batal Setujui" : "Setujui"}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() => openEdit(t)}
                          aria-label="Edit"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(t)}
                          aria-label="Hapus"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Testimonial" : "Tambah Testimonial"}
            </DialogTitle>
            <DialogDescription>
              Tulis testimoni klien. Centang &quot;Disetujui&quot; untuk menampilkannya di situs.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="scroll-elegant max-h-[60vh] space-y-4 overflow-y-auto pr-1">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nama Klien" htmlFor="ts-name">
                  <Input
                    id="ts-name"
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  />
                </Field>
                <Field label="Perusahaan" htmlFor="ts-company">
                  <Input
                    id="ts-company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                </Field>
                <Field label="Peran / Jabatan" htmlFor="ts-role">
                  <Input
                    id="ts-role"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
                </Field>
                <Field label="Rating (1-5)" htmlFor="ts-rating">
                  <Select
                    value={String(form.rating)}
                    onValueChange={(v) => setForm({ ...form, rating: Number(v) })}
                  >
                    <SelectTrigger id="ts-rating" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} bintang
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Pesan Testimonial" htmlFor="ts-message" className="sm:col-span-2">
                  <Textarea
                    id="ts-message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="min-h-28"
                  />
                </Field>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Checkbox
                    id="ts-approved"
                    checked={form.approved}
                    onCheckedChange={(c) => setForm({ ...form, approved: !!c })}
                  />
                  <Label htmlFor="ts-approved" className="text-sm">
                    Disetujui untuk dipublikasikan
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={saving}
              >
                Batal
              </Button>
              <Button type="submit" disabled={saving} className="bg-navy hover:bg-navy/90">
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
