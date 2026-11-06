import { expect, test } from "@playwright/test";
import streams from "../../src/components/landing/card-intro-motion.json" with { type:"json" };

test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:3000(?:\/|$)).*/, route => route.abort());
  await page.route("**/api/beta-signup", route => route.abort());
});

test("standalone intro reveals the whole word then the actual logo once, with no SNS layers", async ({ page }) => {
  for (const width of [1440,393]) {
    await page.setViewportSize({ width,height:width === 1440 ? 760 : 680 });
    await page.goto("/");
    const clean=page.locator("[data-clean-intro]");
    const cards=page.locator(".card-intro__cards");
    await clean.evaluate(el => el.scrollIntoView({ block:"start",behavior:"instant" }));
    await expect(clean).toHaveAttribute("data-intro-state","running");
    expect(await clean.evaluate(el => el.tagName)).toBe("SECTION");
    expect(await cards.evaluate(el => el.tagName)).toBe("SECTION");
    await expect(clean).toHaveCSS("overflow-x","clip");
    await expect(cards).toHaveCSS("overflow-x","clip");
    await expect(clean).toHaveCSS("isolation","isolate");
    await expect(clean.locator(".ambient-card,.card-intro__art,.card-intro__particle,.card-intro__masonry")).toHaveCount(0);
    await expect(clean.locator("img")).toHaveCount(1);
    await expect(clean.locator(".card-intro__pause")).toHaveCount(0);
    const logo=clean.locator("[data-brand-asset]");
    expect(await logo.evaluate(el => (el as HTMLImageElement).currentSrc)).toContain("praytime-wordmark-" + (width === 1440 ? "desktop" : "mobile") + ".png");
    await expect(clean.locator(".card-intro__therefore")).toHaveText("그래서");
    expect(await clean.locator(".card-intro__therefore").evaluate(el => el.childElementCount)).toBe(0);
    const samples=await clean.evaluate(el => {
      const animations=el.getAnimations({ subtree:true });
      return [0,650,1350,1951,4000,16000].map(time => {
        for (const animation of animations) { animation.pause();animation.currentTime=time; }
        return ["therefore","brand"].map(part => Number(getComputedStyle(el.querySelector('[data-intro-part="' + part + '"]')!).opacity));
      });
    });
    expect(samples).toEqual([[0,0],[1,0],[1,0],[1,1],[1,1],[1,1]]);
    await cards.evaluate(el => el.scrollIntoView({ block:"start",behavior:"instant" }));
    await expect(clean).toHaveAttribute("data-intro-state","complete");
    await clean.evaluate(el => el.scrollIntoView({ block:"start",behavior:"instant" }));
    await expect(clean).toHaveAttribute("data-intro-state","complete");
    await expect(clean.locator(".card-intro__brand")).toHaveCSS("opacity","1");
    await expect(cards.locator(".card-intro__therefore,.card-intro__brand")).toHaveCount(0);
    expect(await page.getByText("열기 전, 무엇 때문에 열었는지 떠올려 보세요.",{exact:true}).count()).toBe(0);
  }
});

test("SNS scene fills the viewport with covered art and centered copy while the clean intro keeps its authored height", async ({ page }) => {
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
    const scale=Math.max(viewport.width/base.width,viewport.height/base.height);
    await expect(scene).toHaveCSS("height",`${viewport.height}px`);
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
    expect(geometry.scene.height).toBe(viewport.height);
    expect(geometry.clean.height).toBe(viewport.width < 768 ? 680 : 760);
    expect(geometry.clean.bottom).toBeCloseTo(geometry.scene.top,1);
    expect(geometry.art.height).toBeCloseTo(base.height*scale,1);
    expect(geometry.art.left).toBeLessThanOrEqual(geometry.scene.left+.1);
    expect(geometry.art.right).toBeGreaterThanOrEqual(geometry.scene.right-.1);
    expect(geometry.art.top).toBeLessThanOrEqual(geometry.scene.top+.1);
    expect(geometry.art.bottom).toBeGreaterThanOrEqual(geometry.scene.bottom-.1);
    expect(geometry.declaration.left+geometry.declaration.width/2).toBeCloseTo(viewport.width/2,1);
    expect(geometry.declaration.top+geometry.declaration.height/2).toBeCloseTo(viewport.height/2,1);
    expect(geometry.copyAnimations).toEqual([0,0]);
    expect(geometry.documentWidth).toBeLessThanOrEqual(viewport.width);
  }
});

