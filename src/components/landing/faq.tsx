"use client";

/* eslint-disable @next/next/no-img-element -- Exact Figma 24px toggle icon. */
import { useState } from "react";

const items = [
  ["일반 기도 앱과 무엇이 다른가요?", "PrayTime의 중심은 SNS를 실행하려는 순간 기도하고, 지금도 필요한 사용인지 다시 선택하는 흐름입니다. SNS 실행 외에도 원할 때 직접 기도를 시작할 수 있습니다."],
  ["기도를 마치면 SNS가 바로 열리나요?", "자동으로 열리지 않습니다. 필요하지 않으면 돌아가고, 필요하면 5 · 10 · 15분 중 사용할 시간을 선택합니다."],
  ["SNS를 완전히 끊어야 하나요?", "필요한 사용은 이어갈 수 있습니다. 기도 후 사용 필요성을 다시 확인하고, 필요한 시간을 정해 이용합니다."],
  ["정한 시간이 끝나도 더 사용해야 하면 어떻게 하나요?", "선택한 시간이 끝나면 다시 제한됩니다. 추가 사용이 필요하면 다시 기도한 뒤, 사용할지와 필요한 시간을 다시 선택합니다."],
  ["누가 베타 사전신청을 할 수 있나요?", "SNS·숏폼 사용 조절에 어려움을 겪는 20~60대 성인 개신교인을 대상으로 합니다. 사전신청은 즉시 이용이나 Beta 참여 확정을 의미하지 않습니다."],
] as const;

export function FAQ() {
  const [open, setOpen] = useState<boolean[]>(items.map((_, index) => index === 0));
  return (
    <section className="landing-section" id="faq" aria-labelledby="faq-heading" data-figma-node="935:310 / 935:601">
      <div className="container"><div className="section-rule" /><div className="faq-layout"><div className="content-stack faq-heading"><p className="eyebrow">QUESTIONS, ANSWERED</p><h2 id="faq-heading" tabIndex={-1}>궁금한 점을<br />먼저 확인하세요.</h2></div>
        <div className="faq-list">
          {items.map(([question, answer], index) => (
            <div className="faq-item" key={question}>
              <h3><button id={`faq-question-${index}`} type="button" aria-expanded={open[index]} aria-controls={`faq-answer-${index}`} onClick={() => setOpen(current => current.map((value, i) => i === index ? !value : value))}>
                <span>{question}</span><img src={open[index] ? "/assets/toggle-final-open.svg" : "/assets/toggle-final-closed.svg"} alt="" width="24" height="24" className="faq-icon" />
              </button></h3>
              <div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} hidden={!open[index]}><p className="body-copy">{answer}</p></div>
            </div>
          ))}
        </div></div>
      </div>
    </section>
  );
}
