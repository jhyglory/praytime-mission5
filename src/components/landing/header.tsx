import { Button } from "@/components/ui/button";
import { AnchorLink } from "@/components/landing/anchor-link";

export function Wordmark() {
  return <a href="#hero" className="wordmark" aria-label="PrayTime 처음으로"><span className="solid-pause" aria-hidden="true"><i /><i /></span><span>PRAYTIME</span></a>;
}

export function Header() {
  return <header className="landing-header"><Wordmark /><nav aria-label="주요 메뉴"><AnchorLink href="#how-it-works">작동 방식</AnchorLink><AnchorLink href="#prayer-choice">기도와 선택</AnchorLink><AnchorLink href="#faq">FAQ</AnchorLink></nav><Button asChild><AnchorLink href="#beta-signup">베타 사전신청</AnchorLink></Button></header>;
}
