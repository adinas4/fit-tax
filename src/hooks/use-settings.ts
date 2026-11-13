"use client";

import { useEffect, useState } from "react";
import { COMPANY, waLink } from "@/lib/content";
import { IS_GITHUB_PREVIEW } from "@/lib/github-preview";

export interface LiveSettings {
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
}

const FALLBACK: LiveSettings = {
  company: {
    name: COMPANY.name,
    shortName: COMPANY.shortName,
    tagline: COMPANY.tagline,
    legalForm: COMPANY.legalForm,
    description: COMPANY.description,
  },
  contact: {
    phone: COMPANY.contact.phone,
    whatsappDisplay: COMPANY.contact.whatsappDisplay,
    whatsappNumber: COMPANY.contact.whatsappNumber,
    email: COMPANY.contact.email,
    address: COMPANY.contact.address,
    addressShort: COMPANY.contact.addressShort,
    mapsQuery: COMPANY.contact.mapsQuery,
  },
  social: { facebook: "", instagram: "", linkedin: "" },
  seo: { title: "", description: "", ogImage: "" },
};

let cache: LiveSettings | null = null;

export function useSettings() {
  const [settings, setSettings] = useState<LiveSettings>(cache ?? FALLBACK);

  useEffect(() => {
    let active = true;
    if (cache || IS_GITHUB_PREVIEW) {
      return;
    }
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (active && d.success && d.settings) {
          cache = d.settings as LiveSettings;
          setSettings(d.settings);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return settings;
}

export function useWaLink() {
  const settings = useSettings();
  return (text?: string) =>
    waLink(
      text,
      settings.contact.whatsappNumber || COMPANY.contact.whatsappNumber
    );
}
