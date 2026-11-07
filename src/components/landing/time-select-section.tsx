import { TimeSelectPreview } from "@/components/landing/time-select-preview";

export function TimeSelectSection() {
  return <section className="time-section light-section" id="how-it-works" aria-labelledby="how-heading"><div className="time-layout container"><div className="content-stack time-story"><p className="eyebrow">PRAY · THEN CHOOSE</p><h2 id="how-heading" tabIndex={-1}>기도 후에,<br />지금 쓸지 선택하세요.</h2><p className="body-copy">필요하지 않다면 지금은 돌아가세요.<br />필요하다면 5·10·15분 중 사용할 시간을 고르세요.</p><p className="time-reminder desktop-reminder">정한 시간이 끝나면 SNS 사용이 다시 제한됩니다.<br />더 사용하려면 다시 기도하고 선택합니다.</p></div><TimeSelectPreview /><p className="time-reminder mobile-reminder">정한 시간이 끝나면 SNS 사용이 다시 제한됩니다.<br />더 사용하려면 다시 기도하고 선택합니다.</p></div></section>;
}
