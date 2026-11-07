/* eslint-disable @next/next/no-img-element -- Continue the same user-supplied Hero plane across the section boundary. */
"use client";

import { useEffect, useRef } from "react";

export function OneQuestionSection() {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const element = heading.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let scrolled = window.scrollY > 0;
    let inView = false;
    let shown = false;
    let observer: IntersectionObserver | undefined;
    const reveal = () => {
      if (shown) return;
      shown = true;
      element.dataset.questionReveal = "shown";
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => {
      if (window.scrollY > 0) scrolled = true;
      if (scrolled && inView) reveal();
    };
    const onReduced = () => { if (reduced.matches) reveal(); };
    if (reduced.matches || typeof IntersectionObserver === "undefined") reveal();
    else {
      observer = new IntersectionObserver(entries => {
        inView = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .15);
        if (scrolled && inView) reveal();
      }, { threshold:.15 });
      observer.observe(element);
      window.addEventListener("scroll", onScroll, { passive:true });
    }
    reduced.addEventListener("change", onReduced);
    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      reduced.removeEventListener("change", onReduced);
    };
  }, []);

  return <section className="one-question" aria-labelledby="question-heading" data-figma-node="1209:535 / 1209:1067">
    <div className="question-artwork" aria-hidden="true"><img src="/assets/high-resolution/hero-hq-fcbad7e4f361.png" alt="" width="1672" height="941" /></div>
    <div className="question-legibility" aria-hidden="true" />
    <div className="container content-stack"><h2 ref={heading} id="question-heading" data-question-reveal="pending" data-question-delay="1200" data-question-fade="800"><span data-question-part="lead">무심코 켠 SNS,</span><span data-question-part="followup">무엇을 하려고 열었는지 기억하시나요?</span></h2></div>
  </section>;
}