test("photo streams stay unique and continuous through every source seam and repeated 12s loops", async ({ page }) => {
  test.setTimeout(90_000);
  for (const width of [1440,393]) {
    const variant=width === 1440 ? "desktop" : "mobile";
    await page.setViewportSize({ width,height:width === 1440 ? 1080 : 932 });
    await page.goto("/");
    const scene=page.locator(".card-intro__cards");
    await scene.evaluate(el => el.scrollIntoView({ block:"start",behavior:"instant" }));
    await expect(page.locator("[data-signature-transition]")).toHaveAttribute("data-motion-state","running");
    await page.evaluate(() => { for (const img of document.images) img.loading="eager"; });
    await expect.poll(() => page.evaluate(() => [...document.images].filter(img => !img.complete || !img.naturalWidth).length),{timeout:30_000}).toBe(0);
    const resetTimes=streams[variant].tracks.filter(track => track.frames.some(frame => "transform" in frame) && track.nodeId.startsWith("1284:")).map(track => track.frames[1].offset * 12000);
    const result=await scene.evaluate((el,{resetTimes,baseHeight}) => {
      const animations=el.getAnimations({subtree:true});
      const clip=el.getBoundingClientRect();
      const columns=[...el.querySelectorAll<HTMLElement>(".card-intro__column")];
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
        const transforms=columns.map(column => ({direction:column.dataset.columnDirection,y:new DOMMatrixReadOnly(getComputedStyle(column).transform).m42}));
        return {time,photos,particles,coverage,transforms};
      };
      const pairs=[...resetTimes,12000,24000].map(time => [snapshot(time-2),snapshot(time+2)]);
      const mid=snapshot(6000);
      const start=snapshot(0);
      const early=snapshot(1000);
      const now=document.timeline.currentTime;
      for (const animation of animations) { animation.currentTime=0;animation.play();if(typeof now==="number")animation.startTime=now; }
      return {pairs,mid,start,early,scale,clip:{top:clip.top,bottom:clip.bottom}};
    },{resetTimes,baseHeight:width === 1440 ? 760 : 680});
    for (const [index,column] of result.start.transforms.entries()) {
      expect(column.direction).toBe(index%2 === 0 ? "up" : "down");
      const movement=result.early.transforms[index].y-column.y;
      expect(index%2 === 0 ? -movement : movement).toBeGreaterThan(1);
    }
    for (const sample of [result.start,result.mid,...result.pairs.flat()]) {
      expect(sample.photos.length).toBeGreaterThan(5);
      expect(new Set(sample.photos.map(photo => photo.src)).size).toBe(sample.photos.length);
      expect(sample.particles.filter(p => p.opacity > .05 && p.kind==="heart").length).toBeGreaterThan(1);
      expect(sample.particles.some(p => p.opacity > .01 && p.kind==="share")).toBe(true);
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
        expect(a.column%2 === 0 ? movement : -movement).toBeGreaterThan(0);
        const speed=Math.abs(result.early.transforms[a.column].y-result.start.transforms[a.column].y)/1000*result.scale;
        expect(Math.abs(movement)).toBeCloseTo(speed*4,1);
      }
    }
    expect(result.start.particles.some((p,i) => p.transform!==result.mid.particles[i].transform)).toBe(true);
    if (width === 1440) {
      await expect.poll(() => scene.evaluate(el => Number(el.getAnimations({subtree:true})[0].currentTime)),{timeout:15_000}).toBeGreaterThan(12100);
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
