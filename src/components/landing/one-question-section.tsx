/* eslint-disable @next/next/no-img-element -- Continue the exact Hero raster crop across the section boundary. */
export function OneQuestionSection() {
  return <section className="one-question" aria-labelledby="question-heading">
    <div className="question-artwork" aria-hidden="true"><img src="/assets/landing-continuous-hero.png" alt="" width="1562" height="2436" /></div>
    <div className="question-legibility" aria-hidden="true" />
    <div className="container content-stack"><p className="eyebrow">BEFORE YOU OPEN</p><h2 id="question-heading">지금 이 앱이<br />꼭 필요한가요?</h2><p className="body-copy">열기 전에, 필요한 사용인지 한 번 더 확인합니다.</p></div>
  </section>;
}
