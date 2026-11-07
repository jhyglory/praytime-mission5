import { BetaSignupForm } from "@/components/landing/beta-signup-form";

export function BetaSignupSection() {
  return <section className="landing-section beta-section light-section" id="beta-signup" aria-labelledby="signup-heading"><div className="container"><div className="section-rule" /><div className="beta-layout"><div className="content-stack beta-context"><p className="eyebrow">EARLY ACCESS</p><h2 id="signup-heading" tabIndex={-1}>PrayTime<br />베타 사전예약</h2><p className="body-copy">베타 테스트 일정이 정해지면<br />신청하신 이메일로 참여 방법을 안내드립니다.</p><p className="small-copy">SNS 사용을 조절하고 싶은<br />20~60대 성인 개신교인을 위한 베타입니다.</p><p className="small-copy">사전예약은 즉시 이용이나<br />베타 참여 확정을 의미하지 않습니다.</p></div><BetaSignupForm /></div></div></section>;
}
