"use client";

import { useState } from "react";

type Mode = "struct" | "union";

export default function StructUnionViz() {
  const [mode, setMode] = useState<Mode>("struct");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setMode("struct")}
          className={mode === "struct" ? "ui-btn-primary" : "ui-btn-secondary"}
        >
          struct layout
        </button>
        <button
          type="button"
          onClick={() => setMode("union")}
          className={mode === "union" ? "ui-btn-primary" : "ui-btn-secondary"}
        >
          union overlay
        </button>
      </div>

      {mode === "struct" ? (
        <div className="mx-auto max-w-lg space-y-4">
          <pre className="overflow-x-auto rounded-lg border border-hairline bg-surface-soft p-4 font-mono text-sm leading-relaxed text-ink">
{`typedef struct {
    int   tag;    /* 4 bytes (assume) */
    char  flags;  /* 1 byte  */
    /* padding to align next int */
    int   value;  /* 4 bytes */
} record_t;`}
          </pre>
          <p className="text-center text-sm text-body">
            Fields are laid out in declaration order with alignment gaps so wider types sit on
            machine-friendly boundaries. Inspect <span className="font-mono text-ink">sizeof</span>{" "}
            and addresses in C to see real padding.
          </p>
          <div className="flex justify-center gap-1">
            {[
              { w: "w-20", label: "tag\nint", bytes: "4" },
              { w: "w-10", label: "flags\nchar", bytes: "1" },
              { w: "w-8", label: "pad", bytes: "3", mute: true },
              { w: "w-20", label: "value\nint", bytes: "4" },
            ].map((blk, i) => (
              <div
                key={i}
                className={`flex ${blk.w} flex-col items-center justify-center rounded border border-hairline py-3 text-center ${blk.mute ? "bg-canvas text-mute" : "bg-surface-soft text-ink"}`}
              >
                <span className="whitespace-pre-line font-mono text-[10px] leading-tight">
                  {blk.label}
                </span>
                <span className="mt-1 font-mono text-[10px] text-mute">{blk.bytes} B</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-lg space-y-4">
          <pre className="overflow-x-auto rounded-lg border border-hairline bg-surface-soft p-4 font-mono text-sm leading-relaxed text-ink">
{`typedef union {
    int   as_int;
    float as_float;
} word_t;`}
          </pre>
          <p className="text-center text-sm text-body">
            A union reuses the same storage for different interpretations—only one member should
            be active at a time unless you really mean type-punning with care.
          </p>
          <div className="mx-auto max-w-xs">
            <div className="rounded-lg border-2 border-dashed border-charcoal bg-surface-soft p-6 text-center font-mono text-sm text-ink">
              shared
              <br />
              sizeof ≈ max(int, float)
            </div>
            <p className="mt-2 text-center font-mono text-xs text-mute">
              as_int | as_float · same bytes, two views
            </p>
          </div>
        </div>
      )}

      <p className="ui-caption text-center">
        §2.2 — schematic only; real sizes depend on <span className="font-mono">#pragma pack</span>,
        ABI, and target architecture.
      </p>
    </div>
  );
}
