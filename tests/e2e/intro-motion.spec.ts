import { expect, test } from "@playwright/test";
import streams from "../../src/components/landing/card-intro-motion.json" with { type:"json" };

test.beforeEach(async ({ page, baseURL }) => {
  const origin=new URL(baseURL!).origin;
  await page.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  await page.route("**/api/beta-signup", route => route.abort());
});

test("SNS cards lead for 1700ms before the text and dark scrim reveal together on visible entry", async ({ page }) => {
  test.setTimeout(45_000);
  for (const width of [1440, 393]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const scene = page.locator(".card-intro__cards");
    const text = scene.locator(".card-intro__declaration");
    const quiet = scene.locator(".card-intro__quiet");
    await expect(scene).toHaveAttribute("data-copy-state", "pending");
    await expect(scene).toHaveAttribute("data-copy-delay", "1700");
    await expect(scene).toHaveAttribute("data-copy-fade", "400");
    await expect(quiet).toHaveCount(1);
    await expect(text).toHaveCSS("opacity", "0");
    await expect(quiet).toHaveCSS("opacity", "0");

    // Start and leave inside the browser, so automation round trips cannot
    // accidentally consume the entire short startup window.
    const firstEntry = await scene.evaluate(async el => {
      el.scrollIntoView({ block: "start", behavior: "instant" });
      await new Promise(resolve => setTimeout(resolve, 250));
      const snapshot = {
        text: Number(getComputedStyle(el.querySelector(".card-intro__declaration")!).opacity),
        quiet: Number(getComputedStyle(el.querySelector(".card-intro__quiet")!).opacity),
        columns: [...el.querySelectorAll(".card-intro__column")].every(column => column.getAnimations().some(animation => animation.playState === "running")),
      };
      document.getElementById("hero")!.scrollIntoView({ block: "start", behavior: "instant" });
      return snapshot;
    });
    expect(firstEntry).toEqual({ text: 0, quiet: 0, columns: true });
    await expect(scene).toHaveAttribute("data-copy-state", "pending");
    await page.waitForTimeout(1900);
    await expect(text).toHaveCSS("opacity", "0");
    await expect(quiet).toHaveCSS("opacity", "0");

    await scene.evaluate(el => {
      type Sample = { at: number; state: string; text: number; quiet: number };
      const target = el as HTMLElement & { revealQA?: { waiting: number; revealing: number; shown: number; samples: Sample[] } };
      const result: NonNullable<typeof target.revealQA> = { waiting: 0, revealing: 0, shown: 0, samples: [] };
      target.revealQA = result;
      const observer = new MutationObserver(() => {
        const state = target.dataset.copyState;
        if (state === "waiting" || state === "revealing" || state === "shown") {
          if (!result[state]) result[state] = performance.now();
        }
      });
      observer.observe(target, { attributes: true, attributeFilter: ["data-copy-state"] });
      const sample = () => {
        result.samples.push({ at: performance.now(), state: target.dataset.copyState!,
          text: Number(getComputedStyle(target.querySelector(".card-intro__declaration")!).opacity),
          quiet: Number(getComputedStyle(target.querySelector(".card-intro__quiet")!).opacity) });
        if (target.dataset.copyState === "shown") { observer.disconnect(); return; }
        requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
      target.scrollIntoView({ block: "start", behavior: "instant" });
    });
    await expect(scene).toHaveAttribute("data-copy-state", "shown");
    await expect(text).toHaveCSS("opacity", "1");
    await expect(quiet).toHaveCSS("opacity", "1");
    const observation = await scene.evaluate(el => (el as HTMLElement & { revealQA: { waiting: number; revealing: number; shown: number; samples: { at: number; state: string; text: number; quiet: number }[] } }).revealQA);
    expect(observation.revealing - observation.waiting).toBeGreaterThanOrEqual(1680);
    expect(observation.revealing - observation.waiting).toBeLessThanOrEqual(1900);
    expect(observation.shown - observation.revealing).toBeGreaterThanOrEqual(380);
    expect(observation.samples.some(sample => sample.state === "waiting" && sample.text === 0 && sample.quiet === 0)).toBe(true);
    expect(observation.samples.some(sample => sample.text > .1 && sample.text < .9)).toBe(true);
    for (const sample of observation.samples) expect(Math.abs(sample.text - sample.quiet)).toBeLessThan(.04);
    await expect(scene.locator(".card-intro__headline")).toContainText("손이 먼저 움직인 순간,");
    await expect(scene.locator(".card-intro__headline")).toContainText("다시 생각할 시간을");
    await expect(scene.locator(".card-intro__anchor")).toContainText("필요한 만큼만 선택합니다.");
    expect(await scene.locator(".card-intro__column").evaluateAll(columns => columns.every(column => column.getAnimations().every(animation => animation.playState === "running")))).toBe(true);
    await page.locator("#hero").evaluate(el => el.scrollIntoView({ behavior: "instant" }));
    await scene.evaluate(el => el.scrollIntoView({ block: "start", behavior: "instant" }));
    await expect(scene).toHaveAttribute("data-copy-state", "shown");
    await expect(text).toHaveCSS("opacity", "1");
    const streamClock = await scene.locator(".card-intro__column").first().evaluate(el => Number(el.getAnimations()[0].currentTime));
    await page.setViewportSize({ width: width === 1440 ? 393 : 1440, height: 900 });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const resizedClock = await scene.locator(".card-intro__column").first().evaluate(el => Number(el.getAnimations()[0].currentTime));
    expect(resizedClock).toBeGreaterThanOrEqual(streamClock - 30);
    await expect(scene).toHaveAttribute("data-copy-state", "shown");
    await expect(text).toHaveCSS("opacity", "1");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator("[data-signature-transition]")).toHaveAttribute("data-motion-state", "reduced");
    await expect(text).toHaveCSS("opacity", "1");
    await expect(quiet).toHaveCSS("opacity", "1");
    expect(await scene.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
  }
});

test.describe("SNS copy without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("shows readable text immediately without waiting for a reveal", async ({ page }) => {
    for (const width of [1440, 393]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const scene = page.locator(".card-intro__cards");
      await expect(scene.locator(".card-intro__declaration")).toHaveCSS("opacity", "1");
      await expect(scene.locator(".card-intro__headline")).toContainText("손이 먼저 움직인 순간,");
    }
  });
});

