import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button } from "../src/components/ui/button";
import { AnchorLink } from "../src/components/landing/anchor-link";

describe("shadcn Button integration", () => {
  it("preserves native disabled form submission and the approved primary styling", () => {
    for (const state of [undefined, "default"] as const) {
      const html = renderToStaticMarkup(createElement(Button, {
        type: "submit",
        disabled: true,
        state,
        "aria-describedby": "signup-help",
      }, "무료로 신청하기"));

      expect(html).toMatch(/^<button\b/);
      expect(html).toContain('type="submit"');
      expect(html).toContain('disabled=""');
      expect(html).toContain('data-state="disabled"');
      expect(html).not.toContain("aria-busy");
      expect(html).toContain('aria-describedby="signup-help"');
      expect(html).toContain('class="pt-button pt-button--primary pt-button--disabled"');
      expect(html).toContain("무료로 신청하기</button>");
    }
  });

  it("composes real AnchorLink CTAs as a single native link without a button wrapper", () => {
    for (const variant of ["primary", "secondary"] as const) {
      const html = renderToStaticMarkup(createElement(Button, { asChild: true, variant },
        createElement(AnchorLink, { href: "#beta-signup", "aria-label": "무료로 신청하기" }, "무료로 신청하기"),
      ));

      expect(html).toMatch(/^<a\b/);
      expect(html).toContain('href="#beta-signup"');
      expect(html).toContain('aria-label="무료로 신청하기"');
      expect(html).toContain(`class="pt-button pt-button--${variant}"`);
      expect(html).toContain('data-state="default"');
      expect(html.match(/<a\b/g)).toHaveLength(1);
      expect(html).not.toContain("<button");
      expect(html).not.toContain("disabled");
      expect(html).not.toContain("aria-busy");
    }
  });

  it.each(["disabled", "submitting"] as const)("enforces the explicit %s state without changing the appearance variant", state => {
    const html = renderToStaticMarkup(createElement(Button, {
      type: "submit",
      variant: "secondary",
      state,
      disabled: false,
    }, state === "submitting" ? "접수 중…" : "무료로 신청하기"));

    expect(html).toMatch(/^<button\b/);
    expect(html).toContain('type="submit"');
    expect(html).toContain('disabled=""');
    expect(html).toContain(`data-state="${state}"`);
    expect(html).toContain(`class="pt-button pt-button--secondary pt-button--${state}"`);
    if (state === "submitting") {
      expect(html).toContain('aria-busy="true"');
      expect(html).toContain("접수 중…</button>");
    } else {
      expect(html).not.toContain("aria-busy");
    }
  });
});
