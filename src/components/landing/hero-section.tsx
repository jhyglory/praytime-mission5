/* Use the user-supplied high-resolution artwork without stretching it. */
import { Button } from "@/components/ui/button";
import { AnchorLink } from "@/components/landing/anchor-link";
import { Header } from "@/components/landing/header";
import { HeroPointerMotion } from "@/components/landing/hero-pointer-motion";

export function HeroSection() {
  return <section className="hero" id="hero" aria-labelledby="hero-heading" data-figma-node="1209:515 / 1209:1052">
    <HeroPointerMotion />
    <picture className="hero-artwork"><img src="/assets/high-resolution/hero-hq-fcbad7e4f361.png" alt="" width="1672" height="941" fetchPriority="high" /></picture>
    <div className="hero-legibility" aria-hidden="true" /><div className="hero-top-blend" aria-hidden="true" />
    <Header />
    <div className="hero-content">
      <div className="hero-editorial">
        <p className="eyebrow">기독교 기반 디지털 웰니스</p>
        <h1 id="hero-heading" tabIndex={-1}>무심코 SNS를<span className="mobile-break"><br /></span><span className="desktop-space"> </span>여는 순간,<br />기도로 멈추고<span className="mobile-break"><br /></span><span className="desktop-space"> </span>다시 선택하세요.</h1>
        <p className="body-copy">SNS를 열기 전 잠깐 기도하고,<br />지금도 필요한지 돌아보세요.</p>
      </div>
      <div className="hero-artwork-interval" aria-hidden="true" />
      <div className="hero-actions"><Button asChild><AnchorLink href="#beta-signup">무료로 신청하기</AnchorLink></Button><Button asChild variant="secondary"><AnchorLink href="#the-gap">작동 방식 보기</AnchorLink></Button></div>
      <p className="small-copy">기도를 마쳐도 SNS가 자동으로 열리지는 않습니다.</p>
    </div>
  </section>;
}
