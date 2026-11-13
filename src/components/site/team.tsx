"use client";

import { useEffect, useState } from "react";
import { Award, User, Briefcase } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { Card } from "@/components/ui/card";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  credentials: string | null;
  bio: string | null;
  photoUrl: string | null;
}

export function Team() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setTeam(d.team);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="tim" className="section-pad bg-white">
      <div className="container-x">
        <SectionHeading
          eyebrow="Tim Ahli Kami"
          title="Konsultan Berpengalaman di Bidang Perpajakan"
          description="Tim kami terdiri dari konsultan dengan latar belakang di bidang perpajakan dan akuntansi, siap memberikan solusi terbaik yang sesuai dengan kebutuhan Anda."
        />

        {loading ? (
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-mist" />
            ))}
          </div>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {team.map((member, i) => (
              <Reveal key={member.id} delay={i * 90}>
                <Card className="group h-full overflow-hidden border border-slate-200 bg-white p-0 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative bg-navy-gradient px-6 pb-10 pt-12">
                    <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/15 blur-2xl" />
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/10 ring-4 ring-white/10 backdrop-blur">
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-10 w-10 text-gold" />
                      )}
                    </div>
                  </div>
                  <div className="px-6 pb-7">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold">
                      <Briefcase className="h-3 w-3" />
                      {member.role}
                    </span>
                    <h3 className="mt-3 text-base font-bold leading-snug text-navy">
                      {member.name}
                    </h3>
                    {member.credentials && (
                      <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-royal">
                        <Award className="h-3.5 w-3.5" />
                        {member.credentials}
                      </p>
                    )}
                    {member.bio && (
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="mt-10">
          <p className="text-center text-xs text-slate-500">
            Kredensial dan profil tim diperbarui secara berkala melalui panel
            administrator.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
