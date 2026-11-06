import { ActiveSectionNav } from "@/components/landing/active-section-nav";

export function Wordmark() {
  return <a href="#hero" className="wordmark" aria-label="PrayTime 처음으로"><span className="solid-pause" aria-hidden="true"><i /><i /></span><span>PRAYTIME</span></a>;
}

export function Header() {
  return <header className="landing-header" data-figma-node="1209:527 / 1209:1299"><Wordmark /><ActiveSectionNav /></header>;
}
