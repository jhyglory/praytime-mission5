import { Wordmark } from "@/components/landing/header";
import { PRIVACY_POLICY_URL } from "@/lib/privacy-policy";

export function Footer() {
  return (
    <footer className="site-footer pb-8 [word-break:normal] [overflow-wrap:anywhere] light-section">
      <div className="container">
        <div className="section-rule h-px bg-border" />
        <div className="footer-brand flex flex-col items-start justify-between gap-6 pt-6 mb-6 md:flex-row md:items-center">
          <Wordmark />
          <a
            href={PRIVACY_POLICY_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            개인정보처리방침
          </a>
        </div>
        <p className="eyebrow text-muted-foreground font-sans text-xs leading-5 font-normal tracking-[1.2px]">
          PAUSE · PRAY · CHOOSE
        </p>
      </div>
    </footer>
  );
}
