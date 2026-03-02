/**
 * Syncs icons from the DuBois design system source to this project's format.
 *
 * Source format: uses `Icon` wrapper, default export, `1em` size
 * Target format: standalone forwardRef SVG, named export, `size` prop
 */

import fs from "fs";
import path from "path";

const SRC_DIR = "/Users/joy/universe/design-system/src/design-system/Icon/__generated/icons";
const OUT_DIR = "/Users/joy/Git/db-starter-kit-1/src/components/icons";

const sourceFiles = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith(".tsx"));

let added = 0;
let updated = 0;
let skipped = 0;

for (const file of sourceFiles) {
  const iconName = file.replace(".tsx", ""); // e.g. "AppIcon"
  const srcPath = path.join(SRC_DIR, file);
  const outPath = path.join(OUT_DIR, file);

  const src = fs.readFileSync(srcPath, "utf-8");

  // Extract the SVG element from the Svg* function body
  const svgMatch = src.match(/<svg[\s\S]*?<\/svg>/);
  if (!svgMatch) {
    console.warn(`⚠  Skipping ${file} — no <svg> found`);
    skipped++;
    continue;
  }

  let svgContent = svgMatch[0];

  // Extract viewBox (default "0 0 16 16")
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 16 16";

  // Extract inner SVG content (children only, not the <svg> tag itself)
  const innerMatch = svgContent.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  const innerSVG = innerMatch ? innerMatch[1].trim() : "";

  if (!innerSVG) {
    console.warn(`⚠  Skipping ${file} — empty SVG body`);
    skipped++;
    continue;
  }

  const output = `import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ${iconName}Props extends React.SVGProps<SVGSVGElement> {
  /** Icon size in pixels. Default: 16 (DuBois standard). */
  size?: number | string;
  className?: string;
  /** Accessible label. When set, icon gets role="img". */
  ariaLabel?: string;
}

export const ${iconName} = forwardRef<SVGSVGElement, ${iconName}Props>(
  ({ size = 16, className, ariaLabel, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="${viewBox}"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : undefined}
      {...props}
    >
${innerSVG.split("\n").map((l) => `      ${l}`).join("\n")}
    </svg>
  )
);
${iconName}.displayName = "${iconName}";
`;

  const exists = fs.existsSync(outPath);
  fs.writeFileSync(outPath, output, "utf-8");

  if (exists) {
    updated++;
  } else {
    added++;
    console.log(`+ ${iconName}`);
  }
}

// Regenerate index.ts
const allIcons = fs
  .readdirSync(OUT_DIR)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => f.replace(".tsx", ""))
  .sort();

const indexContent =
  allIcons.map((name) => `export { ${name} } from "./${name}";`).join("\n") + "\n";

fs.writeFileSync(path.join(OUT_DIR, "index.ts"), indexContent, "utf-8");

console.log(`\n✅ Done: ${added} added, ${updated} updated, ${skipped} skipped`);
console.log(`📦 index.ts regenerated with ${allIcons.length} icons`);
