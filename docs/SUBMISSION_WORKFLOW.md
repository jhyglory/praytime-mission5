# Git / PR 제출 준비

프로젝트 / Git root: 이 파일의 상위 상위 디렉터리(`package.json` 위치). 외부 Codex 작업 디렉터리는 Git root가 아닙니다.

- Branch: `feature/mission-5-landing`
- Remote origin: https://github.com/jhyglory/praytime-mission5.git (private)
- 현재 상태: 첫 commit 전, staging 없음, push 없음, PR 없음. 기존 작업을 reset하지 않고 Git을 초기화했습니다.
- 최종 PR 제목: **[하영]-미션5**

`.env*`, node_modules, .next, .vercel, tsbuildinfo, test-results, playwright-report, coverage, Supabase CLI temp, logs는 제외합니다. 안전한 템플릿만 `config/environment.example`에 별도 보관합니다. key 값은 저장소에 넣지 않습니다.

최종 Figma 이후:

1. 최종 visual pass와 체크리스트를 완료합니다.
2. 변경 파일과 secret / generated file 제외 여부를 검토합니다.
3. 첫 PR의 base가 비어 있으므로 main에 기본 제출 안내 문서만 담은 초기 commit을 만들고, feature에 전체 구현을 commit합니다. 미작업 파일을 지우거나 reset하지 말고 `git switch --orphan` 등 작업 트리를 바꾸는 방식도 피합니다. 검토된 temporary index / 별도 worktree로 base를 구성할 수 있습니다.
4. main과 feature를 push하고 base가 main인 PR을 `[하영]-미션5`로 만듭니다. 현재 단계에서 실행하지 않습니다.
5. README에 실제 Vercel URL과 최종 테스트 결과를 기입합니다.

PR 본문 기본 양식은 `.github/pull_request_template.md`입니다. 최종 구현·검증·한계만 작성하고 secret·실제 신청자 데이터를 포함하지 않습니다.
