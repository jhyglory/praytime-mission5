"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GapLightMotion, type GapLightMotionHandle, type GapLightPlaybackState } from "@/components/motion/gap-light-motion";
import { GAP_LIGHT_DURATION, GAP_LIGHT_TIMING } from "@/components/motion/gap-light-timeline";
import styles from "./gap-light-preview.module.css";

export function GapLightPreview() {
  const player = useRef<GapLightMotionHandle>(null);
  const slider = useRef<HTMLInputElement>(null);
  const currentTime = useRef<HTMLOutputElement>(null);
  const [state, setState] = useState<GapLightPlaybackState>("idle");
  const seconds = (time: number) => (time / 1000).toFixed(2);
  const reduced = state === "reduced";
  const canPauseOrResume = state === "playing" || state === "paused";
  const onProgress = useCallback((timeMs: number) => {
    const seconds = (timeMs / 1000).toFixed(2);
    if (slider.current) {
      slider.current.value = String(timeMs);
      slider.current.setAttribute("aria-valuetext", `${seconds}초`);
    }
    if (currentTime.current) currentTime.current.textContent = seconds;
  }, []);
  const status = {
    idle: "재생 준비",
    playing: "재생 중",
    paused: "일시정지",
    complete: "재생 완료",
    still: "최종 정지 모습",
    reduced: "모션 줄이기 · 최종 모습",
  }[state];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>LOCAL MOTION PREVIEW</p>
        <h1 className={styles.heading}>빛의 틈 · 모션 미리보기</h1>
        <p className={styles.introduction}>새 시안의 밝은 아이보리 발광면을 기준으로 조정한 모션입니다. 랜딩페이지와 같은 모션을 재생·검수하는 독립 미리보기입니다.</p>
      </header>

      <div className={styles.layout}>
        <section className={styles.stage} aria-label="빛의 틈 모션 표시 영역">
          <GapLightMotion ref={player} className={styles.motion} onProgress={onProgress} onStateChange={setState} />
        </section>

        <aside className={styles.notes} aria-label="재생 제어와 모션 기준">
          <div className={styles.controls} aria-label="모션 재생 제어">
            <Button type="button" className={styles.control} onClick={() => player.current?.replay()}>
              처음부터 다시 재생
            </Button>
            <Button type="button" variant="secondary" className={styles.control} disabled={!canPauseOrResume || reduced} onClick={() => state === "playing" ? player.current?.pause() : player.current?.resume()}>
              {state === "playing" ? "일시정지" : "재개"}
            </Button>
            <Button type="button" variant="secondary" className={styles.control} aria-pressed={state === "still"} onClick={() => player.current?.showFinal()}>
              최종 정지 모습 보기
            </Button>
          </div>
          <div className={styles.scrubber}>
            <div className={styles.scrubberHeading}>
              <label htmlFor="gap-preview-seek">타임라인</label>
              <span className={styles.time}><output ref={currentTime} htmlFor="gap-preview-seek" aria-live="off">0.00</output> / {(GAP_LIGHT_DURATION / 1000).toFixed(2)}초</span>
            </div>
            <input ref={slider} id="gap-preview-seek" className={styles.range} type="range" min="0" max={GAP_LIGHT_DURATION} step="any" defaultValue="0" aria-valuetext="0.00초" aria-describedby="gap-preview-seek-help" disabled={reduced} onPointerDown={() => player.current?.pause()} onInput={event => player.current?.seek(Number(event.currentTarget.value))} onKeyDown={event => {
              const steps: Record<string, number | undefined> = { ArrowLeft: -10, ArrowDown: -10, ArrowRight: 10, ArrowUp: 10, PageDown: -100, PageUp: 100 };
              const delta = steps[event.key];
              const time = event.key === "Home" ? 0 : event.key === "End" ? GAP_LIGHT_DURATION : delta === undefined ? undefined : Number(event.currentTarget.value) + delta;
              if (time === undefined) return;
              event.preventDefault();
              player.current?.seek(time);
            }} />
            <p id="gap-preview-seek-help" className={styles.seekHelp}>슬라이더를 움직이면 해당 시점에 정지합니다. 재개하면 그 순간부터 이어집니다.</p>
          </div>
          <p className={styles.status} role="status" aria-live="polite">{status}</p>
          <p className={styles.description}>약 {seconds(GAP_LIGHT_DURATION)}초 동안 한 번 재생한 뒤 최종 모습을 유지합니다. 기기의 모션 줄이기 설정에서는 움직임 없이 최종 모습을 표시합니다.</p>

          <section className={styles.noteSection} aria-labelledby="gap-preview-timeline">
            <h2 id="gap-preview-timeline" className={styles.subheading}>재생 순서</h2>
            <ol className={styles.timeline}>
              <li><span>0–{seconds(GAP_LIGHT_TIMING.darkEnd)}초</span>네이비 배경만 보이는 어둠</li>
              <li><span>{seconds(GAP_LIGHT_TIMING.darkEnd)}–{seconds(GAP_LIGHT_TIMING.fallEnd)}초</span>직선 빛이 기존의0.7배 속도로 완만하게 하강</li>
              <li><span>{seconds(GAP_LIGHT_TIMING.fallEnd)}초부터</span>바닥에 닿자마자 상승하며 원형 광채도 동시에 확산</li>
              <li><span>{seconds(GAP_LIGHT_TIMING.riseStart)}–{seconds(GAP_LIGHT_TIMING.riseEnd)}초</span>같은 빛이 기다리지 않고 올라가며 뒤에 틈을 남김</li>
              <li><span>{seconds(GAP_LIGHT_TIMING.riseEnd)}–{seconds(GAP_LIGHT_TIMING.openEnd)}초</span>테두리 없이 내부가 밝은 직사각형으로 열림</li>
              <li><span>{seconds(GAP_LIGHT_TIMING.openEnd)}–{seconds(GAP_LIGHT_DURATION)}초</span>바닥과 주변 광채가 정착</li>
            </ol>
          </section>

          <section className={styles.noteSection} aria-labelledby="gap-preview-reference">
            <h2 id="gap-preview-reference" className={styles.subheading}>빛의 표현</h2>
            <dl className={styles.geometry}>
              <div><dt>최종 비율</dt><dd>새 첨부 시안 기준</dd></div>
              <div><dt>중심</dt><dd>밝고 깨끗한 아이보리 화이트</dd></div>
              <div><dt>발광면</dt><dd>테두리 없는 직사각형</dd></div>
              <div><dt>바닥</dt><dd>속이 채워진 부드러운 광채</dd></div>
              <div><dt>주변</dt><dd>네이비로 서서히 감쇠하는 잔광</dd></div>
            </dl>
          </section>
          <p className={styles.localNotice}>로컬 검수 전용 · 미리보기 제어 화면은 production에서 제공하지 않습니다.</p>
        </aside>
      </div>
    </main>
  );
}