test("restored white intro reveals the whole word, slit and aperture before the logo on entry, with no SNS layers", async ({ page }) => {
  for (const width of [1440,393,360]) {
    await page.setViewportSize({ width,height:width === 1440 ? 760 : 680 });
    await page.goto("/");
    const clean=page.locator("[data-clean-intro]");
    const cards=page.locator(".card-intro__cards");
    await expect(clean).toHaveAttribute("data-intro-duration","4600");
    await expect(clean).toHaveAttribute("data-intro-state","paused");
    await page.waitForTimeout(500);
    expect(await clean.evaluate(el => el.getAnimations({subtree:true}).every(a => a.currentTime === 0))).toBe(true);
    await clean.evaluate(el => el.scrollIntoView({ block:"start",behavior:"instant" }));
    await expect(clean).toHaveAttribute("data-intro-state","running");
    expect(await clean.evaluate(el => el.tagName)).toBe("SECTION");
    expect(await cards.evaluate(el => el.tagName)).toBe("SECTION");
    await expect(clean).toHaveCSS("overflow-x","clip");
    await expect(cards).toHaveCSS("overflow-x","clip");
    await expect(clean).toHaveCSS("isolation","isolate");
    await expect(clean.locator(".ambient-card,.card-intro__art,.card-intro__particle,.card-intro__masonry")).toHaveCount(0);
    await expect(clean.locator("img")).toHaveCount(5);
    await expect(clean.locator(".card-intro__pause")).toHaveCount(0);
    const logo=clean.locator("[data-brand-asset]");
    expect(await logo.evaluate(el => (el as HTMLImageElement).currentSrc)).toContain("praytime-wordmark-" + (width === 1440 ? "desktop" : "mobile") + ".svg");
    await expect(clean.locator(".card-intro__therefore")).toHaveText("그래서");
    await expect(clean.locator(".card-intro__therefore")).toHaveCSS("color","rgb(24, 24, 27)");
    await expect(clean.locator(".clean-intro__paper")).toHaveCSS("background-color","rgb(245, 242, 247)");
    await expect(clean.locator(".clean-intro__paper")).toHaveCSS("filter","none");
    expect(await clean.evaluate(el => {
      const scene=el.getBoundingClientRect();
      const paper=el.querySelector(".clean-intro__paper")!.getBoundingClientRect();
      return paper.top <= scene.top && paper.bottom >= scene.bottom && paper.left <= scene.left && paper.right >= scene.right;
    })).toBe(true);
    expect(await clean.locator(".card-intro__therefore").evaluate(el => el.childElementCount)).toBe(0);
    const samples=await clean.evaluate(el => {
      const animations=el.getAnimations({ subtree:true });
      return [0,650,900,1100,1800,2250,2800,4600,16000].map(time => {
        for (const animation of animations) { animation.pause();animation.currentTime=time; }
        return Object.fromEntries(["paper","therefore","slit","outer","brand"].map(part => [part,Number(getComputedStyle(el.querySelector('[data-intro-part="' + part + '"]')!).opacity)]));
      });
    });
    expect(samples[0]).toEqual({paper:1,therefore:0,slit:0,outer:0,brand:0});
    for (const held of samples.slice(1,4)) expect(held).toEqual({paper:1,therefore:1,slit:0,outer:0,brand:0});
    expect(samples[4].paper).toBeGreaterThan(0);
    expect(samples[4].paper).toBeLessThan(1);
    expect(samples[4].therefore).toBe(0);
    expect(samples[4].slit).toBe(1);
    expect(samples[5].outer).toBe(1);
    expect(samples[5].brand).toBeGreaterThan(.8);
    expect(samples[6].brand).toBe(1);
    for (const final of samples.slice(7)) expect(final).toEqual({paper:0,therefore:0,slit:0,outer:0,brand:1});
    // The background must never darken under a still-visible black word,
    // and must be fully navy before the white wordmark starts to appear.
    const contrast=await clean.evaluate(el => {
      const animations=el.getAnimations({subtree:true});
      return [400,1200,1340,1450,1545,1546,1750,2009,2010,2100,2304].map(time => {
        for (const animation of animations) animation.currentTime=time;
        const opacity=(part:string) => Number(getComputedStyle(el.querySelector('[data-intro-part="' + part + '"]')!).opacity);
        return {time,paper:opacity("paper"),word:opacity("therefore"),brand:opacity("brand"),handoff:opacity("handoff")};
      });
    });
    for (const sample of contrast) {
      if (sample.word > 0) { expect(sample.paper).toBe(1); expect(sample.handoff).toBe(0); }
      if (sample.brand > 0) { expect(sample.paper).toBe(0); expect(sample.handoff).toBe(1); }
      expect(sample.paper+sample.handoff).toBeCloseTo(1,5);
    }
    await clean.evaluate(el => el.getAnimations({subtree:true}).forEach(animation => { animation.currentTime=4600; }));
    await cards.evaluate(el => el.scrollIntoView({ block:"start",behavior:"instant" }));
    await expect(clean).toHaveAttribute("data-intro-state","complete");
    await clean.evaluate(el => el.scrollIntoView({ block:"start",behavior:"instant" }));
    await expect(clean).toHaveAttribute("data-intro-state","complete");
    await expect(clean.locator(".card-intro__brand")).toHaveCSS("opacity","1");
    await expect(cards.locator(".card-intro__therefore,.card-intro__brand")).toHaveCount(0);
    expect(await page.getByText("열기 전, 무엇 때문에 열었는지 떠올려 보세요.",{exact:true}).count()).toBe(0);
    expect(await page.getByText("행동하기 전에, 잠깐의 틈을 만듭니다.",{exact:true}).count()).toBe(0);
    await expect(clean.locator('[class*="dot"],img[src*="transition-dot"]')).toHaveCount(0);
  }
});

