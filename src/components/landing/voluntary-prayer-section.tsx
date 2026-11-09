/* eslint-disable @next/next/no-img-element -- Exact responsive Figma companion layers. */
import { PrayerSteps } from "@/components/landing/prayer-steps";

function PrayerCompanion() {
  return (
    <div className="voluntary-companion" aria-hidden="true">
      <div className="voluntary-companion__art">
        <picture className="voluntary-companion__ground">
          <source
            media="(width < 768px)"
            srcSet="/assets/whole-page/prayer-mobile-ground.svg"
            width="64"
            height="15.5"
          />
          <img
            src="/assets/puzz-ground-final.svg"
            width="80"
            height="19.375"
            alt=""
          />
        </picture>
        <picture className="voluntary-companion__shadow">
          <source
            media="(width < 768px)"
            srcSet="/assets/whole-page/prayer-mobile-shadow.svg"
            width="40"
            height="6.5"
          />
          <img
            src="/assets/puzz-shadow-final.svg"
            width="50"
            height="8.125"
            alt=""
          />
        </picture>
        <img
          className="voluntary-companion__body"
          src="/assets/puzz-final.png"
          width="160"
          height="160"
          alt=""
        />
      </div>
    </div>
  );
}

export function VoluntaryPrayerSection() {
  return (
    <section
      className="prayer-section bg-background text-foreground [color-scheme:dark] px-0 py-20 [word-break:normal] [overflow-wrap:anywhere] md:py-26"
      id="prayer-choice"
      aria-labelledby="prayer-heading"
      data-figma-node="1209:657 / 1209:1191"
    >
      <div className="container prayer-editorial flex flex-col gap-10 md:gap-16">
        <div className="prayer-heading flex flex-col grid-cols-[minmax(0,520fr)_minmax(0,600fr)] gap-7 md:flex-row md:grid md:grid-cols-[minmax(0,520fr)_minmax(0,600fr)] md:gap-10 lg:gap-20">
          <div className="content-stack flex flex-col gap-6">
            <p className="eyebrow text-muted-foreground font-sans text-xs leading-5 font-normal tracking-[1.2px]">
              MAKE ROOM FOR PRAYER
            </p>
            <h2 id="prayer-heading" tabIndex={-1}>
              멈추고, 기도하고,
              <br />
              다시 선택합니다.
            </h2>
          </div>
          <p className="prayer-statement text-lg leading-[30px] font-normal text-muted-foreground md:text-[28px] md:leading-10 md:font-medium">
            무심코 사용하던 순간에
            <br />
            기도하고 생각할 시간을 더합니다.
          </p>
        </div>
        <PrayerSteps />
        <div className="voluntary-prayer flex items-center gap-5 md:gap-8">
          <PrayerCompanion />
          <div>
            <h3>
              SNS를 열지 않아도,
              <span className="mobile-break">
                <br />
              </span>
              <span className="desktop-space"> </span>원할 때 기도할 수
              있습니다.
            </h3>
            <p>
              기도하고 싶을 때 PrayTime을 직접 열어보세요.
              <br className="desktop-source" /> 나의 기도나 기도 가이드로 시작할
              수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
