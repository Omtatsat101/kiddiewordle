#!/usr/bin/env node
/**
 * KiddieWordle CI smoke test.
 *
 * 1. Syntax-checks every .js under data/ via `node --check`.
 * 2. Asserts core structural markers exist in index.html.
 * 3. Asserts index.html is non-trivially sized (> 50 KB).
 *
 * Exits non-zero with a clear message on any failure.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.error(`FAIL: ${msg}`);
};
const ok = (msg) => console.log(`ok:   ${msg}`);

// --- 1. node --check every .js under data/ -------------------------------
const dataDir = path.join(root, "data");
const jsFiles = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".js")) jsFiles.push(full);
  }
};
try {
  walk(dataDir);
} catch (err) {
  fail(`cannot read data/ directory: ${err.message}`);
}
if (jsFiles.length === 0 && failures === 0) {
  fail("no .js files found under data/ — expected at least one word list");
}
for (const file of jsFiles) {
  const rel = path.relative(root, file);
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
    ok(`syntax OK: ${rel}`);
  } catch (err) {
    const detail = err.stderr ? err.stderr.toString().trim() : err.message;
    fail(`syntax error in ${rel}\n${detail}`);
  }
}

// --- 2 + 3. index.html size and structural markers ------------------------
const indexPath = path.join(root, "index.html");
let html = "";
try {
  html = readFileSync(indexPath, "utf8");
} catch (err) {
  fail(`cannot read index.html: ${err.message}`);
}

if (html) {
  const sizeBytes = statSync(indexPath).size;
  const MIN_BYTES = 50 * 1024;
  if (sizeBytes > MIN_BYTES) {
    ok(`index.html size ${sizeBytes} bytes (> ${MIN_BYTES} minimum)`);
  } else {
    fail(
      `index.html is only ${sizeBytes} bytes — expected > ${MIN_BYTES} (50 KB). Truncated or gutted build?`
    );
  }

  // Structural ids that must exist on main — the game shell.
  const markers = [
    'id="setupScreen"',
    'id="board"',
    'id="keyboard"',
    'id="playBtn"',
    'id="gameHeader"',
  ];
  for (const marker of markers) {
    if (html.includes(marker)) {
      ok(`marker present: ${marker}`);
    } else {
      fail(`missing structural marker in index.html: ${marker}`);
    }
  }
}

// --- Verdict ---------------------------------------------------------------
if (failures > 0) {
  console.error(`\nci-smoke: ${failures} failure(s)`);
  process.exit(1);
}
console.log("\nci-smoke: all checks passed");
