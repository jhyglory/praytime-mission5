import { ChooseScreen, PauseScreen, PrayScreen, TimeScreen } from "./app-screens";

export type PreviewStep = "pause" | "pray" | "choose" | "time";
const screens = { pause: PauseScreen, pray: PrayScreen, choose: ChooseScreen, time: TimeScreen };
const descriptions = {
  pause: "PrayTime PAUSE 화면. SNS를 열기 전에 잠깐 멈추고 기도를 시작합니다.",
  pray: "PrayTime PRAY 화면. 기도문을 읽으며 마음을 돌아봅니다.",
  choose: "PrayTime CHOOSE 화면. 지금 돌아가기와 필요한 시간만 사용하기를 동등하게 선택합니다.",
  time: "PrayTime 시간 선택 화면. 5분, 10분, 15분 중 10분이 선택된 예시입니다.",
};

export function AppPreview({ step, hero = false, theme = "dark" }: { step: PreviewStep; hero?: boolean; theme?: "light" | "dark" }) {
  const Screen = screens[step];
  return (
    <div className={`app-preview${hero ? " app-preview--hero" : ""}`} role="img" aria-label={descriptions[step]} data-theme={theme}>
      <div className="preview-scaler" aria-hidden="true"><Screen /></div>
    </div>
  );
}