test("intro progress survives a breakpoint change and its completed logo does not replay", async ({ page }) => {
  await page.setViewportSize({ width:1440, height:900 });
  await page.emulateMedia({ reducedMotion:"no-preference" });
  await page.goto("/");
  const intro = page.locator("[data-clean-intro]");
  const clock = () => intro.evaluate(el => Number(el.getAnimations({ subtree:true })[0]?.currentTime));
  await intro.evaluate(el => el.scrollIntoView({ block:"start", behavior:"instant" }));
  await expect(intro).toHaveAttribute("data-intro-state", "running");
  await expect.poll(clock).toBeGreaterThan(1000);
  const beforeResize = await clock();
  await page.setViewportSize({ width:393, height:900 });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  expect(await clock()).toBeGreaterThanOrEqual(beforeResize - 30);
  await intro.evaluate(el => el.scrollIntoView({ block:"start", behavior:"instant" }));
  await expect(intro).toHaveAttribute("data-intro-state", "complete", { timeout:6000 });
  await expect(intro.locator('[data-intro-part="brand"]')).toHaveCSS("opacity", "1");
  await page.setViewportSize({ width:1440, height:900 });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await expect(intro).toHaveAttribute("data-intro-state", "complete");
  expect(await clock()).toBe(4600);
  await expect(intro.locator('[data-intro-part="paper"]')).toHaveCSS("opacity", "0");
  await expect(intro.locator('[data-intro-part="brand"]')).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion:"reduce" });
  await expect(intro).toHaveAttribute("data-intro-state", "reduced");
  await page.emulateMedia({ reducedMotion:"no-preference" });
  await expect(intro).toHaveAttribute("data-intro-state", "complete");
  expect(await clock()).toBe(4600);
});

