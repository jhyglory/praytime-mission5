import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import manifest from "../docs/evidence/prototype-correction/assets.json";
import columns from "../src/components/landing/prototype-columns.json";
import motion from "../src/components/landing/card-intro-motion.json";

const canonicalSources = Array.from({ length: 80 }, (_, index) =>
  `/assets/prototype-cards/pt_${String(index + 1).padStart(3, "0")}.jpg`,
);
const expectedSlots: Record<number, string[]> = {
  0: ["photo"],
  1: ["video"],
  2: [],
  3: [],
  4: ["collection0", "collection1", "collection2"],
  5: [],
};
const variants = [
  { name: "desktop", columnCount: 6, cardsPerColumn: 24, sceneHeight: 760 },
  { name: "mobile", columnCount: 3, cardsPerColumn: 36, sceneHeight: 680 },
] as const;

function translateY(frame: unknown) {
  const transform = (frame as { transform?: string }).transform;
  const match = /^translate\(0px, (-?\d+(?:\.\d+)?)px\)$/.exec(transform ?? "");
  if (!match) throw new Error(`Unexpected column transform: ${transform}`);
  return Number(match[1]);
}

function expectWithinTolerance(actual: number, expected: number, context: string) {
  expect(Math.abs(actual - expected), context).toBeLessThan(0.01);
}

describe("SNS photo assignment", () => {
  it("keeps all 80 public originals identical to the committed Figma asset manifest", () => {
    expect(manifest.assets.map(asset => asset.src).sort()).toEqual(canonicalSources);
    expect(readdirSync(new URL("../public/assets/prototype-cards/", import.meta.url)).sort())
      .toEqual(canonicalSources.map(src => src.split("/").at(-1)));

    const hashes = manifest.assets.map(asset => {
      const bytes = readFileSync(new URL(`../public${asset.src}`, import.meta.url));
      const sha256 = createHash("sha256").update(bytes).digest("hex");
      expect({
        bytes: bytes.length,
        sha1: createHash("sha1").update(bytes).digest("hex"),
        sha256,
      }, asset.src).toEqual({ bytes: asset.bytes, sha1: asset.imageHash, sha256: asset.sha256 });
      return sha256;
    });
    // Distinct filenames alone would not catch a repeated photo saved twice.
    expect(new Set(hashes).size).toBe(canonicalSources.length);
  });

  for (const variant of variants) {
    describe(variant.name, () => {
      it("assigns each canonical photo once across all columns, including collection slots", () => {
        const cards = columns[variant.name].flatMap(column => column.cards);
        // Exact sorted membership also rejects missing, extra and repeated photos.
        expect(cards.flatMap(card => card.images.map(image => image.src)).sort())
          .toEqual(canonicalSources);
        for (const card of cards) {
          // Collection slots map to left-top, right-top and left-bottom images.
          expect(card.images.map(image => image.slot), card.id).toEqual(expectedSlots[card.kind]);
        }
      });

      it("keeps seamless track copies too far apart to show the same photo together", () => {
        const viewportColumns = columns[variant.name];
        expect(viewportColumns).toHaveLength(variant.columnCount);
        for (const column of viewportColumns) {
          expect(column.cards, column.id).toHaveLength(variant.cardsPerColumn);
          expectWithinTolerance(column.height, 2 * column.cycleHeight, column.id);
          // Two copies cover the scene for a continuous 0 → -cycleHeight run.
          expect(column.y, column.id).toBeLessThanOrEqual(0);
          expect(column.y + column.cycleHeight, column.id).toBeGreaterThanOrEqual(variant.sceneHeight);
          const tallestCard = Math.max(...column.cards.map(card => card.height));
          // At any translation, duplicate card rectangles are one cycle apart.
          expect(column.cycleHeight - tallestCard, column.id).toBeGreaterThan(variant.sceneHeight);
          let previousBottom = 0;
          for (const card of column.cards) {
            expect(card.y, card.id).toBeGreaterThanOrEqual(previousBottom);
            previousBottom = card.y + card.height;
          }
          expect(previousBottom, column.id).toBeLessThan(column.cycleHeight);
        }
      });

      it("traverses one base cycle and resets to the same world position in the 12s loop", () => {
        const source = motion[variant.name];
        expect(source.duration).toBe(12000);
        for (const column of columns[variant.name]) {
          const tracks = source.tracks.filter(track => track.nodeId === column.id);
          expect(tracks, column.id).toHaveLength(1);
          const frames = tracks[0].frames;
          const worldPositions = frames.map(frame => column.y + translateY(frame));
          const resetIndices = frames.flatMap((_, index) =>
            index > 0 && worldPositions[index] > worldPositions[index - 1] ? [index] : [],
          );
          expect(resetIndices, column.id).toHaveLength(1);
          const resetIndex = resetIndices[0];
          expectWithinTolerance(worldPositions[resetIndex - 1], -column.cycleHeight, column.id);
          expectWithinTolerance(worldPositions[resetIndex], 0, column.id);
          expectWithinTolerance(worldPositions[0], column.y, column.id);
          expectWithinTolerance(worldPositions.at(-1)!, worldPositions[0], column.id);
          expect(frames[0].offset, column.id).toBe(0);
          expect(frames.at(-1)!.offset, column.id).toBe(1);
          for (let index = 0; index < frames.length; index += 1) {
            expect(frames[index].easing, column.id).toBe("linear");
            if (index > 0) expect(frames[index].offset, column.id).toBeGreaterThan(frames[index - 1].offset);
          }
        }
      });
    });
  }
});
