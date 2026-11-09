"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaqAnswer } from "@/components/landing/faq-answer";

const items = [
  {
    question: "PrayTime은 어떤 앱인가요?",
    answer: [
      "SNS를 열기 전 잠깐 기도하고, 지금 사용할지 다시 선택하도록 돕는 앱입니다. 기독교인을 위한 SNS 사용 관리와 기도 기능을 함께 제공합니다.",
    ],
  },
  {
    question: "어떻게 작동하나요?",
    answer: [
      "관리할 앱과 시간대를 설정합니다. 해당 앱을 열면 잠깐 멈춰 기도한 뒤, 지금은 돌아가거나 5·10·15분 중 사용할 시간을 고릅니다. 시간이 끝나면 다시 제한되고, 더 사용하려면 다시 기도하고 선택합니다.",
    ],
  },
  {
    question: "필요할 때는 SNS를 사용할 수 있나요?",
    answer: [
      "네. 기도 후에도 사용이 필요하다면 5·10·15분 중 직접 시간을 정해 사용할 수 있습니다. 지금 필요하지 않다면 사용하지 않고 돌아갈 수 있습니다.",
    ],
  },
  {
    question: "기도는 어떻게 하나요?",
    answer: [
      "직접 기도하거나 기도 가이드를 읽으며 시작할 수 있습니다. SNS를 열기 전 잠깐 멈추고 하나님께 마음을 돌리는 시간입니다. SNS 사용과 관계없이 앱을 직접 열어 기도할 수도 있습니다.",
    ],
  },
  {
    question: "기도를 마치면 SNS가 바로 열리나요?",
    answer: [
      "기도 후에는 지금 SNS가 필요한지 다시 선택합니다. 필요하다고 선택한 뒤 사용할 시간을 고르면 SNS를 사용할 수 있습니다. 기도를 마치는 것만으로 자동으로 열리지는 않습니다.",
    ],
  },
  {
    question: "기도 내용은 어떻게 다루나요?",
    answer: [
      "기도 원문을 서버로 수집하지 않는 방향으로 설계하고 있습니다. 실제로 수집하거나 저장하는 항목과 처리 방법은 개인정보처리방침에서 안내합니다.",
    ],
  },
  {
    question: "사전예약은 무료인가요?",
    answer: [
      "네. 사전예약에는 결제가 발생하지 않습니다. 베타 일정이 정해지면 이메일로 참여 방법을 안내드립니다. 사전예약이 즉시 이용이나 베타 참여 확정을 의미하지는 않습니다.",
    ],
  },
] as const;

export function FaqSection() {
  const [open, setOpen] = useState<string[]>(["faq-0"]);
  return (
    <section
      className="landing-section"
      id="faq"
      aria-labelledby="faq-heading"
      data-figma-node="1209:697 / 1209:1231"
    >
      <div className="container">
        <div className="section-rule h-px bg-border" />
        <div className="faq-layout grid grid-cols-1 gap-8 [align-items:start] md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10 lg:grid-cols-[minmax(0,360fr)_minmax(0,744fr)] lg:gap-24">
          <div className="content-stack flex flex-col faq-heading gap-4">
            <p className="eyebrow text-muted-foreground font-sans text-xs leading-5 font-normal tracking-[1.2px]">
              QUESTIONS, ANSWERED
            </p>
            <h2 id="faq-heading" tabIndex={-1}>
              궁금한 점을
              <br />
              먼저 확인하세요.
            </h2>
          </div>
          <Accordion
            className="faq-list"
            type="multiple"
            value={open}
            onValueChange={setOpen}
          >
            {items.map(({ question, answer }, index) => (
              <AccordionItem
                className="faq-item py-[20.4px] border-b-0 [border-bottom-style:none] after:content-[''] after:block after:h-px after:mt-[13.6px] after:bg-border"
                key={question}
                value={`faq-${index}`}
              >
                <AccordionTrigger
                  id={`faq-question-${index}`}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span>{question}</span>
                </AccordionTrigger>
                <FaqAnswer
                  id={`faq-answer-${index}`}
                  labelledBy={`faq-question-${index}`}
                  open={open.includes(`faq-${index}`)}
                >
                  {answer.map((paragraph) => (
                    <p
                      className="body-copy text-muted-foreground text-base leading-[26px] font-normal md:text-lg md:leading-[30px]"
                      key={paragraph}
                    >
                      {paragraph}
                    </p>
                  ))}
                </FaqAnswer>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
