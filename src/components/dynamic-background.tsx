"use client";

import { usePathname } from "next/navigation";
import type { WowClassSlug } from "@/config/wow/classes";
import { useHoverSlug } from "./wow/hover-provider";

export default function DynamicBackground() {
  const hoverSlug = useHoverSlug();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const classSlug = (segments[0] as WowClassSlug | undefined) ?? null;
  const specSlug = segments[1] ?? null;
  const isSpecPage = classSlug && specSlug && segments[2] === "pvp";

  const activeSlug = hoverSlug ?? classSlug;
  const background = activeSlug ? `var(--color-class-${activeSlug})` : "oklch(0.7 0.15 340)";

  return (
    <>
      {/* Class color — top center blob */}
      <div
        className="fixed left-1/2 -translate-x-1/2 -top-[40vw] w-[90vw] h-[50vw] rounded-full filter blur-3xl opacity-15 animate-blob animation-delay-6000 pointer-events-none overflow-hidden transition-all duration-700 ease-in-out"
        style={{ zIndex: -1, background }}
      />
      {/* Spec color — bottom center gradient (only on spec pages) */}
      {isSpecPage && (
        <div
          className={`fixed inset-x-0 bottom-0 h-96 pointer-events-none transition-all duration-700 spec-${classSlug}-${specSlug}`}
          style={{
            zIndex: -1,
            backgroundImage: "linear-gradient(to top, oklch(from var(--spec-color) l c h / 0.18), transparent)",
          }}
        />
      )}
    </>
  );
}
