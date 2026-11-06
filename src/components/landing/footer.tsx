import { Wordmark } from "@/components/landing/header";
import { PRIVACY_POLICY_URL } from "@/lib/privacy-policy";

export function Footer() {
  return <footer className="site-footer light-section"><div className="container"><div className="section-rule" /><div className="footer-brand"><Wordmark /><a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer">개인정보처리방침</a></div><p className="eyebrow">PAUSE · PRAY · CHOOSE</p></div></footer>;
}
