import { Hero } from "@/components/landing/Hero";
import { Marquee } from "@/components/landing/Marquee";
import { Stats } from "@/components/landing/Stats";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturedTrainers } from "@/components/landing/FeaturedTrainers";
import { Features } from "@/components/landing/Features";
import { BookingPreview } from "@/components/landing/BookingPreview";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Stats />
      <HowItWorks />
      <FeaturedTrainers />
      <Features />
      <BookingPreview />
      <Testimonials />
      <Pricing />
      <CTA />
    </main>
  );
}
