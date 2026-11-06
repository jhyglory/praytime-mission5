type GapLightDividerProps = {
  variant: "choice" | "pause" | "pray" | "choose";
  className?: string;
};

// The light profiles differ by role in Figma; both choices use one profile.
// Each SVG includes its own blur padding and keeps its native dimensions.
export function GapLightDivider({ variant, className = "" }: GapLightDividerProps) {
  const desktop = variant === "choice"
    ? { bloom: { width: 256, height: 60 }, haze: { width: 376, height: 100 } }
    : { bloom: { width: 242.08, height: 60 }, haze: { width: 350.4, height: 100 } };

  return <span className={`prayer-light-divider prayer-light-divider--${variant} ${className}`.trim()} aria-hidden="true">
    <span className="prayer-light-divider__highlight" />
    <span className="prayer-light-divider__near-halo" />
    {(["bloom", "haze"] as const).map(layer => <picture key={layer} className={`prayer-light-divider__${layer}`}>
      <source media="(width < 768px)" srcSet={`/assets/landing-mobile-${variant}-${layer}.svg`} width={layer === "bloom" ? 181 : 266} height={layer === "bloom" ? 56 : 88} />
      <img src={`/assets/landing-desktop-${variant}-${layer}.svg`} alt="" width={desktop[layer].width} height={desktop[layer].height} />
    </picture>)}
    <span className="prayer-light-divider__line" />
  </span>;
}
