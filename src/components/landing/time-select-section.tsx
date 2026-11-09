import { TimeSelectPreview } from "@/components/landing/time-select-preview";

export function TimeSelectSection() {
  return (
    <section
      className="time-section bg-background text-foreground px-0 pt-18 pb-16 [word-break:normal] [overflow-wrap:anywhere] md:py-26 light-section"
      id="how-it-works"
      aria-labelledby="how-heading"
    >
      <div className="time-layout grid w-[calc(100%_-_48px)] grid-cols-1 gap-10 items-center md:w-[min(1034px,calc(100%_-_64px))] md:grid-cols-[minmax(0,1fr)_300px] md:gap-12 lg:grid-cols-[minmax(0,560px)_330px] lg:gap-36 container">
        <div className="content-stack flex flex-col time-story gap-8">
          <p className="eyebrow text-muted-foreground font-sans text-xs leading-5 font-normal tracking-[1.2px]">
            PRAY · THEN CHOOSE
          </p>
          <h2 id="how-heading" tabIndex={-1}>
            기도 후에,
            <br />
            지금 쓸지 선택하세요.
          </h2>
          <p className="body-copy text-muted-foreground text-base leading-[26px] font-normal md:text-lg md:leading-[30px]">
            필요하지 않다면 지금은 돌아가세요.
            <br />
            필요하다면 5·10·15분 중 사용할 시간을 고르세요.
          </p>
          <p className="time-reminder text-base leading-[26px] text-muted-foreground desktop-reminder hidden md:block">
            정한 시간이 끝나면 SNS 사용이 다시 제한됩니다.
            <br />더 사용하려면 다시 기도하고 선택합니다.
          </p>
        </div>
        <TimeSelectPreview />
        <p className="time-reminder text-muted-foreground mobile-reminder block text-[13px] leading-[21px] -mt-[22px] md:hidden md:text-base md:leading-[26px] md:mt-0">
          정한 시간이 끝나면 SNS 사용이 다시 제한됩니다.
          <br />더 사용하려면 다시 기도하고 선택합니다.
        </p>
      </div>
    </section>
  );
}