test("Final SNS frame follows Figma and the independent intro fills the viewport", async ({ page }) => {
  await page.emulateMedia({ reducedMotion:"reduce" });
  await page.goto("/");
  for (const viewport of [
    { width:1440,height:900 },
    { width:1440,height:1080 },
    { width:1920,height:1080 },
    { width:2560,height:1080 },
    { width:844,height:390 },
    { width:393,height:844 },
    { width:430,height:932 },
  ]) {
    await page.setViewportSize(viewport);
    const scene=page.locator(".card-intro__cards");
    await scene.evaluate(el => el.scrollIntoView({ block:"start",behavior:"instant" }));
    const base=viewport.width < 768 ? { width:393,height:680 } : { width:1440,height:760 };
    const scale=Math.max(1,viewport.width/base.width);
    await expect(page.locator("[data-clean-intro]")).toHaveCSS("height",`${Math.max(base.height,viewport.height)}px`);
    await scene.evaluate(el => el.scrollIntoView({ block:"start",behavior:"instant" }));
    await expect(scene).toHaveCSS("height",`${base.height}px`);
    await expect.poll(async () => (await scene.locator(".card-intro__art").boundingBox())!.width).toBeCloseTo(base.width*scale,1);
    const geometry=await scene.evaluate(el => {
      const rect=(element:Element) => {
        const r=element.getBoundingClientRect();
        return { left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height };
      };
      return {
        scene:rect(el),
        art:rect(el.querySelector(".card-intro__art")!),
        declaration:rect(el.querySelector(".card-intro__declaration")!),
        clean:rect(document.querySelector("[data-clean-intro]")!),
        copyAnimations:[".card-intro__headline",".card-intro__anchor"].map(selector => el.querySelector(selector)!.getAnimations({subtree:true}).length),
        documentWidth:document.documentElement.scrollWidth,
      };
    });
    expect(geometry.scene.left).toBeCloseTo(0,1);
    expect(geometry.scene.top).toBeCloseTo(0,1);
    expect(geometry.scene.width).toBe(viewport.width);
    expect(geometry.scene.height).toBe(base.height);
    expect(geometry.clean.height).toBe(Math.max(base.height,viewport.height));
    expect(geometry.clean.bottom).toBeCloseTo(geometry.scene.top,1);
    expect(geometry.art.height).toBeCloseTo(base.height*scale,1);
    expect(geometry.art.left).toBeLessThanOrEqual(geometry.scene.left+.1);
    expect(geometry.art.right).toBeGreaterThanOrEqual(geometry.scene.right-.1);
    expect(geometry.art.top).toBeLessThanOrEqual(geometry.scene.top+.1);
    expect(geometry.art.bottom).toBeGreaterThanOrEqual(geometry.scene.bottom-.1);
    expect(geometry.declaration.left+geometry.declaration.width/2).toBeCloseTo(viewport.width/2,1);
    expect(geometry.declaration.top+geometry.declaration.height/2).toBeCloseTo(base.height/2,1);
    expect(geometry.copyAnimations).toEqual([0,0]);
    expect(geometry.documentWidth).toBeLessThanOrEqual(viewport.width);
  }
});

