/* eslint-disable @next/next/no-img-element -- Exact responsive Figma companion layers. */
import { PrayerSteps } from "@/components/landing/prayer-steps";

function PrayerCompanion() {
  return <div className="voluntary-companion" aria-hidden="true"><div className="voluntary-companion__art"><picture className="voluntary-companion__ground"><source media="(width < 768px)" srcSet="/assets/whole-page/prayer-mobile-ground.svg" width="64" height="15.5" /><img src="/assets/puzz-ground-final.svg" width="80" height="19.375" alt="" /></picture><picture className="voluntary-companion__shadow"><source media="(width < 768px)" srcSet="/assets/whole-page/prayer-mobile-shadow.svg" width="40" height="6.5" /><img src="/assets/puzz-shadow-final.svg" width="50" height="8.125" alt="" /></picture><img className="voluntary-companion__body" src="/assets/puzz-final.png" width="160" height="160" alt="" /></div></div>;
}

export function VoluntaryPrayerSection() {
  return <section className="prayer-section" id="prayer-choice" aria-labelledby="prayer-heading" data-figma-node="1209:657 / 1209:1191"><div className="container prayer-editorial"><div className="prayer-heading"><div className="content-stack"><p className="eyebrow">MAKE ROOM FOR PRAYER</p><h2 id="prayer-heading" tabIndex={-1}>선택 앞에,<br />잠깐 기도.</h2></div><p className="prayer-statement">잠깐 멈추고, 하나님께 시선을 돌리고,<br />지금 필요한지 다시 살펴봅니다.</p></div><PrayerSteps /><div className="voluntary-prayer"><PrayerCompanion /><div><h3>SNS를 열지 않아도,<span className="mobile-break"><br /></span><span className="desktop-space"> </span>원할 때 기도할 수 있습니다.</h3><p>목표는 많이 기도하는 횟수보다,<br />내가 왜 사용하는지 알고 선택하는 순간입니다.</p></div></div></div></section>;
}
