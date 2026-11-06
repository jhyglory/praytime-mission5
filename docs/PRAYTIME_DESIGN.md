# PrayTime · Final Design & Brand Source of Truth

## 1. World Kernel

World Kernel is frozen.

Core concepts:

- **Noise / Autopilot**: the automatic digital flow
- **The Gap**: the small space between impulse and action
- **Pause Mark `Ⅱ`**: the threshold / everyday identifier
- **Prayer Space**: the short space where the user pauses and prays
- **Prayer Light**: an environmental response, not a reward
- **Puzz**: Companion of the Pause
- **Intentional Choice**: the desired product result

World statement:

**충동과 행동 사이, 기도가 머물 작은 틈을 만듭니다.**

English concept:

**Between impulse and action, make room for prayer.**

## 2. Final Brand Direction

Primary brand direction:

**Quiet Edit**

Core interpretation:

- “다음 행동 앞의 빈 줄”
- visual spacing as a product principle
- editorial clarity
- deliberate rhythm
- intentional gaps
- restrained composition

Quiet Edit is not a magazine aesthetic for its own sake.

It is the visual translation of creating a deliberate pause before the next action.

## 3. Signature Object

Primary signature object:

**Offset Interval · B Refinement v1.1**

Figma source:

- node `896:14`

Meaning:

**Space before action · 행동 전의 틈**

Usage priority:

### HERO / BRAND MOMENT
Allowed prominently:

- Landing Hero
- launch campaign
- brand film
- onboarding cover
- App Store visuals

### MOMENT
Limited:

- Prayer Space transition
- selected brand transition
- special reflective moment

### PRODUCT UI
Very restrained:

Do not repeat it across ordinary app screens, forms, settings, or cards.

The app must still feel like PrayTime without the signature object.

## 4. Secondary Influences

### Still Field
Borrow only:

- low, pooled Prayer Light
- calm environmental depth
- quiet atmosphere

### Second Look
Borrow only:

- product-message clarity
- the question of whether the app is still needed
- reconsideration language

Do not turn these into additional brand directions.

## 5. Puzz

Role:

**Companion of the Pause**

Approved source:

- `Puzz · Dark Spatial Render v1.0`
- Figma node `834:48`

Puzz should feel:

- warm
- calm
- gentle
- non-judgmental
- slightly playful
- restrained

Puzz must not:

- speak for God
- evaluate faith
- tell the user that God is pleased/displeased
- become the visual hero of every screen
- turn PrayTime into a mascot-first app

Use Puzz sparingly in prayer/guidance/companion contexts.

## 6. Adopted Pause Mark UI Patterns

Source board:

- Figma node `906:3`

Adopted:

### 01 · Threshold
Use in PAUSE / entry moment.

Pause Mark is centered and represents entry into Prayer Space.

### 03 · Clear Choice
Use in CHOOSE.

Pause identity appears above the question while the two choices remain visually equal.

Not adopted:

### 02 · Quiet Reading
Do not force a strong glowing Pause Mark next to prayer reading content.

Prayer reading should rely on typography and quiet atmosphere.

## 7. Visual Pillars

### SPACE
Use deliberate negative space and intervals.

### LIGHT
Light indicates focus and atmosphere.

### EDITORIAL CLARITY
Typography and hierarchy explain the product before decoration.

### MATERIAL
Use dimensional material selectively.

### HUMAN COMPANION
Use Puzz only where emotional warmth helps.

## 8. Color Roles

Core roles:

- **Night Canvas**: main dark space
- **Raised Surface**: functional separation
- **Warm White**: main text / clarity
- **Prayer Accent**: calm/focus/atmosphere
- **Signal Red**: decisive action / pause identity

Signal Red should not dominate whole sections.

Prayer Accent should not become a large pastel theme.

## 9. Material Hierarchy

### Level 0
Flat dark canvas.

### Level 1
Raised dark surface.

### Level 2
Controlled reflection / rim / subtle dimensional treatment.

### Level 3
Signature Object material.

Level 3 is for brand moments, not normal app cards.