test("every SNS heart and paper plane rises during every visible pulse", async ({ page }) => {
  test.setTimeout(35_000);
  for (const width of [1440,393]) {
    const variant = width === 1440 ? "desktop" : "mobile";
    await page.setViewportSize({ width, height:900 });
    await page.emulateMedia({ reducedMotion:"no-preference" });
    await page.goto("/");
    const scene = page.locator(".card-intro__cards");
    await scene.evaluate(el => el.scrollIntoView({ block:"start", behavior:"instant" }));
    await expect(scene).toHaveAttribute("data-copy-state", "shown");
    const particles = streams[variant].tracks.filter(track => track.frames.some(frame => "opacity" in frame)).map(track => {
      const frames = track.frames as { offset:number; opacity:number }[];
      const pulses = frames.flatMap((frame,index) => {
        if (frame.opacity !== 0 || !frames[index + 1] || frames[index + 1].opacity <= 0) return [];
        const end = frames.slice(index + 1).find(next => next.opacity === 0)?.offset
          ?? 1 + frames.find(next => next.opacity === 0)!.offset;
        return [{ early:(frame.offset + (end - frame.offset) * .25) * 12000,
          late:(frame.offset + (end - frame.offset) * .75) * 12000 }];
      });
      return { nodeId:track.nodeId, pulses };
    });
    expect(particles).toHaveLength(20);
    expect(particles.every(particle => particle.pulses.length === 4)).toBe(true);
    const movements = await scene.evaluate((el,particles) => particles.map(particle => {
      const target = el.querySelector<HTMLElement>('[data-node-id="' + particle.nodeId + '"]')!;
      const animations = target.getAnimations();
      animations.forEach(animation => animation.pause());
      const sample = (time:number) => {
        animations.forEach(animation => { animation.currentTime = time; });
        const style = getComputedStyle(target);
        return { opacity:Number(style.opacity), y:new DOMMatrixReadOnly(style.transform).m42 };
      };
      return { nodeId:particle.nodeId, pulses:particle.pulses.map(pulse => ({ early:sample(pulse.early), late:sample(pulse.late) })) };
    }),particles);
    for (const particle of movements) for (const [pulse, movement] of particle.pulses.entries()) {
      const label = `${variant} ${particle.nodeId} pulse${pulse + 1}`;
      expect(movement.early.opacity,label).toBeGreaterThan(.05);
      expect(movement.late.opacity,label).toBeGreaterThan(.05);
      expect(movement.late.y,label).toBeLessThan(movement.early.y - 1);
    }
  }
});

