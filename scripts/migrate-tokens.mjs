import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src/app");

const replacements = [
  ["bg-[rgba(0,132,255,0.9)]", "bg-brand/90"],
  ["bg-[rgba(0,132,255,0.8)]", "bg-brand/80"],
  ["hover:bg-[#0074E0]", "hover:bg-brand-hover"],
  ["focus-within:border-[#0084FF]", "focus-within:border-brand"],
  ["focus-within:ring-[#0084FF]/10", "focus-within:ring-brand/10"],
  ["focus-visible:ring-[#0084FF]/25", "focus-visible:ring-brand/25"],
  ["focus-visible:ring-[#0084FF]/20", "focus-visible:ring-brand/20"],
  ["focus:border-[#0084FF]", "focus:border-brand"],
  ["border-[#0084FF]/30", "border-brand/30"],
  ["border-[#0084FF]/20", "border-brand/20"],
  ["border-[#0084FF]/15", "border-brand/15"],
  ["bg-[#0084FF]/10", "bg-brand/10"],
  ["text-[#0084FF]", "text-brand"],
  ["bg-[#0084FF]", "bg-brand"],
  ["border-[#0084FF]", "border-brand"],
  ["ring-[#0084FF]", "ring-brand"],
  ["text-[#080B12]", "text-ink"],
  ["text-[#050814]", "text-foreground"],
  ["text-[#101828]", "text-foreground-body"],
  ["text-[#667085]", "text-muted-foreground"],
  ["text-[#94A3B8]", "text-subtle-foreground"],
  ["text-[#344054]", "text-label"],
  ["bg-[#F8F9FC]", "bg-surface"],
  ["bg-[#F1F3F6]", "bg-secondary"],
  ["bg-[#050814]", "bg-primary"],
  ["hover:bg-[#121724]", "hover:bg-primary-hover"],
  ["text-[#050814]", "text-foreground"],
  ["border-black/10", "border-border"],
  ["border-black/15", "border-border"],
  ["border-black/20", "border-border"],
  ["hover:border-black/15", "hover:border-border"],
  ["hover:border-black/20", "hover:border-border"],
  [" focus-within:ring-2 focus-within:ring-brand/10", " focus-within:ring-2 focus-within:ring-brand/10"],
];

const fontStylePattern = /\s*style=\{\{\s*fontFamily:\s*"'Fustat',\s*sans-serif"\s*\}\}/g;

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

  if (fontStylePattern.test(content)) {
    content = content.replace(fontStylePattern, "");
    content = content.replace(
      /className="([^"]*)"/g,
      (match, classes) => {
        if (classes.includes("font-display")) return match;
        if (
          /text-\[(42|54|58|75|48|40|22|20)px\]/.test(classes) ||
          classes.includes("font-bold") && classes.includes("tracking-[-")
        ) {
          return `className="${classes} font-display"`;
        }
        return match;
      },
    );
    changed = true;
  }

  if (changed) fs.writeFileSync(file, content);
}

console.log("Token migration complete.");
