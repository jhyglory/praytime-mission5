/* eslint-disable @next/next/no-img-element -- Exact Figma choice arrow exports. */
import { AnchorLink } from "@/components/landing/anchor-link";
import { GapLightDivider } from "@/components/landing/gap-light-divider";

export function GapSection() {
  return <section className="landing-section section-depth gap-section" id="the-gap" aria-labelledby="gap-heading">
    <picture className="gap-architecture"><source media="(width < 768px)" srcSet="/assets/landing-gap-mobile.svg" width="393" height="1024" /><img src="/assets/landing-gap-desktop.svg" alt="" width="1440" height="1180" /></picture>
    <div className="container section-stack">
    <h2 id="gap-heading" tabIndex={-1}>충동과 행동 사이,<br />기도가 머물 작은 틈을<span className="mobile-break"><br /></span><span className="desktop-space"> </span>만듭니다.</h2>
    <p className="body-copy">PrayTime은 SNS를 여는 순간에 개입합니다.<br />짧게 기도한 뒤, 지금도 필요한 사용인지<span className="mobile-break"><br /></span><span className="desktop-space"> </span>다시 선택합니다.</p>
    <div className="equal-outcomes"><div><GapLightDivider variant="choice" /><AnchorLink className="gap-choice gap-choice--return" href="#hero" aria-labelledby="gap-return-title" aria-describedby="gap-return-context"><p id="gap-return-context">필요하지 않다면</p><div className="gap-choice__action"><h3 id="gap-return-title">지금은 돌아가기</h3><img src="/assets/choice-left-arrow.svg" width="24" height="24" alt="" /></div></AnchorLink></div><div><GapLightDivider variant="choice" /><AnchorLink className="gap-choice gap-choice--time" href="#how-it-works" aria-labelledby="gap-time-title" aria-describedby="gap-time-context"><p id="gap-time-context">필요하다면</p><div className="gap-choice__action"><h3 id="gap-time-title">5 · 10 · 15분 선택</h3><img src="/assets/choice-right-arrow.svg" width="24" height="24" alt="" /></div></AnchorLink></div></div>
  </div></section>;
}
