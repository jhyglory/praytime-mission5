"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const items = [
  {
    question: "PrayTime은 그냥 기도 앱인가요?",
    answer: [
      "아니요. PrayTime은 SNS를 무심코 열려는 순간 잠시 멈추고 기도한 뒤, 지금 이 앱이 정말 필요한지 다시 선택하도록 돕는 기독교 기반 디지털 웰니스 앱입니다.",
      "필요하지 않다면 돌아가고, 필요하다면 사용할 시간을 직접 정할 수 있습니다.",
    ],
  },
  {
    question: "PrayTime은 어떻게 작동하나요?",
    answer: [
      "SNS를 열려고 하면 PrayTime이 먼저 개입합니다.",
      "잠시 멈추고 기도한 뒤, 지금도 이 앱이 필요한지 다시 확인합니다.",
      "필요하지 않다면 그대로 돌아가고, 필요하다면 5분 · 10분 · 15분 중 필요한 시간을 선택합니다.",
      "선택한 시간이 끝나면 SNS는 다시 제한되며, 더 사용하려면 다시 기도하고 선택하는 과정을 거칩니다.",
      "또 SNS 사용과 관계없이 기도가 필요할 때 PrayTime을 직접 열어 기도할 수도 있습니다.",
    ],
  },
  {
    question: "SNS를 아예 못 쓰게 하는 앱인가요?",
    answer: [
      "아닙니다.",
      "PrayTime의 목표는 SNS를 완전히 끊는 것이 아니라, 무심코 사용하는 흐름을 멈추고 필요한 만큼만 의식적으로 사용하는 것입니다.",
      "지금 필요하지 않다면 돌아가고, 필요하다면 직접 시간을 정해 사용할 수 있습니다.",
    ],
  },
  {
    question: "기도를 오래 해야 하나요?",
    answer: [
      "아니요.",
      "PrayTime의 기도는 길게 해야 하는 과제가 아니라, SNS를 열기 전 잠시 멈추고 내 의도와 마음을 돌아보기 위한 작은 Pause입니다.",
      "기도의 길이보다 중요한 것은 자동적으로 행동하기 전에 한 번 멈추는 것입니다.",
    ],
  },
  {
    question: "기도를 끝내면 바로 SNS가 열리나요?",
    answer: [
      "아니요.",
      "기도를 마쳤다고 SNS가 자동으로 열리지는 않습니다.",
      "먼저 “지금 이 앱이 꼭 필요한가요?”를 다시 확인하고, 필요하다면 5분 · 10분 · 15분 중 사용할 시간을 직접 선택합니다.",
      "시간이 끝나면 다시 제한됩니다.",
    ],
  },
  {
    question: "제 기도 내용을 저장하나요?",
    answer: [
      "PrayTime은 기도 원문을 기본적으로 수집하지 않는 방향으로 설계하고 있습니다.",
      "서비스 운영과 기능 제공에 필요한 정보만 최소한으로 다루며, 실제로 수집·저장되는 항목은 개인정보처리방침을 통해 명확하게 안내합니다.",
    ],
  },
  {
    question: "사전 신청은 무료인가요?",
    answer: [
      "네. PrayTime 베타 사전 신청에는 결제가 발생하지 않습니다.",
      "베타 테스트 일정이 확정되면 신청자에게 우선적으로 안내드릴 예정입니다.",
    ],
  },
] as const;

export function FaqSection() {
  const [open, setOpen] = useState<string[]>(["faq-0"]);
  return (
    <section className="landing-section" id="faq" aria-labelledby="faq-heading" data-figma-node="1088:1070 / 1088:1402">
      <div className="container"><div className="section-rule" /><div className="faq-layout"><div className="content-stack faq-heading"><p className="eyebrow">QUESTIONS, ANSWERED</p><h2 id="faq-heading" tabIndex={-1}>궁금한 점을<br />먼저 확인하세요.</h2></div>
        <Accordion className="faq-list" type="multiple" value={open} onValueChange={setOpen}>
          {items.map(({ question, answer }, index) => (
            <AccordionItem className="faq-item" key={question} value={`faq-${index}`}>
              <AccordionTrigger id={`faq-question-${index}`} aria-controls={`faq-answer-${index}`}>
                <span>{question}</span>
              </AccordionTrigger>
              <AccordionContent forceMount id={`faq-answer-${index}`} aria-labelledby={`faq-question-${index}`} hidden={!open.includes(`faq-${index}`)}>{answer.map(paragraph => <p className="body-copy" key={paragraph}>{paragraph}</p>)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion></div>
      </div>
    </section>
  );
}
