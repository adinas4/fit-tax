"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
  /** Hide the image-based wordmark (icon only is not supported here, kept for API compat). */
  showText?: boolean;
  compact?: boolean;
}

/**
 * Brand lockup for FIT-TAX Cakrawala Sinergi.
 * The official logo image already contains the full wordmark
 * ("Fit-tax" with a golden stylised "x") and the "CAKRAWALA SINERGI"
 * subtitle, so we only render the image — no extra text is appended.
 *
 * - variant="dark"  => color logo (navy + gold) for LIGHT backgrounds
 * - variant="light" => all-white logo for DARK backgrounds
 */
export function Logo({
  variant = "dark",
  className,
  // kept for API compatibility; the image already includes the text
  showText = true,
  compact = false,
}: LogoProps) {
  const isLight = variant === "light";
  const imgSrc = isLight ? "/images/logo-light.png" : "/images/logo-dark.png";

  return (
    <span className={cn("flex items-center", className)}>
      <img
        src={imgSrc}
        alt="Logo FIT-TAX Cakrawala Sinergi"
        className={cn(
          "w-auto select-none",
          compact ? "h-8" : "h-9 md:h-10"
        )}
        draggable={false}
      />
    </span>
  );
}
