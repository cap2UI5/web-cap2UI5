// Shared path constants for the build scripts.
//
// CAP_DIR points at the CAP project inside the mirrored upstream snapshot.
// Since the cap2UI5 repo split, the deployable app IS the repo root (with
// the framework vendored at core/), so CAP_DIR equals the snapshot root.
// mirror.mjs populates it; everything else reads from it.

import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));
export const INPUT_DIR = path.join(ROOT_DIR, "input", "cap2UI5");
export const CAP_DIR = INPUT_DIR;
export const DIST_DIR = path.join(ROOT_DIR, "dist");
