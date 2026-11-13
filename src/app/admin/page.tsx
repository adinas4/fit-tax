"use client";

import * as React from "react";
import {
  LayoutDashboard,
  MessageSquare,
  ClipboardCheck,
  Trophy,
  FileText,
  Users,
  Star,
  Settings,
  KeyRound,
  LogOut,
  Menu,
  Loader2,
  ShieldCheck,
  Building2,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { fetcher } from "./_shared";
import { cn } from "@/lib/utils";

import { DashboardSection } from "./_sections-consult";
import { ConsultationsSection } from "./_sections-consult";
import {
  ServicesSection,
  PortfolioSection,
  ArticlesSection,
  TeamSection,
  TestimonialsSection,
} from "./_sections-content";
import { SettingsSection, PasswordSection } from "./_sections-settings";

type AdminUser = {
  id: string;
  email: string;
  name?: string;
  role?: string;
};

type SectionKey =
  | "dashboard"
  | "consultations"
  | "services"
  | "portfolio"
  | "articles"
  | "team"
  | "testimonials"
  | "settings"
  | "password";

const NAV_ITEMS: {
  key: SectionKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "consultations", label: "Pesan Konsultasi", icon: MessageSquare },
  { key: "services", label: "Layanan", icon: ClipboardCheck },
  { key: "portfolio", label: "Portofolio", icon: Trophy },
  { key: "articles", label: "Artikel", icon: FileText },
  { key: "team", label: "Tim Konsultan", icon: Users },
  { key: "testimonials", label: "Testimonial", icon: Star },
  { key: "settings", label: "Pengaturan", icon: Settings },
  { key: "password", label: "Ganti Password", icon: KeyRound },
];

export default function AdminPage() {
  const { toast } = useToast();
  const [authChecked, setAuthChecked] = React.useState(false);
  const [user, setUser] = React.useState<AdminUser | null>(null);
  const [activeSection, setActiveSection] = React.useState<SectionKey>("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  // Check auth on mount.
  React.useEffect(() => {
    let cancelled = false;
    fetcher<{ authenticated?: boolean; user?: AdminUser }>("/api/admin/me")
      .then((res) => {
        if (cancelled) return;
        if (res?.authenticated && res.user) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setUser(null);
      })
      .finally(() => {
        if (!cancelled) setAuthChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetcher("/api/admin/logout", { method: "POST" });
      setUser(null);
      setActiveSection("dashboard");
      toast({ title: "Logout berhasil", description: "Anda telah keluar." });
    } catch (err: any) {
      toast({
        title: "Gagal logout",
        description: err?.message || "Terjadi kesalahan.",
        variant: "destructive",
      });
    }
  };

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist">
        <div className="flex items-center gap-3 text-navy">
          <Loader2 className="size-6 animate-spin text-royal" />
          <span className="text-sm font-medium">Memuat admin panel...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginForm
        onLoggedIn={(u) => {
          setUser(u);
          setActiveSection("dashboard");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-mist">
      {/* Top bar */}
      <header className="bg-navy-gradient text-white shadow-md">
        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden inline-flex size-9 items-center justify-center rounded-md text-white/90 hover:bg-white/10"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Buka menu"
            >
              <Menu className="size-5" />
            </button>
            <div className="flex items-center gap-2">
              <img
                src="/images/logo-light.png"
                alt="FIT-TAX Cakrawala Sinergi"
                className="h-8 w-auto select-none"
                draggable={false}
              />
              <span className="hidden text-[10px] uppercase tracking-[0.18em] text-gold sm:inline sm:text-xs">
                Admin Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-white/60">Masuk sebagai</p>
              <p className="max-w-[220px] truncate text-sm font-medium">
                {user.email}
              </p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
              {(user.name || user.email).charAt(0).toUpperCase()}
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a href="/" aria-label="Kembali ke website">
                <ExternalLink className="size-4" />
                <span className="hidden sm:inline">Kembali ke Website</span>
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 flex-shrink-0 overflow-y-auto bg-navy-gradient text-white lg:block">
          <nav className="flex flex-col gap-1 p-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveSection(item.key)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                    active
                      ? "bg-white/10 font-semibold text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4 flex-shrink-0",
                      active ? "text-gold" : "text-white/60"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold" />
                  )}
                </button>
              );
            })}
          </nav>
          <div className="mt-auto px-4 py-4 text-[10px] text-white/40">
            &copy; {new Date().getFullYear()} FIT-TAX Cakrawala Sinergi
          </div>
        </aside>

        {/* Mobile nav */}
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent side="left" className="w-72 bg-navy-gradient p-0 text-white">
            <SheetHeader className="px-4 pt-5">
              <SheetTitle className="text-white">Menu Admin</SheetTitle>
              <SheetDescription className="text-white/60">
                Pilih bagian yang ingin dikelola.
              </SheetDescription>
            </SheetHeader>
            <div className="px-3 pb-2 pt-1">
              <a
                href="/"
                className="flex items-center gap-3 rounded-md bg-white/5 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                <ExternalLink className="size-4 flex-shrink-0 text-gold" />
                Kembali ke Website
              </a>
            </div>
            <nav className="flex flex-col gap-1 p-3 pt-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setActiveSection(item.key);
                      setMobileNavOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                      active
                        ? "bg-white/10 font-semibold text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4 flex-shrink-0",
                        active ? "text-gold" : "text-white/60"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="mt-auto px-4 py-4 text-[10px] text-white/40">
              &copy; {new Date().getFullYear()} FIT-TAX Cakrawala Sinergi
            </div>
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="scroll-elegant min-h-[calc(100vh-4rem)] flex-1 overflow-x-hidden bg-mist p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <SectionRenderer section={activeSection} />
          </div>
        </main>
      </div>
    </div>
  );
}

