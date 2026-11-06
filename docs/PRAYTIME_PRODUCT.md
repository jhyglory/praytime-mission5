# PrayTime · Product Source of Truth

## 1. Product Definition

PrayTime is a Christian digital-wellness product that intervenes at the moment a user tries to open a distracting SNS/short-form app.

It creates a short pause for prayer, asks the user to reconsider whether the app is still needed, and then supports one of two valid choices:

- return without opening the SNS
- intentionally use it for a limited amount of time

The product is **not** designed to punish SNS use, evaluate faith, or force abstinence.

## 2. Core Loop

`PAUSE → PRAY → CHOOSE → USE → RETURN`

Detailed logic:

1. The user attempts to open a managed SNS app.
2. PrayTime interrupts the automatic flow.
3. The user enters a brief prayer moment.
4. Prayer completion does **not** automatically unlock the SNS.
5. The user is asked whether the app is still needed.
6. If not needed, the user returns.
7. If needed, the user selects **5 / 10 / 15 minutes**.
8. The user uses the SNS for the selected time.
9. When time ends, access is restricted again.
10. Additional use requires Prayer / Choice again.

## 3. Core JTBD

When I open SNS automatically without thinking, help me stop for a moment, pray, reassess whether I actually need the app, and deliberately choose either to return or use it for a limited time.

## 4. Primary User

Behavior-based primary audience:

Christian adults who repeatedly fail to control SNS / short-form usage even after trying methods such as:

- app deletion
- iOS Screen Time / Android Digital Wellbeing
- notifications off
- focus modes
- self-imposed time limits
- digital fasting
- blocker apps

Landing communication should focus on this repeated-behavior pattern rather than a narrow age identity.

## 5. Product Success

Success is **not**:

- maximum prayer minutes
- maximum number of prayers
- longest streak
- zero SNS usage
- faith score
- screen-time shame

Success is:

**turning an automatic action into an intentional choice.**

Both outcomes can be valid:

### RETURN
The user realizes the SNS is unnecessary and goes back.

### INTENTIONAL USE
The user still needs the SNS and intentionally chooses 5 / 10 / 15 minutes.

## 6. MVP Promise

Landing may clearly communicate:

- SNS trigger pause
- prayer before the next action
- reconsideration
- return option
- intentional 5 / 10 / 15-minute access
- automatic re-restriction after the selected time
- prayer/rechoice for additional use
- minimal behavior feedback
- voluntary “기도하기” entry

## 7. MVP Exclusions

Do not introduce or promise:

- AI Prayer
- STT prayer analysis
- faith scoring
- Streak
- Prayer Goal
- badges
- levels
- rankings
- community
- gamification
- detailed analytics dashboards
- Premium/paywall/pricing
- B2B features
- unverified effect statistics

## 8. Language Guardrails

Do not write:

- “기도하면 앱이 열린다”
- “기도를 하면 SNS가 자동으로 해제된다”
- “한국어 유일”
- “Christian apps are more effective”
- any unverified efficacy claim
- any copy that implies weak faith, guilt, sin, or failure because the user opened SNS

Preferred framing:

- pause
- pray
- reconsider
- choose
- return
- use intentionally
- begin again

## 9. Voluntary Prayer

PrayTime can also support a voluntary prayer entry from inside the app.

This is a supporting MVP feature, not permission to expand the landing into a full prayer-app feature list.

## 10. Product Principle

PrayTime should not maximize time spent inside PrayTime.

The ideal product helps users create a small space between impulse and action, make a conscious choice, and leave.

## Mission 5 implementation context · 2026-11-06

The approved product definition above is unchanged. This repository implements the introduction and beta signup Landing, not OS-level restriction or prayer execution. The final visual sources are Desktop1088:916 / Mobile1088:1251 and Desktop THE GAP1088:986 (Mobile child1088:1319), superseding the former933/913 frames. The final local visual patch and Figma opacity-loop transition are authorized; redesign, new product behavior and publishing are not. Preserve the equal RETURN / intentional-use choices, existing interactions and seven approved FAQs. Existing Lovable/Supabase beta_signups is reused; signup consent history must reflect the actually published privacy policy. See BACKEND_ARCHITECTURE.md and PRIVACY_AUDIT.md. Production/Preview persistence remains disabled, the privacy guard remains active, and no real INSERT is allowed until privacy notice alignment. Existing applicant data remains untouched. The user must approve the final local diff/check results before commit, push or deployment.

## Release authorization update · 2026-11-06

The user has now approved committing/pushing this final visual + favicon implementation, updating the existing PR #1 and redeploying the existing Vercel project. Earlier pre-approval publishing holds in this stage are satisfied. Keep feature/mission-5-landing, PR #1, main, the privacy guard and disabled persistence. No merge, actual DB INSERT, new DB or custom-domain DNS cutover is authorized.

## Current micro-interaction release scope · 2026-11-06

The final visual/favicon release is complete at `7c77356`. The subsequent micro-interaction patch includes: Hero pointer response, equal GAP anchor interactions (`#hero` / `#how-it-works`, confirmed by the user), active navigation and one-time WHY NOW count-up. Preserve the approved Figma layout/copy, existing transition, shadcn, wheel, form/API and privacy guard. No new dependency. After the diff and passing checks were reported, the user explicitly instructed “재배포해” on 2026-11-06. Commit/push on the existing feature branch, update PR #1 and redeploy the existing Vercel project are now authorized; the earlier local-only hold is satisfied. Merge, main changes, real DB storage and DNS cutover remain forbidden. See [MICRO_INTERACTIONS.md](MICRO_INTERACTIONS.md) for current implementation and fresh checks.

Latest user timing correction: after the deployed-site review, “그래서” was reported too fast. Only the transition reading pace is now overridden:6000ms loop for both viewports, word1050ms full hold, both bridge lines1550ms simultaneous full hold. Original Figma opacity/easing/sequence/layout are preserved. This later feedback supersedes the earlier keep-transition-timing instruction; see MOTION_PLAN.md. Other micro-interactions and release/privacy restrictions remain unchanged.

Latest user-approved WHY NOW presentation: the gray track is removed and each red accent fills to its own displayed maximum34.3 /25.3. Exact visible/accessible percentages and cited source stay unchanged. These decorative count-completion accents do not encode a shared0–100 statistical scale. This explicit approval supersedes the original proportional-gauge styling; other layout/copy/interaction/backend constraints remain intact.
