/* eslint-disable @next/next/no-img-element -- Exact Figma choice arrow exports. */
import { AnchorLink } from "@/components/landing/anchor-link";
import { GapLightDivider } from "@/components/landing/gap-light-divider";
import { GapLightMotion } from "@/components/motion/gap-light-motion";

export function GapSection() {
  return (
    <section
      className="landing-section section-depth gap-section bg-navy text-center px-0 pt-[46px] pb-[65px] md:pt-16 md:pb-21"
      id="the-gap"
      aria-labelledby="gap-heading"
    >
      <div className="gap-architecture" aria-hidden="true">
        <GapLightMotion
          variant="preview"
          startDelayMs={1200}
          visibilityThreshold={0.2}
        />
      </div>
      <div className="container section-stack flex flex-col gap-12">
        <h2 id="gap-heading" tabIndex={-1}>
          기도하는 잠깐 사이,
          <br />
          SNS를 쓸지 다시 선택합니다.
        </h2>
        <p className="body-copy text-muted-foreground text-base leading-[26px] font-normal md:text-lg md:leading-[30px]">
          설정한 SNS를 열 때, PrayTime이 먼저 멈춰줍니다.
          <br />
          기도 후, 돌아가거나 사용할 시간을 고르세요.
        </p>
        <div className="equal-outcomes grid w-full grid-cols-1 gap-2 text-center pt-0 mt-20 md:grid-cols-2 md:gap-8 md:mt-28">
          <div>
            <GapLightDivider variant="choice" />
            <AnchorLink
              className="gap-choice gap-choice--return"
              href="#hero"
              aria-labelledby="gap-return-title"
              aria-describedby="gap-return-context"
            >
              <p id="gap-return-context">필요하지 않다면</p>
              <div className="gap-choice__action flex items-center justify-center gap-3 md:gap-4">
                <h3 id="gap-return-title">지금은 돌아가기</h3>
                <img
                  src="/assets/choice-left-arrow.svg"
                  width="24"
                  height="24"
                  alt=""
                />
              </div>
            </AnchorLink>
          </div>
          <div>
            <GapLightDivider variant="choice" />
            <AnchorLink
              className="gap-choice gap-choice--time"
              href="#how-it-works"
              aria-labelledby="gap-time-title"
              aria-describedby="gap-time-context"
            >
              <p id="gap-time-context">필요하다면</p>
              <div className="gap-choice__action flex items-center justify-center gap-3 md:gap-4">
                <h3 id="gap-time-title">5 · 10 · 15분 선택</h3>
                <img
                  src="/assets/choice-right-arrow.svg"
                  width="24"
                  height="24"
                  alt=""
                />
              </div>
            </AnchorLink>
          </div>
        </div>
      </div>
    </section>
  );
}