function SectionRenderer({ section }: { section: SectionKey }) {
  switch (section) {
    case "dashboard":
      return <DashboardSection />;
    case "consultations":
      return <ConsultationsSection />;
    case "services":
      return <ServicesSection />;
    case "portfolio":
      return <PortfolioSection />;
    case "articles":
      return <ArticlesSection />;
    case "team":
      return <TeamSection />;
    case "testimonials":
      return <TestimonialsSection />;
    case "settings":
      return <SettingsSection />;
    case "password":
      return <PasswordSection />;
    default:
      return null;
  }
}

/* ------------------------------- Login ------------------------------- */

function LoginForm({ onLoggedIn }: { onLoggedIn: (u: AdminUser) => void }) {
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetcher<{ user?: AdminUser; message?: string }>(
        "/api/admin/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      );
      if (res?.user) {
        // Re-fetch /me to confirm session is set.
        try {
          const me = await fetcher<{
            authenticated?: boolean;
            user?: AdminUser;
          }>("/api/admin/me");
          if (me?.authenticated && me.user) {
            onLoggedIn(me.user);
            toast({ title: "Login berhasil", description: `Selamat datang, ${me.user.email}.` });
            return;
          }
        } catch {
          /* fall through to use login response user */
        }
        onLoggedIn(res.user);
        toast({ title: "Login berhasil", description: `Selamat datang, ${res.user.email}.` });
      } else {
        throw new Error(res?.message || "Login gagal");
      }
    } catch (err: any) {
      toast({
        title: "Login gagal",
        description: err?.message || "Email atau password salah.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-navy-gradient flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-white">
          <img
            src="/images/logo-light.png"
            alt="FIT-TAX Cakrawala Sinergi"
            className="mx-auto mb-3 h-14 w-auto select-none"
            draggable={false}
          />
          <p className="text-xs uppercase tracking-[0.22em] text-gold">
            Admin Panel
          </p>
          <p className="mt-3 text-sm text-white/70">
            Masuk untuk mengelola konten situs.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-white/10 bg-white p-6 shadow-2xl"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-sm font-medium text-navy">
                Email
              </Label>
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cakrawalaintiteknik.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-password" className="text-sm font-medium text-navy">
                Password
              </Label>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-navy hover:bg-navy/90"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Memproses...
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4" /> Masuk
                </>
              )}
            </Button>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Hanya untuk administrator yang berwenang.
          </p>
        </form>
      </div>
    </div>
  );
}
