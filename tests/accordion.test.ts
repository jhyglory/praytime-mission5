import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FaqSection } from "../src/components/landing/faq-section";

describe("Landing shadcn Accordion integration", () => {
  it("renders seven Radix-backed FAQ items with stable ARIA targets and only the first answer visible", () => {
    const html = renderToStaticMarkup(createElement(FaqSection));
    expect(html.match(/data-slot="accordion-item"/g)).toHaveLength(7);
    expect(html.match(/<h3\b/g)).toHaveLength(7);
    expect(html.match(/src="\/assets\/faq-chevron.svg"/g)).toHaveLength(7);

    for (let index = 0; index < 7; index += 1) {
      const trigger = html.match(new RegExp(`<button\\b[^>]*id="faq-question-${index}"[^>]*>`))?.[0];
      const answer = html.match(new RegExp(`<div\\b[^>]*id="faq-answer-${index}"[^>]*>`))?.[0];
      expect(trigger).toBeDefined();
      expect(answer).toBeDefined();
      expect(trigger).toContain('data-slot="accordion-trigger"');
      expect(trigger).toContain(`aria-controls="faq-answer-${index}"`);
      expect(trigger).toContain(`aria-expanded="${index === 0}"`);
      expect(answer).toContain('data-slot="accordion-content"');
      expect(answer).toContain('role="region"');
      expect(answer).toContain(`aria-labelledby="faq-question-${index}"`);
      if (index === 0) expect(answer).not.toContain("hidden=");
      else expect(answer).toContain('hidden=""');
    }
    expect(html).toContain("5·10·15분");
    expect(html).toContain("기도를 마치는 것만으로 자동으로 열리지는 않습니다.");
    expect(html).toContain("기도 원문을 서버로 수집하지 않는 방향으로 설계하고 있습니다");
    expect(html).toContain("사전예약에는 결제가 발생하지 않습니다.");
  });
});
