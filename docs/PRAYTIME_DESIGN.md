# PrayTime design and motion contracts

## Authority

Latest user corrections → final Figma → existing implementation. Preserve the current approved screen during styling refactors; no redesign or Figma edits.

- [Desktop 1209:514](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1209-514)
- [Mobile 1209:1051](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1209-1051)
- [Desktop motion 1265:8215](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1265-8215)
- [Mobile motion 1265:11339](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1265-11339)

## Styling

Tailwind v4 theme is in src/app/globals.css. Signal Red #FF4438, Soft Paper #F5F2F7, GAP Navy #080E26 and Ink #171C26 map to named utilities. Contextual background/foreground/surface/border/primary/ring tokens preserve light/dark sections and shadcn styling. Standard spacing uses the Tailwind scale; precise Figma measurements use explicit arbitrary values.

Mobile-first utilities use md at768px and lg at1200px (existing desktop breakpoint, deliberately different from Tailwind's default1024). Existing narrower375/393px artwork/type guards are retained. Never round exact Figma dimensions just to fit a default utility.

Hero/Question are dark; WHY NOW is Soft Paper. The independent intro keeps its upper light area permanently light, with the original static blurred gradient to lower navy and actual red/white logo+은. SNS is a separate clipped scene. GAP is navy; Time Select light; Prayer dark; FAQ/form/footer light. Equal choices retain equal visual weight. Original Hero artwork stays static on hover.

## Preserve interaction clocks

- Question: scroll +15% entry; whole first phrase, second starts1200ms later;800ms fades, Desktop/Mobile phrase pitch240/144px.
- Statistics: independent40% card entry,500ms wait,1400ms synchronized count/fill; factual34.3/25.3%, decorative red80/70% with no gray track; replay on page reload.
- Intro:4600ms once on entry,600ms shared hold; upper paper remains visible after word fade/completion.
- SNS:1700ms cards-only,400ms black reading field/text reveal;80 unique photos/base cycle;6/3 alternating columns,21428.571ms linear loop;16 hearts/4 paper planes rise on12000ms cycles.
- GAP:1200ms wait +5784.615ms active warm champagne/ivory motion; slow initial fall, magnetic attachment, contact/spread/hold, ascent/trail, widening borderless face. Preserve geometry, seam-free core and fixed ground.
- Prayer:3900ms cumulative01→02→03; previous lights/copy remain. Highlight centers20/50/80%.
- FAQ:7 items, first open, independent Radix toggles; question17/25.5px, answer15.3/25.5px, native-height animation280ms,24px chevron. Wheel5/10/15, UI260ms/wheel360ms.

Complex SVG/motion/artwork masks stay in custom CSS and existing controllers/JSON. Preserve entry triggering, offscreen/background pause, cleanup, focus and reduced-motion/no-JS readable final states.
