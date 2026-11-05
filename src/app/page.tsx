/* eslint-disable @next/next/no-img-element -- Use the exact approved Figma raster assets and crops. */
import { buttonClass } from "@/components/ui/button";
import { AnchorLink } from "@/components/landing/anchor-link";
import { PauseMark } from "@/components/landing/pause-mark";
import { Puzz } from "@/components/landing/puzz";
import { FAQ } from "@/components/landing/faq";
import { BetaSignupForm } from "@/components/landing/beta-signup-form";
import { PRIVACY_POLICY_URL } from "@/lib/privacy-policy";

function Wordmark() {
  return <a href="#hero" className="wordmark" aria-label="PrayTime 처음으로"><span className="solid-pause" aria-hidden="true"><i /><i /></span><span>PRAYTIME</span></a>;
}

function LandingHeader() {
  return <header className="landing-header"><Wordmark /><nav aria-label="주요 메뉴"><AnchorLink href="#how-it-works">작동 방식</AnchorLink><AnchorLink href="#prayer-choice">기도와 선택</AnchorLink><AnchorLink href="#faq">FAQ</AnchorLink></nav><AnchorLink href="#beta-signup" className={buttonClass()}>베타 사전신청</AnchorLink></header>;
}

function Hero() {
  return <section className="hero" id="hero" aria-labelledby="hero-heading" data-figma-node="933:3 / 933:4">
    <picture className="hero-artwork"><source media="(width < 768px)" srcSet="/assets/hero-atmosphere-mobile.png" /><img src="/assets/hero-atmosphere.png" alt="" width="1440" height="684" fetchPriority="high" /></picture>
    <div className="hero-legibility" aria-hidden="true" /><div className="hero-top-blend" aria-hidden="true" />
    <LandingHeader />
    <div className="hero-content">
      <p className="eyebrow">기독교 기반 디지털 웰니스</p>
      <h1 id="hero-heading" tabIndex={-1}>무심코 SNS를<span className="mobile-break"><br /></span><span className="desktop-space"> </span>여는 순간,<br />기도로 멈추고<span className="mobile-break"><br /></span><span className="desktop-space"> </span>다시 선택하세요.</h1>
      <p className="body-copy">SNS를 열기 전 잠깐 기도하고,<br />지금도 필요한지 돌아보세요.</p>
      <div className="hero-actions"><AnchorLink href="#beta-signup" className={buttonClass()}>베타 사전신청</AnchorLink><AnchorLink href="#how-it-works" className={buttonClass("secondary")}>작동 방식 보기</AnchorLink></div>
      <p className="small-copy">기도를 마쳐도 SNS가 자동으로 열리지는 않습니다.</p>
    </div>
  </section>;
}

function OneQuestion() {
  return <section className="one-question light-section" aria-labelledby="question-heading"><div className="container content-stack"><p className="eyebrow">BEFORE YOU OPEN</p><h2 id="question-heading">지금 이 앱이<br />꼭 필요한가요?</h2><p className="body-copy">열기 전에, 필요한 사용인지 한 번 더 확인합니다.</p></div></section>;
}

function WhyNow() {
  return <section className="why-now light-section" aria-labelledby="why-heading"><div className="why-content container">
    <p className="why-eyebrow">WHY NOW</p><h2 id="why-heading">우리가 필요한 건<br />더 강한 의지가 아니라,<br />멈출 지점입니다.</h2>
    <p className="why-support">스마트폰 사용을 줄이려는 마음이 있어도<br />익숙한 행동은 생각보다 빠르게 반복됩니다.</p>
    <div className="stats-grid">{[{ age: "20대", rate: 34.3 }, { age: "30대", rate: 25.3 }].map(({ age, rate }) => <div className="stat-card" key={age}><p className="stat-age">{age}</p><p className="stat-value">{rate}%</p><p className="stat-caption"><span className="stat-caption-age">{age} </span>스마트폰 과의존 위험군</p><div className="stat-track" aria-hidden="true"><div className="stat-fill" style={{ width: `${rate}%` }} /></div></div>)}</div>
    <p className="stat-source"><span className="desktop-source">출처: 한국지능정보사회진흥원, 「2025년 스마트폰 과의존 실태조사」, p.40, 표 3-1-3</span><span className="mobile-source">출처: 한국지능정보사회진흥원(NIA)<br />2025년 스마트폰 과의존 실태조사, p.40, 표 3-1-3.</span></p>
    <p className="why-bridge">그래서, 행동하기 전에<br />잠깐의 틈을 만듭니다.</p>
  </div></section>;
}

