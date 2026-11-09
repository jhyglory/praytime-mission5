import { ActiveSectionNav } from "@/components/landing/active-section-nav";

export function Wordmark() {
  return (
    <a href="#hero" className="wordmark" aria-label="PrayTime 처음으로">
      <span className="solid-pause" aria-hidden="true">
        <i />
        <i />
      </span>
      <span>PRAYTIME</span>
    </a>
  );
}

export function Header() {
  return (
    <header
      className="landing-header absolute z-2 top-0 left-1/2 grid h-18 w-[calc(100%_-_48px)] grid-cols-1 items-center justify-between gap-6 text-[#f1f1ee] md:h-22 md:w-[calc(100%_-_64px)] md:grid-cols-[168.5px_minmax(0,1fr)_160px] lg:w-[min(1280px,calc(100%_-_160px))] lg:grid-cols-[168.5px_minmax(0,1fr)_196px] max-[375px]:gap-3"
      data-figma-node="1209:527 / 1209:1299"
    >
      <Wordmark />
      <ActiveSectionNav />
    </header>
  );
}
