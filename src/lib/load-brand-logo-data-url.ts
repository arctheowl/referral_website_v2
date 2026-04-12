import { readFile } from "node:fs/promises";
import { join } from "node:path";

const LOGO_PATH = join(process.cwd(), "public", "MustardSeed_Primary-Logo.png");

/** Data URL for Mustard Seed logo, or null if the file is missing. */
export async function loadBrandLogoDataUrl(): Promise<string | null> {
  try {
    const buf = await readFile(LOGO_PATH);
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}
