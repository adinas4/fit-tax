"use client";

import { ChevronDown } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { FAQS } from "@/lib/content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faq() {
  return (
    <section id="faq" className="section-pad bg-mist">
      <div className="container-x">
        <SectionHeading
          eyebrow="FAQ"
          title="Pertanyaan yang Sering Diajukan"
          description="Temukan jawaban atas pertanyaan umum seputar layanan konsultasi perpajakan kami. Jangan ragu untuk menghubungi kami bila membutuhkan informasi lebih lanjut."
        />

        <Reveal className="mx-auto mt-12 max-w-3xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-b border-slate-100 last:border-0"
                >
                  <AccordionTrigger className="px-5 py-4 text-left text-[15px] font-semibold text-navy hover:no-underline hover:text-royal [&>svg]:hidden">
                    <span className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold">
                        {i + 1}
                      </span>
                      <span className="flex-1">{faq.question}</span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 pl-14 text-sm leading-relaxed text-slate-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