test("alternating photo streams run at 70% speed without gaps or duplicate photos through two cycles; particles retain 12s", async ({ page }) => {
  test.setTimeout(240_000);
  const cardDuration=15000 / 0.7;
  for (const width of [1440,393,360]) {
    const variant=width === 1440 ? "desktop" : "mobile";
    await page.setViewportSize({ width,height:width === 1440 ? 1080 : 932 });
    await page.goto("/");
    const scene=page.locator(".card-intro__cards");
    await scene.evaluate(el => el.scrollIntoView({ block:"start",behavior:"instant" }));
    const transition=page.locator("[data-signature-transition]");
    await expect(transition).toHaveAttribute("data-motion-state","running");
    await expect(transition).toHaveAttribute("data-motion-duration",String(cardDuration));
    await expect(transition).toHaveAttribute("data-particle-motion-duration","12000");
    expect(streams[variant].duration).toBe(12000);
    await page.evaluate(() => { for (const img of document.images) img.loading="eager"; });
    await expect.poll(() => page.evaluate(() => [...document.images].filter(img => !img.complete || !img.naturalWidth).length),{timeout:30_000}).toBe(0);
    // The one-time text/scrim CSS transition is separate from the permanent
    // card/particle tracks; inspect that inventory after the reveal finishes.
    await expect(scene).toHaveAttribute("data-copy-state", "shown");
    const resetTimes=streams[variant].tracks.filter(track => track.frames.some(frame => "transform" in frame) && track.nodeId.startsWith("1284:")).map(track => track.frames[1].offset * cardDuration);
    const result=await scene.evaluate((el,{resetTimes,baseHeight,cardDuration}) => {
      const animations=el.getAnimations({subtree:true});
      const clip=el.getBoundingClientRect();
      const columns=[...el.querySelectorAll<HTMLElement>(".card-intro__column")];
      const timings=animations.map(animation => {
        const target=(animation.effect as KeyframeEffect).target as HTMLElement;
        return { kind:target.matches(".card-intro__column") ? "column" : target.matches(".card-intro__particle") ? "particle" : "other",duration:animation.effect!.getTiming().duration };
      });
      const scale=el.querySelector(".card-intro__art")!.getBoundingClientRect().height/baseHeight;
      const snapshot=(time:number) => {
        for (const animation of animations) { animation.pause();animation.currentTime=time; }
        const photos=[...el.querySelectorAll<HTMLImageElement>(".ambient-card__photo")].flatMap(img => {
          const r=img.getBoundingClientRect();
          if (Math.min(r.right,clip.right,innerWidth)-Math.max(r.left,clip.left,0) <= 1 || Math.min(r.bottom,clip.bottom,innerHeight)-Math.max(r.top,clip.top,0) <= 1) return [];
          const url=new URL(img.currentSrc || img.src);
          return [{src:url.searchParams.get("url") || url.pathname,top:r.top,left:r.left,column:columns.indexOf(img.closest<HTMLElement>(".card-intro__column")!)}];
        });
        const coverage=columns.flatMap((column,index) => {
          const box=column.getBoundingClientRect();
          if (Math.min(box.right,clip.right)-Math.max(box.left,clip.left) <= 1) return [];
          const cards=[...column.querySelectorAll(".ambient-card")].map(card => card.getBoundingClientRect())
            .filter(r => r.bottom > clip.top && r.top < clip.bottom).sort((a,b) => a.top-b.top);
          return [{column:index,count:cards.length,top:cards[0]?.top ?? Infinity,bottom:cards.at(-1)?.bottom ?? -Infinity,maxGap:Math.max(0,...cards.slice(1).map((card,i) => card.top-cards[i].bottom))}];
        });
        const particles=[...el.querySelectorAll<HTMLElement>(".card-intro__particle")].map(p => ({kind:p.parentElement!.dataset.particleKind,opacity:Number(getComputedStyle(p).opacity),transform:getComputedStyle(p).transform}));
        const transforms=columns.map(column => ({direction:column.dataset.columnDirection,y:new DOMMatrixReadOnly(getComputedStyle(column).transform).m42,cycleHeight:Number.parseFloat(column.style.height)/2}));
        return {time,photos,particles,coverage,transforms};
      };
      const pairs=[...resetTimes,cardDuration,cardDuration*2].map(time => [snapshot(time-2),snapshot(time+2)]);
      // Dense samples cover the reverse-running columns throughout both loops,
      // not only the shared seam or a favorable opening frame.
      const sweep=Array.from({length:81},(_,index) => snapshot(index*cardDuration/40));
      const mid=snapshot(cardDuration/2);
      const start=snapshot(0);
      const early=snapshot(1000);
      const particleMid=snapshot(6000).particles;
      const particleRepeats=[12000,24000].map(time => snapshot(time).particles);
      const now=document.timeline.currentTime;
      for (const animation of animations) { animation.currentTime=0;animation.play();if(typeof now==="number")animation.startTime=now; }
      return {pairs,sweep,mid,start,early,particleMid,particleRepeats,timings,scale,clip:{top:clip.top,bottom:clip.bottom}};
    },{resetTimes,baseHeight:width === 1440 ? 760 : 680,cardDuration});
    expect(result.timings.filter(timing => timing.kind === "column")).toHaveLength(width === 1440 ? 6 : 3);
    expect(result.timings.filter(timing => timing.kind === "particle")).toHaveLength(40);
    for (const timing of result.timings) {
      expect(timing.kind).not.toBe("other");
      expect(timing.duration).toBe(timing.kind === "column" ? cardDuration : 12000);
    }
    for (const [index,column] of result.start.transforms.entries()) {
      expect(column.direction).toBe(index % 2 === 0 ? "up" : "down");
      const movement=result.early.transforms[index].y-column.y;
      expect(column.direction === "up" ? -movement : movement).toBeGreaterThan(1);
      const previousTravel=column.cycleHeight/15000*1000;
      // Browsers round serialized DOMMatrix values; subpixel rounding must
      // not reject the exact duration ratio already asserted above.
      expect(Math.abs(Math.abs(movement)/previousTravel-0.7)).toBeLessThan(0.0001);
    }
    for (const sample of [result.start,result.mid,...result.pairs.flat(),...result.sweep]) {
      // Text/chat/notification cards legitimately reduce visible photo count.
      // Require photos and uniqueness; column coverage below detects gaps.
      expect(sample.photos.length).toBeGreaterThan(0);
      expect(new Set(sample.photos.map(photo => photo.src)).size).toBe(sample.photos.length);
      // Source particles can fade completely at a sampled frame.
      for (const particle of sample.particles) {
        expect(particle.opacity).toBeGreaterThanOrEqual(0);
        expect(particle.opacity).toBeLessThanOrEqual(1);
      }
      expect(sample.coverage.length).toBeGreaterThan(1);
      for (const column of sample.coverage) {
        const gap=(width === 1440 ? 20 : 14)*result.scale;
        expect(column.count).toBeGreaterThan(1);
        expect(column.top).toBeLessThanOrEqual(result.clip.top+gap+.1);
        expect(column.bottom).toBeGreaterThanOrEqual(result.clip.bottom-gap-.1);
        expect(column.maxGap).toBeLessThanOrEqual(gap+.1);
      }
    }
    for (const [before,after] of result.pairs) {
      const common=before.photos.flatMap(a => {
        const b=after.photos.find(b => a.src===b.src);
        return b ? [{a,b}] : [];
      });
      expect(common.length).toBeGreaterThan(4);
      for (const {a,b} of common) {
        expect(a.left).toBeCloseTo(b.left,1);
        expect(a.column).toBe(b.column);
        const movement=a.top-b.top;
        expect(result.start.transforms[a.column].direction === "up" ? movement : -movement).toBeGreaterThan(0);
        const speed=Math.abs(result.early.transforms[a.column].y-result.start.transforms[a.column].y)/1000*result.scale;
        expect(Math.abs(movement)).toBeCloseTo(speed*4,1);
      }
    }
    const particleSamples=[result.start.particles,result.particleMid,result.mid.particles,...result.pairs.flat().map(sample => sample.particles)];
    for (const kind of ["heart","share"]) {
      expect(particleSamples.some(particles => particles.some(p => p.kind===kind && p.opacity > .01))).toBe(true);
      expect(particleSamples.some(particles => particles.some((p,i) => p.kind===kind && p.transform!==result.start.particles[i].transform))).toBe(true);
    }
    // Both particle tracks repeat at their original12s clock, independently
    // of the slower alternating photographic column cycle.
    for (const particles of result.particleRepeats) {
      for (const [index,particle] of particles.entries()) {
        expect(particle.kind).toBe(result.start.particles[index].kind);
        expect(particle.opacity).toBeCloseTo(result.start.particles[index].opacity,5);
        expect(particle.transform).toBe(result.start.particles[index].transform);
      }
    }
    {
      await expect.poll(() => scene.locator(".card-intro__column").first().evaluate(el => Number(el.getAnimations()[0].currentTime)),{timeout:48_000}).toBeGreaterThan(cardDuration*2+100);
      expect(await scene.evaluate(el => el.getAnimations({subtree:true}).every(animation => animation.playState==="running"))).toBe(true);
    }
    await page.emulateMedia({ reducedMotion:"reduce" });
    await expect(page.locator("[data-signature-transition]")).toHaveAttribute("data-motion-state","reduced");
    await expect(scene.locator(".card-intro__column")).toHaveCount(width === 1440 ? 6 : 3);
    expect(await scene.evaluate(el => el.getAnimations({subtree:true}).length)).toBe(0);
    await expect(scene.locator(".card-intro__headline")).toBeVisible();
    await page.emulateMedia({ reducedMotion:"no-preference" });
  }
});
