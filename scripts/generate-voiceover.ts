import "dotenv/config";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { generateVoiceover } from "../src/audio/elevenlabs";
import { SCRIPTS } from "../src/content/scripts";

const ROOT = process.cwd();

async function run() {
  const targets = process.argv.slice(2);
  const entries = Object.entries(SCRIPTS).filter(([id]) =>
    targets.length === 0 ? true : targets.includes(id),
  );

  if (entries.length === 0) {
    console.error(
      `No scripts matched. Available: ${Object.keys(SCRIPTS).join(", ")}`,
    );
    process.exit(1);
  }

  for (const [compositionId, script] of entries) {
    const outDir = join(ROOT, "public", "voiceover", compositionId);
    mkdirSync(outDir, { recursive: true });
    console.log(`\n▶  ${compositionId} (${script.lines.length} lines)`);
    const results = await generateVoiceover(script.lines, {
      outDir,
      defaultVoiceId: script.voice?.voiceId,
      defaultModelId: script.voice?.modelId,
      defaultVoiceSettings: script.voice?.voiceSettings,
    });
    for (const r of results) {
      console.log(
        `   ${r.cached ? "·" : "✓"} ${r.id}${r.cached ? " (cached)" : ""}`,
      );
    }
  }
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
