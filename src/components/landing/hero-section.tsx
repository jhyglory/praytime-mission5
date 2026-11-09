/* Use the user-supplied high-resolution artwork without stretching it. */
import { Button } from "@/components/ui/button";
import { AnchorLink } from "@/components/landing/anchor-link";
import { Header } from "@/components/landing/header";

export function HeroSection() {
  return (
    <section
      className="hero relative block h-auto min-h-233 w-full overflow-clip bg-ink p-0 flex-col gap-10 md:gap-16 md:h-171 md:min-h-0"
      id="hero"
      aria-labelledby="hero-heading"
      data-figma-node="1209:515 / 1209:1052"
    >
      <picture className="hero-artwork">
        <img
          src="/assets/high-resolution/hero-hq-fcbad7e4f361.png"
          alt=""
          width="1672"
          height="941"
          fetchPriority="high"
        />
      </picture>
      <div className="hero-legibility" aria-hidden="true" />
      <div className="hero-top-blend" aria-hidden="true" />
      <Header />
      <div className="hero-content relative flex min-w-0 flex-col gap-6 w-[calc(100%_-_48px)] ml-6 pt-26 pb-12 md:w-[min(620px,calc(100%_-_48px))] md:pt-[150px] md:pb-0 md:ml-[max(5vw,calc((100vw_-_1440px)/2_+_72px))] md:max-lg:ml-8 md:max-lg:max-w-145">
        <div className="hero-editorial flex min-w-0 flex-col gap-6 min-h-88 md:min-h-auto">
          <p className="eyebrow text-muted-foreground font-sans text-xs leading-5 font-normal tracking-[1.2px]">
            기독교인을 위한 SNS 사용 관리 앱
          </p>
          <h1 id="hero-heading" tabIndex={-1}>
            SNS를 열기 전,
            <br />
            잠깐, 기도부터.
          </h1>
          <p className="body-copy text-muted-foreground text-base leading-[26px] font-normal md:text-lg md:leading-[30px]">
            기도 후, 돌아가거나 필요한 시간을 고르세요.
            <br />
            5·10·15분 사용 후에는 다시 제한됩니다.
          </p>
        </div>
        <div className="hero-artwork-interval" aria-hidden="true" />
        <div className="hero-actions flex flex-col gap-3 lg:flex-row">
          <Button asChild>
            <AnchorLink href="#beta-signup">무료 사전예약하기</AnchorLink>
          </Button>
          <Button asChild variant="secondary">
            <AnchorLink href="#the-gap">작동 방식 보기</AnchorLink>
          </Button>
        </div>
        <p className="small-copy text-muted-foreground text-sm leading-[22px] font-normal">
          사전예약 무료 · 베타 일정 확정 후 이메일 안내
        </p>
      </div>
    </section>
  );
}
