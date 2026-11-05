# PrayTime · Mission 5 Landing Implementation Specification

## 1. Figma Authority

File key:

`J8iLsfruyMwVCakXsSJPq4`

Final implementation nodes:

- Desktop: `933:3`
- Mobile: `933:4`
- Developer Handoff: `933:5`

Supporting sources:

- Final Brand System: `882:3`
- Signature Object B Refinement: `896:14`
- Pause Mark UI patterns: `906:3`
- Puzz Dark Spatial Render: `834:48`

## 2. Required Final Section Order

Final 933:3 / 933:4 supersede the former composition. Do not invent or reorder sections.

1. HERO — full bleed artwork / transparent overlay header
2. ONE QUESTION
3. WHY NOW — 34.3% / 25.3%, Ink + proportional red gauges
4. THE GAP
5. TIME SELECT — exact supplied 10-minute mockup
6. PRAYER BEFORE CHOICE — PAUSE / PRAY / CHOOSE, one Puzz
7. FAQ — approved five answers, first item open
8. BETA SIGNUP — unchanged eight form groups, Light

Footer follows. Copy and Desktop/Mobile line breaks come from final design context.

## 3. Anchors

- `#how-it-works`
- `#faq`
- `#beta-signup`

Hero primary CTA:

**베타 사전신청** → `#beta-signup`

Hero secondary CTA:

**작동 방식 보기** → `#how-it-works`

## 4. Hero Copy

Eyebrow:

**기독교 기반 디지털 웰니스**

Headline:

**무심코 SNS를 여는 순간,<br />
기도로 멈추고 다시 선택하세요.**

Description:

**SNS를 열기 전 잠깐 기도하고, 지금도 필요한지 돌아보세요.<br />
필요하지 않으면 돌아가고, 필요하면 5 · 10 · 15분을 정해 사용합니다.<br />
시간이 끝나면 다시 제한됩니다.**

Microcopy:

**기도를 마쳐도 SNS가 자동으로 열리지는 않습니다.**

## 5. Hero Visual

Use:

- Offset Interval · B Refinement v1.1
- actual approved app preview

The Hero must show both brand world and actual product.

## 6. App Preview Theme Toggle

This is **not** a site-wide theme toggle.

Only the app preview changes between Light / Dark.

## 7. Problem Section

Use Quiet Edit structure.

Desktop: 4 behavior moments across.

Mobile: stack vertically.

Prefer typography, spacing, and dividers over card stacks.

## 8. The Gap

Primary idea:

**충동과 행동 사이, 기도가 머물 작은 틈을 만듭니다.**

Use Pause Mark / Threshold identity.

Show two valid outcomes equally:

- return
- intentional use

## 9. How It Works

Anchor: `#how-it-works`

Required story:

### Step 01 · PAUSE
Use approved Threshold pattern.

### Step 02 · PRAY
Use quiet typography and low Prayer Light.

### Step 03 · CHOOSE
Use approved Clear Choice pattern.

Question:

**지금 이 앱이 꼭 필요한가요?**

Choices:

**필요하지 않아요**<br />
지금은 돌아가기

**필요해요**<br />
5 · 10 · 15분 선택

### Step 04 · USE / RETURN
Use 5 / 10 / 15 minutes if needed.
At time end, restriction returns.
Additional use requires Prayer / Choice again.

Use only the app previews needed to explain this:

- PAUSE
- PRAY
- CHOOSE
- TIME SELECT

## 10. Expected Outcome & Feedback

The point is intentional choice, not prayer quantity.

Allowed examples:

- 오늘 다시 선택한 횟수
- 기도
- 돌아가기
- 필요한 시간만 사용

No streak, badge, XP, ranking, level, score, or competition.

## 11. Voluntary Prayer

Explain that users may also enter prayer voluntarily.

Keep this concise.

Puzz may appear as a small companion.

## 12. FAQ

Anchor: `#faq`

Keep the approved five FAQ items from Figma.

Implementation may use shadcn Accordion if styled to match Figma.

## 13. Beta Signup

Anchor: `#beta-signup`

Preserve the existing **8 form groups**:

- nickname
- email
- OS
- signup reason
- age range
- target apps
- reduction methods
- required consent

Do not remove groups for implementation convenience.

## 14. Form States

Implement:

- default
- focus
- error
- disabled
- loading
- success
- server error
- duplicate

Client-side success without a server response is not acceptable.

## 15. Real Submission

Before creating a new backend, inspect the repo for:

- existing API endpoint
- database
- Supabase
- Firebase
- Google Sheets / Apps Script
- webhook
- form service

Reuse existing infrastructure where reasonable.

If none exists, implement a clear route-handler / adapter architecture.

Do not fake persistence.

## 16. Privacy

Use the approved consent UI and Privacy link.

Do not invent legal language.

If no real privacy URL exists, report it as an implementation issue.

## 17. Responsive Authority

Desktop: 1440px

Mobile: 393px

Validate at least:

- 1440
- 1280
- 1024
- 768
- 430
- 393
- 375

No horizontal page overflow.

## 18. Required Interactions

- anchor navigation
- beta CTA scroll
- how-it-works scroll
- FAQ interaction
- app-preview Light/Dark toggle
- form validation
- loading/result states

Respect `prefers-reduced-motion`.

## 19. Accessibility

Minimum:

- one H1
- logical heading hierarchy
- semantic sections
- accessible buttons/links
- visible focus state
- proper form labels
- error association
- keyboard navigation
- sufficient contrast
- ~44px+ touch targets
- `aria-live` for form result

## 20. Suggested Technical Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui where useful

## 21. Definition of Done

1. Desktop visually matches Figma closely.
2. Mobile visually matches Figma closely.
3. CTA anchors work.
4. FAQ works.
5. App Preview toggle works.
6. Form validation works.
7. Form sends a real POST request.
8. Success/error states depend on server result.
9. No horizontal overflow.
10. Keyboard focus works.
11. `npm run lint` passes.
12. `npm run build` passes.
13. Deployment is production-ready.

## Final submission stage

Visual freeze ended with final Desktop933:3 / Mobile933:4. The final frames override earlier Hero / app-theme / four-phone composition instructions above. Do not mount the previous Hero Light/Dark toggle or repeated phone previews: final Hero is full-bleed artwork and product behavior is the supplied Time Select mockup. Keep existing interaction code reusable, not visible additions to the final design.

Recheck existing schema; nullable consent fields are already applied. Reuse the adapter and existing DB, no RLS or constraint change. Final QA authorizes one new synthetic record and the same email for duplicate validation; scope reads to QA only. Automated tests stay mocked/disabled.

Finalize README and deployment evidence, commit/push feature branch and open [하영]-미션5 PR against main. Do not merge. Connect GitHub to Vercel and smoke-test the real URL. Keep current policy text until user supplies approved legal copy; report discrepancies rather than writing it.
