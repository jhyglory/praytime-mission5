/* Use the user-supplied high-resolution artwork without stretching it. */
import { Button } from "@/components/ui/button";
import { AnchorLink } from "@/components/landing/anchor-link";
import { Header } from "@/components/landing/header";

export function HeroSection() {
  return <section className="hero" id="hero" aria-labelledby="hero-heading" data-figma-node="1209:515 / 1209:1052">
    <picture className="hero-artwork"><img src="/assets/high-resolution/hero-hq-fcbad7e4f361.png" alt="" width="1672" height="941" fetchPriority="high" /></picture>
    <div className="hero-legibility" aria-hidden="true" /><div className="hero-top-blend" aria-hidden="true" />
    <Header />
    <div className="hero-content">
      <div className="hero-editorial">
        <p className="eyebrow">기독교인을 위한 SNS 사용 관리 앱</p>
        <h1 id="hero-heading" tabIndex={-1}>SNS를 열기 전,<br />잠깐, 기도부터.</h1>
        <p className="body-copy">기도 후, 돌아가거나 필요한 시간을 고르세요.<br />5·10·15분 사용 후에는 다시 제한됩니다.</p>
      </div>
      <div className="hero-artwork-interval" aria-hidden="true" />
      <div className="hero-actions"><Button asChild><AnchorLink href="#beta-signup">무료 사전예약하기</AnchorLink></Button><Button asChild variant="secondary"><AnchorLink href="#the-gap">작동 방식 보기</AnchorLink></Button></div>
      <p className="small-copy">사전예약 무료 · 베타 일정 확정 후 이메일 안내</p>
    </div>
  </section>;
}
