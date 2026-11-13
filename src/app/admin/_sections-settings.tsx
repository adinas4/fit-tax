"use client";

import * as React from "react";
import {
  Save,
  Loader2,
  Lock,
  Building2,
  Phone,
  Share2,
  Search,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { fetcher } from "./_shared";
import { useAsyncResource } from "./_use-async";
import { LoadingState, ErrorState, SectionHeader, Field } from "./_ui";

/* ------------------------------- Settings ------------------------------- */

type SettingsData = {
  company: {
    name: string;
    shortName: string;
    tagline: string;
    legalForm: string;
    description: string;
  };
  contact: {
    phone: string;
    whatsappDisplay: string;
    whatsappNumber: string;
    email: string;
    address: string;
    addressShort: string;
    mapsQuery: string;
  };
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
};

const EMPTY_SETTINGS: SettingsData = {
  company: {
    name: "",
    shortName: "",
    tagline: "",
    legalForm: "",
    description: "",
  },
  contact: {
    phone: "",
    whatsappDisplay: "",
    whatsappNumber: "",
    email: "",
    address: "",
    addressShort: "",
    mapsQuery: "",
  },
  social: { facebook: "", instagram: "", linkedin: "" },
  seo: { title: "", description: "", ogImage: "" },
};

export function SettingsSection() {
  const { toast } = useToast();
  const { data, error, loading, refetch } = useAsyncResource<{ settings: SettingsData }>(
    "/api/admin/settings"
  );
  const [form, setForm] = React.useState<SettingsData>(EMPTY_SETTINGS);
  const [tracked, setTracked] = React.useState<boolean>(false);
  const [saving, setSaving] = React.useState(false);

  // Sync form state from server data using the React "adjust state when prop changes" pattern.
  const serverSettings = data?.settings;
  if (serverSettings && !tracked) {
    setTracked(true);
    setForm(serverSettings);
  } else if (!serverSettings && tracked) {
    setTracked(false);
  }

  const updateCompany = (k: keyof SettingsData["company"], v: string) =>
    setForm((f) => ({ ...f, company: { ...f.company, [k]: v } }));
  const updateContact = (k: keyof SettingsData["contact"], v: string) =>
    setForm((f) => ({ ...f, contact: { ...f.contact, [k]: v } }));
  const updateSocial = (k: keyof SettingsData["social"], v: string) =>
    setForm((f) => ({ ...f, social: { ...f.social, [k]: v } }));
  const updateSeo = (k: keyof SettingsData["seo"], v: string) =>
    setForm((f) => ({ ...f, seo: { ...f.seo, [k]: v } }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetcher("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      toast({ title: "Berhasil", description: "Pengaturan disimpan." });
      refetch();
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err?.message || "Gagal menyimpan pengaturan.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading && !data) return <LoadingState label="Memuat pengaturan..." />;
  if (error && !data) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Pengaturan"
        description="Kelola informasi perusahaan, kontak, media sosial, dan SEO."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <SettingsCard
          icon={Building2}
          title="Perusahaan"
          description="Identitas resmi perusahaan."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama Lengkap" htmlFor="set-co-name">
              <Input
                id="set-co-name"
                value={form.company.name}
                onChange={(e) => updateCompany("name", e.target.value)}
              />
            </Field>
            <Field label="Nama Singkat" htmlFor="set-co-short">
              <Input
                id="set-co-short"
                value={form.company.shortName}
                onChange={(e) => updateCompany("shortName", e.target.value)}
              />
            </Field>
            <Field label="Bentuk Hukum" htmlFor="set-co-legal" className="sm:col-span-2">
              <Input
                id="set-co-legal"
                value={form.company.legalForm}
                onChange={(e) => updateCompany("legalForm", e.target.value)}
              />
            </Field>
            <Field label="Tagline" htmlFor="set-co-tag" className="sm:col-span-2">
              <Input
                id="set-co-tag"
                value={form.company.tagline}
                onChange={(e) => updateCompany("tagline", e.target.value)}
              />
            </Field>
            <Field label="Deskripsi" htmlFor="set-co-desc" className="sm:col-span-2">
              <Textarea
                id="set-co-desc"
                value={form.company.description}
                onChange={(e) => updateCompany("description", e.target.value)}
                className="min-h-28"
              />
            </Field>
          </div>
        </SettingsCard>

        <SettingsCard
          icon={Phone}
          title="Kontak"
          description="Nomor telepon, WhatsApp, email, dan alamat kantor."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Telepon" htmlFor="set-c-phone">
              <Input
                id="set-c-phone"
                value={form.contact.phone}
                onChange={(e) => updateContact("phone", e.target.value)}
              />
            </Field>
            <Field label="Email" htmlFor="set-c-email">
              <Input
                id="set-c-email"
                type="email"
                value={form.contact.email}
                onChange={(e) => updateContact("email", e.target.value)}
              />
            </Field>
            <Field label="WhatsApp (Tampilan)" htmlFor="set-c-wa-display">
              <Input
                id="set-c-wa-display"
                value={form.contact.whatsappDisplay}
                onChange={(e) => updateContact("whatsappDisplay", e.target.value)}
                placeholder="+62 812 1317 5541"
              />
            </Field>
            <Field label="WhatsApp (Nomor, format internasional)" htmlFor="set-c-wa-num">
              <Input
                id="set-c-wa-num"
                value={form.contact.whatsappNumber}
                onChange={(e) => updateContact("whatsappNumber", e.target.value)}
                placeholder="6281213175541"
              />
            </Field>
            <Field label="Alamat Lengkap" htmlFor="set-c-addr" className="sm:col-span-2">
              <Textarea
                id="set-c-addr"
                value={form.contact.address}
                onChange={(e) => updateContact("address", e.target.value)}
                className="min-h-20"
              />
              <p className="flex items-start gap-1.5 text-xs text-amber-600">
                <AlertTriangle className="mt-0.5 size-3.5 flex-shrink-0" />
                <span>
                  Alamat diatur sesuai instruksi — edit dengan hati-hati.
                </span>
              </p>
            </Field>
            <Field label="Alamat Singkat" htmlFor="set-c-addr-short">
              <Input
                id="set-c-addr-short"
                value={form.contact.addressShort}
                onChange={(e) => updateContact("addressShort", e.target.value)}
              />
            </Field>
            <Field label="Google Maps Query" htmlFor="set-c-maps">
              <Input
                id="set-c-maps"
                value={form.contact.mapsQuery}
                onChange={(e) => updateContact("mapsQuery", e.target.value)}
              />
            </Field>
          </div>
        </SettingsCard>

        <SettingsCard
          icon={Share2}
          title="Media Sosial"
          description="Tautan ke profil media sosial perusahaan."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Facebook" htmlFor="set-s-fb">
              <Input
                id="set-s-fb"
                value={form.social.facebook}
                onChange={(e) => updateSocial("facebook", e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </Field>
            <Field label="Instagram" htmlFor="set-s-ig">
              <Input
                id="set-s-ig"
                value={form.social.instagram}
                onChange={(e) => updateSocial("instagram", e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </Field>
            <Field label="LinkedIn" htmlFor="set-s-li">
              <Input
                id="set-s-li"
                value={form.social.linkedin}
                onChange={(e) => updateSocial("linkedin", e.target.value)}
                placeholder="https://linkedin.com/..."
              />
            </Field>
          </div>
        </SettingsCard>

        <SettingsCard
          icon={Search}
          title="SEO"
          description="Metadata untuk mesin pencari dan media sosial."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="SEO Title" htmlFor="set-seo-title" className="sm:col-span-2">
              <Input
                id="set-seo-title"
                value={form.seo.title}
                onChange={(e) => updateSeo("title", e.target.value)}
              />
            </Field>
            <Field label="SEO Description" htmlFor="set-seo-desc" className="sm:col-span-2">
              <Textarea
                id="set-seo-desc"
                value={form.seo.description}
                onChange={(e) => updateSeo("description", e.target.value)}
                className="min-h-20"
              />
            </Field>
            <Field label="OG Image URL" htmlFor="set-seo-og" className="sm:col-span-2">
              <Input
                id="set-seo-og"
                value={form.seo.ogImage}
                onChange={(e) => updateSeo("ogImage", e.target.value)}
                placeholder="https://..."
              />
            </Field>
          </div>
        </SettingsCard>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="bg-navy hover:bg-navy/90">
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save className="size-4" /> Simpan Pengaturan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="gap-0 p-0">
      <div className="flex items-center gap-3 border-b px-5 py-4">
        <div className="flex size-9 items-center justify-center rounded-lg bg-mist">
          <Icon className="size-4 text-royal" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-navy">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}

/* ------------------------------- Password ------------------------------- */

export function PasswordSection() {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const mismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const tooShort = newPassword.length > 0 && newPassword.length < 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tooShort) {
      toast({
        title: "Validasi",
        description: "Password baru minimal 6 karakter.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "Validasi",
        description: "Konfirmasi password tidak cocok.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      await fetcher("/api/admin/password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      toast({ title: "Berhasil", description: "Password berhasil diubah." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err?.message || "Gagal mengubah password.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Ganti Password"
        description="Perbarui password akun admin Anda secara berkala."
      />

      <Card className="max-w-xl gap-0 p-0">
        <div className="flex items-center gap-3 border-b px-5 py-4">
          <div className="flex size-9 items-center justify-center rounded-lg bg-mist">
            <Lock className="size-4 text-royal" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-navy">Ubah Password</h3>
            <p className="text-xs text-muted-foreground">
              Gunakan password yang kuat dan unik.
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <Field label="Password Saat Ini" htmlFor="pw-current">
            <Input
              id="pw-current"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </Field>
          <Field label="Password Baru" htmlFor="pw-new" hint={tooShort ? "Minimal 6 karakter." : undefined}>
            <Input
              id="pw-new"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </Field>
          <Field
            label="Konfirmasi Password Baru"
            htmlFor="pw-confirm"
            hint={mismatch ? "Konfirmasi tidak cocok." : undefined}
          >
            <Input
              id="pw-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
              aria-invalid={mismatch || undefined}
            />
          </Field>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving || mismatch || tooShort}
              className="bg-navy hover:bg-navy/90"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Lock className="size-4" /> Ubah Password
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
