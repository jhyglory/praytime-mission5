import { AnchorLink } from "@/components/landing/anchor-link";
import { HeroSection } from "@/components/landing/hero-section";
import { OneQuestionSection } from "@/components/landing/one-question-section";
import { WhyNowSection } from "@/components/landing/why-now-section";
import { SignatureTransition } from "@/components/landing/signature-transition";
import { GapSection } from "@/components/landing/gap-section";
import { TimeSelectSection } from "@/components/landing/time-select-section";
import { VoluntaryPrayerSection } from "@/components/landing/voluntary-prayer-section";
import { FaqSection } from "@/components/landing/faq-section";
import { BetaSignupSection } from "@/components/landing/beta-signup-section";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <>
      <AnchorLink className="skip-link" href="#how-it-works">본문으로 건너뛰기</AnchorLink>
      <main>
        <HeroSection />
        <OneQuestionSection />
        <WhyNowSection />
        <SignatureTransition />
        <GapSection />
        <TimeSelectSection />
        <VoluntaryPrayerSection />
        <FaqSection />
        <BetaSignupSection />
      </main>
      <Footer />
    </>
  );
}
