"use client";

import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  light = false,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-3",
        centered ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]",
            light ? "text-gold" : "text-royal"
          )}
        >
          <span className="h-px w-6 bg-gold" />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-[2.6rem]",
          light ? "text-white" : "text-navy"
        )}
      >
        {title}
      </h2>
      <span className="divider-gold mt-1" />
      {description && (
        <p
          className={cn(
            "max-w-2xl text-[15px] leading-relaxed md:text-base",
            centered ? "mx-auto" : "",
            light ? "text-slate-300" : "text-slate-600"
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
