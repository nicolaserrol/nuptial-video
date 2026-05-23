// Print content atoms (timecoded clips + suggested captions) for a
// composition. Useful for handing off to a downstream social calendar
// or for slicing a single render into multiple platform-ready clips.
//
// Usage: npm run atoms <CompositionId>

import "dotenv/config";
import { SCRIPTS } from "../src/content/scripts";
import { atomsFromScriptOnDisk } from "../src/utils/repurpose";

const FPS = 30;

async function run() {
  const compositionId = process.argv[2];
  if (!compositionId) {
    console.error(
      `Usage: npm run atoms <CompositionId>\nAvailable: ${Object.keys(SCRIPTS).join(", ")}`,
    );
    process.exit(1);
  }
  const script = SCRIPTS[compositionId];
  if (!script) {
    console.error(`No script registered for "${compositionId}".`);
    process.exit(1);
  }
  const atoms = await atomsFromScriptOnDisk(script, compositionId, FPS);
  console.log(JSON.stringify({ compositionId, fps: FPS, atoms }, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