function TheGap() {
  return <section className="landing-section section-depth gap-section" id="the-gap" aria-labelledby="gap-heading"><div className="container section-stack">
    <p className="eyebrow">04 / THE GAP</p><div className="gap-threshold" aria-hidden="true"><PauseMark /></div>
    <h2 id="gap-heading">충동과 행동 사이,<br />기도가 머물 작은 틈을<span className="mobile-break"><br /></span><span className="desktop-space"> </span>만듭니다.</h2>
    <p className="body-copy">PrayTime은 SNS를 여는 순간에 개입합니다.<br />짧게 기도한 뒤, 지금도 필요한 사용인지<span className="mobile-break"><br /></span><span className="desktop-space"> </span>다시 선택합니다.</p>
    <div className="equal-outcomes"><div><p>필요하지 않다면</p><h3>지금은 돌아가기</h3></div><div><p>필요하다면</p><h3>5 · 10 · 15분 선택</h3></div></div>
  </div></section>;
}

function TimeSelect() {
  return <section className="time-section" id="how-it-works" aria-labelledby="how-heading"><div className="time-layout container"><div className="content-stack time-story"><p className="eyebrow">PRAY · THEN CHOOSE</p><h2 id="how-heading" tabIndex={-1}>기도 후에도,<br />선택은 나에게.</h2><p className="body-copy">기도를 마쳐도 SNS가 자동으로 열리지 않습니다.<br />지금 필요한지 다시 보고, 필요하다면 사용할 시간을 직접 정합니다.</p><p className="time-reminder desktop-reminder">정한 시간이 끝나면 다시 제한되고,<br />더 사용하려면 다시 기도하고 선택합니다.</p></div><img className="time-mockup" src="/assets/time-select-wheel.png" width="330" height="715.42" alt="PrayTime 시간 선택 화면. 5분·10분·15분 중 10분 선택. 이 시간만 사용하기. 시간이 끝나면 다시 멈춥니다." /><p className="time-reminder mobile-reminder">정한 시간이 끝나면 다시 제한되고,<br />더 사용하려면 다시 기도하고 선택합니다.</p></div></section>;
}

function PrayerBeforeChoice() {
  return <section className="prayer-section light-section" id="prayer-choice" aria-labelledby="prayer-heading"><div className="container prayer-editorial"><div className="prayer-heading"><div className="content-stack"><p className="eyebrow">MAKE ROOM FOR PRAYER</p><h2 id="prayer-heading" tabIndex={-1}>선택 앞에,<br />잠깐 기도.</h2></div><p className="prayer-statement">잠깐 멈추고, 하나님께 시선을 돌리고,<br />지금 필요한지 다시 살펴봅니다.</p></div><ol className="prayer-steps">{[["PAUSE", "잠깐 멈추고"], ["PRAY", "하나님께 시선을 돌리고"], ["CHOOSE", "지금 필요한지 다시 선택합니다."]].map(([title, meaning], index) => <li key={title}><p className="eyebrow">0{index + 1}</p><h3>{title}</h3><p>{meaning}</p></li>)}</ol><div className="voluntary-prayer"><Puzz /><div><h3>SNS를 열지 않아도,<span className="mobile-break"><br /></span><span className="desktop-space"> </span>원할 때 기도할 수 있습니다.</h3><p>목표는 많이 기도하는 횟수보다,<br className="desktop-space" /> 내가 왜 사용하는지 알고 선택하는 순간입니다.</p></div></div></div></section>;
}

function BetaSignup() {
  return <section className="landing-section beta-section light-section" id="beta-signup" aria-labelledby="signup-heading"><div className="container"><div className="section-rule" /><div className="beta-layout"><div className="content-stack beta-context"><p className="eyebrow">EARLY ACCESS</p><h2 id="signup-heading" tabIndex={-1}>PrayTime<br />베타 사전신청</h2><p className="body-copy">참여 안내를 받을 정보를 남겨주세요.</p><p className="small-copy">SNS·숏폼 사용 조절이 어려운<br />20~60대 성인 개신교인을 위한 베타입니다.</p><p className="small-copy">사전신청은 즉시 이용이나<br />베타 참여 확정을 의미하지 않습니다.</p></div><BetaSignupForm /></div></div></section>;
}

function LandingFooter() {
  return <footer className="site-footer light-section"><div className="container"><div className="section-rule" /><div className="footer-brand"><Wordmark /><a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer">개인정보처리방침</a></div><p className="eyebrow">PAUSE · PRAY · CHOOSE</p></div></footer>;
}

export default function LandingPage() {
  return <><AnchorLink className="skip-link" href="#how-it-works">본문으로 건너뛰기</AnchorLink><main><Hero /><OneQuestion /><WhyNow /><TheGap /><TimeSelect /><PrayerBeforeChoice /><FAQ /><BetaSignup /></main><LandingFooter /></>;
}
