import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src/app");

const replacements = [
  ["bg-[#22C55E]", "bg-success"],
  ["text-[#22C55E]", "text-success"],
  ["border-[#22C55E]/20", "border-success/20"],
  ["bg-[#22C55E]/5", "bg-success/5"],
  ["bg-[#F59E0B]", "bg-warning"],
  ["border-[#F59E0B]/25", "border-warning/25"],
  ["border-[#F59E0B]/20", "border-warning/20"],
  ["bg-[#FFF7E6]/88", "bg-warning-muted/88"],
  ["bg-[#FFF7E6]", "bg-warning-muted"],
  ["text-[#B45309]", "text-warning-emphasis"],
  ["text-[#92400E]", "text-warning-emphasis"],
  ["bg-[#ECFDF3]", "bg-success-muted"],
  ["text-[#166534]", "text-success-emphasis"],
  ['stroke="#22C55E"', 'stroke="var(--success)"'],
  ['fill="#0084FF"', 'fill="var(--brand)"'],
  ['fill="#22C55E"', 'fill="var(--success)"'],
  ['fill: "#667085"', 'fill: "var(--muted-foreground)"'],
  ['color: "#667085"', 'color: "var(--muted-foreground)"'],
  ["bg-[#98A2B3]", "bg-subtle-foreground"],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, files);
    else if (entry.name.endsWith(".tsx")) files.push(fullPath);
  }
  return files;
}

for (const file of walk(root)) {
  let content = fs.readFileSync(file, "utf8");
  let changed = false;
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to);
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(file, content);
}

console.log("Semantic color migration complete.");
