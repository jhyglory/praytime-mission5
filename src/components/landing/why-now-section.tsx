import { WhyNowCountUp } from "@/components/landing/why-now-count-up";

// Decorative accent lengths are independent of the factual statistic values.
export function WhyNowSection() {
  return (
    <section
      className="why-now relative isolate bg-paper px-0 pt-18 pb-16 md:pt-22 light-section"
      aria-labelledby="why-heading"
    >
      <div className="why-content flex max-w-275 flex-col items-center gap-10 text-center text-[#18181b] md:gap-12 container">
        <p className="why-eyebrow text-[11px] leading-[18px] font-normal tracking-[1.5px] text-signal md:text-[13px] md:leading-5 md:font-bold md:tracking-normal">
          WHY NOW
        </p>
        <h2 id="why-heading">
          줄이고 싶다는 마음이
          <br />
          실제 선택으로 이어지도록,
          <br />
          열기 전에 멈춥니다.
        </h2>
        <div
          className="stats-grid grid grid-cols-1 gap-[14px] w-[min(1068px,100%)] text-left mt-[41px] md:grid-cols-2 md:gap-7 md:mt-[49px]"
          id="why-stats"
          data-count-state="pending"
          data-count-runs="0"
        >
          {[
            { age: "20대", rate: 34.3 },
            { age: "30대", rate: 25.3 },
          ].map(({ age, rate }) => (
            <div
              className="stat-card flex min-w-0 flex-col gap-1.5 rounded-3xl bg-white p-6 md:block md:flex-row md:gap-[normal] md:pt-[22px] md:pb-[31px] md:px-8 lg:px-12"
              key={age}
            >
              <p className="stat-age block text-sm leading-5 font-medium text-[rgb(24_24_27/78%)] md:hidden md:text-base md:leading-[26px] md:font-normal md:text-inherit">
                {age}
              </p>
              <p className="stat-value text-[#18181b] text-[48px] leading-[58px] font-bold md:text-[64px] md:leading-[92px] lg:text-[76px]">
                <span className="sr-only">{rate}%</span>
                <span data-stat-number data-rate={rate} aria-hidden="true">
                  {rate}%
                </span>
              </p>
              <p className="stat-caption m-0 text-[13px] leading-5 font-normal text-[#515660] md:mt-2 md:text-base md:leading-[30px] md:font-bold md:text-inherit lg:text-xl">
                <span className="stat-caption-age">{age} </span>스마트폰 과의존
                위험군
              </p>
              <div
                className="stat-track w-full max-w-none h-1.5 m-0 rounded-[2px] bg-transparent overflow-hidden md:mt-[25px]"
                aria-hidden="true"
              >
                <div className="stat-fill w-4/5 h-full rounded-[2px] bg-signal" />
              </div>
            </div>
          ))}
        </div>
        <WhyNowCountUp />
        <p className="why-support">
          <span className="desktop-source">
            사용을 줄이려는 마음이 있어도
            <br />
            익숙한 행동은 생각보다 먼저 시작됩니다.
          </span>
          <span className="mobile-source">
            사용을 줄이려는
            <br />
            마음이 있어도 익숙한 행동은
            <br />
            생각보다 먼저 시작됩니다.
          </span>
        </p>
        <p className="stat-source text-[#696a70] text-xs leading-6 opacity-100 md:leading-5">
          <span className="desktop-source">
            출처: 한국지능정보사회진흥원, 「2025년 스마트폰 과의존 실태조사」,
            p.40, 표 3-1-3
          </span>
          <span className="mobile-source">
            출처: 한국지능정보사회진흥원(NIA)
            <br />
            2025년 스마트폰 과의존 실태조사, p.40, 표 3-1-3.
          </span>
        </p>
      </div>
    </section>
  );
}
