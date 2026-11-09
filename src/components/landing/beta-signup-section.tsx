import { BetaSignupForm } from "@/components/landing/beta-signup-form";

export function BetaSignupSection() {
  return (
    <section
      className="landing-section beta-section px-0 py-16 md:pt-20 md:pb-24 light-section"
      id="beta-signup"
      aria-labelledby="signup-heading"
    >
      <div className="container">
        <div className="section-rule h-px bg-border" />
        <div className="beta-layout grid grid-cols-1 gap-8 [align-items:start] md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10 lg:grid-cols-[minmax(0,360fr)_minmax(0,744fr)] lg:gap-24">
          <div className="content-stack flex flex-col gap-6 beta-context">
            <p className="eyebrow text-muted-foreground font-sans text-xs leading-5 font-normal tracking-[1.2px]">
              EARLY ACCESS
            </p>
            <h2 id="signup-heading" tabIndex={-1}>
              PrayTime
              <br />
              베타 사전예약
            </h2>
            <p className="body-copy text-muted-foreground text-base leading-[26px] font-normal md:text-lg md:leading-[30px]">
              베타 테스트 일정이 정해지면
              <br />
              신청하신 이메일로 참여 방법을 안내드립니다.
            </p>
            <p className="small-copy text-muted-foreground text-sm leading-[22px] font-normal">
              SNS 사용을 조절하고 싶은
              <br />
              20~60대 성인 개신교인을 위한 베타입니다.
            </p>
            <p className="small-copy text-muted-foreground text-sm leading-[22px] font-normal">
              사전예약은 즉시 이용이나
              <br />
              베타 참여 확정을 의미하지 않습니다.
            </p>
          </div>
          <BetaSignupForm />
        </div>
      </div>
    </section>
  );
}
