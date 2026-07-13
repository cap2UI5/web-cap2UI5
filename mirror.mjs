// Snapshots the upstream cap2UI5 repo into input/cap2UI5/ — the build's
// only external input.
//
//   node mirror.mjs                          # shallow-clone from GitHub
//   MIRROR_SOURCE=/path/to/cap2UI5 node …    # copy a local checkout instead
//
// Since the cap2UI5 repo split, the repo root IS the deployable app (with
// the framework vendored at core/), so the whole checkout is mirrored
// (minus .git / node_modules / .github). UPSTREAM_COMMIT records the
// mirrored revision for traceability (same convention as the run/input
// snapshots in the builder repos).

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { INPUT_DIR } from "./paths.mjs";

const UPSTREAM = "https://github.com/cap2UI5/cap2UI5";

function copyProject(fromRepo, commit) {
  fs.rmSync(INPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(INPUT_DIR, { recursive: true });
  for (const entry of fs.readdirSync(fromRepo)) {
    if (entry === ".git" || entry === ".github" || entry === "node_modules") continue;
    fs.cpSync(path.join(fromRepo, entry), path.join(INPUT_DIR, entry), {
      recursive: true,
      filter: (src) => !src.includes(`${path.sep}node_modules`) && !src.includes(`${path.sep}.git`),
    });
  }
  fs.writeFileSync(path.join(INPUT_DIR, "UPSTREAM_COMMIT"), `${commit}\n`);
  console.log(`mirror: cap2UI5@${commit.slice(0, 12)} → input/cap2UI5/`);
}

const local = process.env.MIRROR_SOURCE;
if (local) {
  const commit = execFileSync("git", ["-C", local, "rev-parse", "HEAD"]).toString().trim();
  copyProject(local, commit);
} else {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cap2ui5-mirror-"));
  try {
    execFileSync("git", ["clone", "--depth", "1", UPSTREAM, tmp], { stdio: "inherit" });
    const commit = execFileSync("git", ["-C", tmp, "rev-parse", "HEAD"]).toString().trim();
    copyProject(tmp, commit);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}
