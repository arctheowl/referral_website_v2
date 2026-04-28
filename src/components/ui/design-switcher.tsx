"use client";

import { useDesign } from "@/providers/design-provider";

const designs: { id: "mintlify" | "ibm"; label: string }[] = [
  { id: "mintlify", label: "Mintlify" },
  { id: "ibm",      label: "IBM Carbon" },
];

export function DesignSwitcher() {
  const { design, setDesign } = useDesign();

  return (
    /*
      Always rendered in IBM dark chrome so it reads the same regardless
      of which design or light/dark theme is currently active.
      z-[60] sits above the sticky header (z-50).
    */
    <div className="fixed bottom-0 left-0 right-0 z-[60] flex items-center justify-between h-9 px-4 bg-[#161616] border-t border-[#393939]">
      <span
        className="font-mono text-[10px] uppercase tracking-[0.8px] text-[#6f6f6f] select-none"
        aria-hidden="true"
      >
        Design Preview
      </span>

      <div className="flex items-center" role="group" aria-label="Switch design system">
        {designs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setDesign(id)}
            aria-pressed={design === id}
            className={`px-4 h-9 text-[12px] font-sans tracking-wide transition-colors duration-150 ${
              design === id
                ? id === "ibm"
                  ? "bg-[#0f62fe] text-white"
                  : "bg-[#393939] text-white"
                : "text-[#6f6f6f] hover:text-[#c6c6c6]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
