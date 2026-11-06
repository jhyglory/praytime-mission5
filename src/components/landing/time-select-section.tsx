import { TimeSelectPreview } from "@/components/landing/time-select-preview";

export function TimeSelectSection() {
  return <section className="time-section light-section" id="how-it-works" aria-labelledby="how-heading"><div className="time-layout container"><div className="content-stack time-story"><p className="eyebrow">PRAY · THEN CHOOSE</p><h2 id="how-heading" tabIndex={-1}>기도 후에도,<br />선택은 나에게.</h2><p className="body-copy">기도를 마쳐도 SNS가 자동으로 열리지 않습니다.<br />지금 필요한지 다시 보고,<span className="mobile-break"><br /></span><span className="desktop-space"> </span>필요하다면 사용할 시간을 직접 정합니다.</p><p className="time-reminder desktop-reminder">정한 시간이 끝나면 다시 제한되고,<br />더 사용하려면 다시 기도하고 선택합니다.</p></div><TimeSelectPreview /><p className="time-reminder mobile-reminder">정한 시간이 끝나면 다시 제한되고,<br />더 사용하려면 다시 기도하고 선택합니다.</p></div></section>;
}
