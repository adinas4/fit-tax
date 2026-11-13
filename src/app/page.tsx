"use client";

import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { Services } from "@/components/site/services";
import { Process } from "@/components/site/process";
import { Team } from "@/components/site/team";
import { Portfolio } from "@/components/site/portfolio";
import { WhyChooseUs } from "@/components/site/why-choose-us";
import { Faq } from "@/components/site/faq";
import { Insights } from "@/components/site/insights";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { FloatingWhatsApp } from "@/components/site/floating-whatsapp";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <Process />
        <Team />
        <Portfolio />
        <WhyChooseUs />
        <Faq />
        <Insights />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