## 10. Lighting Hierarchy

### BASE
Utility areas, forms, FAQ, settings-like surfaces. Almost flat.

### FOCUS
Prayer, choice, key action. Subtle atmosphere and depth.

### HERO
Landing Hero / brand moment. Signature object and stronger atmospheric treatment allowed.

## 11. Anti-patterns

Avoid:

- generic dark SaaS
- neon cyberpunk
- gaming HUD
- giant gradients everywhere
- excessive glassmorphism
- card stacks
- borders everywhere
- red backgrounds everywhere
- giant Puzz
- church-app clichés
- floating crosses
- stars / planets / galaxies
- literal “space” imagery

The desired sense of space comes from:

**depth + light + interval + typography**

## Final visual authority

Final visual sources are Desktop `1088:916` and Mobile `1088:1251`, using each for its corresponding viewport. THE GAP is Desktop `1088:986` / Mobile child `1088:1319`. These supersede the933/913 Landing frames; Handoff `933:5` is historical reference only. FAQ remains Light Background + seven questions with Ink text and the approved chevron. Do not edit Figma or reopen branding decisions.

Hero remains full bleed with a transparent overlay header. All Light section backgrounds use Soft Paper **#F5F2F7**. THE GAP is Dark, Time Select Light, Voluntary Prayer Dark, FAQ Light and form Light. Preserve exact viewport typography, line-height and section spacing, including the phone silhouette mask around the supplied 10-minute Time Select image. Data numbers are Ink with proportional red gauges. Equal Choice must keep both outcomes at equal visual weight. No purple CTA/type/data or new visual exploration; Puzz and signature object use the provided originals.

The user's explicit final lighting instruction takes precedence over stale exported effects: only the Vertical Slit emits light in THE GAP/transition. Omit floor reflection, surrounding bloom, horizontal glow and the associated broad ambient/aperture layers. This is a requested removal, not a new design direction. Preserve the separate final Prayer section divider treatment and original companion artwork shown in its frame.

The final visual patch builds on the existing section-file extraction, seven-item FAQ and actual shadcn/ui Accordion/Button adoption. Accordion retains the copy/Light/Ink/chevron/ARIA structure; Button retains native button/link semantics and disabled/submitting states. shadcn's generic theme is not the visual authority.

WHY NOW → THE GAP is final; **PENDING DESIGN has ended**. Figma motion context defines Desktop2800ms and Mobile2410ms looping opacity timelines. SignatureTransition uses native Web Animations API for twelve retained tracks, pauses offscreen/in the background, and supplies a reduced-motion/static fallback. Five reflection/ambient/aperture tracks per viewport are omitted under the user's removal instruction. There is no sticky/scroll-progress behavior, scroll hijacking, WebGL or new motion dependency. See MOTION_PLAN.md. The patch remains local pending the user's approval; no commit/push/deployment.

## Release authorization update · 2026-11-06

The user has now approved committing/pushing this final visual + favicon implementation, updating the existing PR #1 and redeploying the existing Vercel project. Earlier pre-approval publishing holds in this stage are satisfied. Keep feature/mission-5-landing, PR #1, main, the privacy guard and disabled persistence. No merge, actual DB INSERT, new DB or custom-domain DNS cutover is authorized.

## Current micro-interaction release scope · 2026-11-06

The final visual/favicon release is complete at `7c77356`. The subsequent micro-interaction patch includes: Hero pointer response, equal GAP anchor interactions (`#hero` / `#how-it-works`, confirmed by the user), active navigation and one-time WHY NOW count-up. Preserve the approved Figma layout/copy, existing transition, shadcn, wheel, form/API and privacy guard. No new dependency. After the diff and passing checks were reported, the user explicitly instructed “재배포해” on 2026-11-06. Commit/push on the existing feature branch, update PR #1 and redeploy the existing Vercel project are now authorized; the earlier local-only hold is satisfied. Merge, main changes, real DB storage and DNS cutover remain forbidden. See [MICRO_INTERACTIONS.md](MICRO_INTERACTIONS.md) for current implementation and fresh checks.
