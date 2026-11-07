import { WhyNowCountUp } from "@/components/landing/why-now-count-up";

// Decorative accent lengths are independent of the factual statistic values.
export function WhyNowSection() {
  return <section className="why-now light-section" aria-labelledby="why-heading"><div className="why-content container">
    <p className="why-eyebrow">WHY NOW</p><h2 id="why-heading">우리가 필요한 건<br />더 강한 의지가 아니라,<br />멈출 지점입니다.</h2>
    <div className="stats-grid" id="why-stats" data-count-state="pending" data-count-runs="0">{[{ age: "20대", rate: 34.3 }, { age: "30대", rate: 25.3 }].map(({ age, rate }) => <div className="stat-card" key={age}><p className="stat-age">{age}</p><p className="stat-value"><span className="sr-only">{rate}%</span><span data-stat-number data-rate={rate} aria-hidden="true">{rate}%</span></p><p className="stat-caption"><span className="stat-caption-age">{age} </span>스마트폰 과의존 위험군</p><div className="stat-track" aria-hidden="true"><div className="stat-fill" /></div></div>)}</div>
    <WhyNowCountUp />
    <p className="why-support"><span className="desktop-source">스마트폰 사용을 줄이려는 마음이 있어도<br />익숙한 행동은 생각보다 빠르게 반복됩니다.</span><span className="mobile-source">스마트폰 사용을 줄이려는<br />마음이 있어도 익숙한 행동은<br />생각보다 빠르게 반복됩니다.</span></p>
    <p className="stat-source"><span className="desktop-source">출처: 한국지능정보사회진흥원, 「2025년 스마트폰 과의존 실태조사」, p.40, 표 3-1-3</span><span className="mobile-source">출처: 한국지능정보사회진흥원(NIA)<br />2025년 스마트폰 과의존 실태조사, p.40, 표 3-1-3.</span></p>
  </div></section>;
}
