"use client";

import { useMemo, useState } from "react";

const DEFAULT = "DATASTRUCTURES";

export default function StringArrayViz() {
  const [text, setText] = useState(DEFAULT);
  const [lo, setLo] = useState(0);
  const [hi, setHi] = useState(4);

  const chars = useMemo(() => text.split(""), [text]);
  const len = chars.length;

  const loC = Math.max(0, Math.min(lo, len - 1));
  const hiC = Math.max(loC, Math.min(hi, len - 1));

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2">
        <label className="sr-only" htmlFor="string-viz-input">
          String characters
        </label>
        <input
          id="string-viz-input"
          value={text}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 32);
            setText(cleaned.length ? cleaned : "A");
          }}
          className="ui-input w-full max-w-md text-center font-mono uppercase"
          maxLength={32}
        />
        <p className="text-xs text-mute">Letters only (uppercase); max 32 chars.</p>
      </div>

      <div className="overflow-x-auto">
        <div className="mx-auto flex w-max gap-0.5">
          {chars.map((ch, i) => {
            const inRange = i >= loC && i <= hiC;
            return (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-9 items-center justify-center border font-mono text-sm font-medium ${
                    inRange
                      ? "border-ink bg-surface-soft text-ink"
                      : "border-hairline bg-canvas text-body"
                  }`}
                >
                  {ch}
                </div>
                <span className="mt-1 font-mono text-[10px] text-mute">{i}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-center gap-4">
        <div>
          <label className="mb-1 block font-mono text-xs text-mute" htmlFor="sub-lo">
            Start index
          </label>
          <input
            id="sub-lo"
            type="number"
            min={0}
            max={Math.max(0, len - 1)}
            value={loC}
            onChange={(e) => setLo(Number(e.target.value))}
            className="ui-input w-20 font-mono"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs text-mute" htmlFor="sub-hi">
            End index (inclusive)
          </label>
          <input
            id="sub-hi"
            type="number"
            min={0}
            max={Math.max(0, len - 1)}
            value={hiC}
            onChange={(e) => setHi(Number(e.target.value))}
            className="ui-input w-20 font-mono"
          />
        </div>
      </div>

      <p className="text-center font-mono text-sm text-body">
        Substring view:{" "}
        <span className="rounded bg-surface-soft px-2 py-0.5 text-ink">
          chars[{loC} … {hiC}] = &quot;{chars.slice(loC, hiC + 1).join("")}&quot;
        </span>
      </p>

      <p className="ui-caption text-center">
        Strings as char arrays: random access by index, and logical operations like substring map
        to pointer ranges in C-style APIs.
      </p>
    </div>
  );
}
