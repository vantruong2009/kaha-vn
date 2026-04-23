/**
 * Shared: locate WP export XML under docs/migration-inputs/.
 */
import fs from "node:fs";
import path from "node:path";

export const XML_CANDIDATES = [
  "wordpress.xml",
  "kaha.wordpress.xml",
  "export.xml",
];

export function migrationInputsDir(root = path.join(import.meta.dirname, "..")) {
  return path.join(root, "docs/migration-inputs");
}

export function existsReadable(p) {
  try {
    fs.accessSync(p, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

/** First matching file path, or null. */
export function resolveMigrationXml(root = path.join(import.meta.dirname, "..")) {
  const dir = migrationInputsDir(root);
  for (const f of XML_CANDIDATES) {
    const p = path.join(dir, f);
    if (existsReadable(p)) return p;
  }
  return null;
}
