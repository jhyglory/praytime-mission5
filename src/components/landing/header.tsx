import { Button } from "@/components/ui/button";
import { AnchorLink } from "@/components/landing/anchor-link";
import { ActiveSectionNav } from "@/components/landing/active-section-nav";

export function Wordmark() {
  return <a href="#hero" className="wordmark" aria-label="PrayTime 처음으로"><span className="solid-pause" aria-hidden="true"><i /><i /></span><span>PRAYTIME</span></a>;
}

export function Header() {
  return <header className="landing-header" data-figma-node="1209:527 / 1209:1299"><Wordmark /><ActiveSectionNav /><Button asChild><AnchorLink href="#beta-signup">무료로 신청하기</AnchorLink></Button></header>;
}
