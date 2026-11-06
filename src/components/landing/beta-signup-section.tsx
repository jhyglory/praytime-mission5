import { BetaSignupForm } from "@/components/landing/beta-signup-form";

export function BetaSignupSection() {
  return <section className="landing-section beta-section light-section" id="beta-signup" aria-labelledby="signup-heading"><div className="container"><div className="section-rule" /><div className="beta-layout"><div className="content-stack beta-context"><p className="eyebrow">EARLY ACCESS</p><h2 id="signup-heading" tabIndex={-1}>PrayTime<br />베타 사전신청</h2><p className="body-copy">참여 안내를 받을 정보를 남겨주세요.</p><p className="small-copy">SNS·숏폼 사용 조절이 어려운<br />20~60대 성인 개신교인을 위한 베타입니다.</p><p className="small-copy">사전신청은 즉시 이용이나<br />베타 참여 확정을 의미하지 않습니다.</p></div><BetaSignupForm /></div></div></section>;
}
