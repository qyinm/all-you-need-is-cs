"use client";

import { useCallback, useMemo, useState } from "react";

type Tok = string;

const DEMO: { label: string; tokens: Tok[] } = {
  label: "3 4 + 2 * → 14",
  tokens: ["3", "4", "+", "2", "*"],
};

function applyOp(a: number, b: number, op: string): number {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") return Math.trunc(a / b);
  throw new Error(op);
}

function isNumber(t: string) {
  return !Number.isNaN(Number(t));
}

export default function PostfixEvalViz() {
  const { tokens } = DEMO;
  const [step, setStep] = useState(0);
  const [stack, setStack] = useState<number[]>([]);

  const maxStep = tokens.length;

  const reset = useCallback(() => {
    setStep(0);
    setStack([]);
  }, []);

  const stepForward = useCallback(() => {
    if (step >= maxStep) return;
    const t = tokens[step];
    setStep((s) => s + 1);
    if (isNumber(t)) {
      setStack((s) => [...s, Number(t)]);
      return;
    }
    setStack((s) => {
      if (s.length < 2) return s;
      const b = s[s.length - 1];
      const a = s[s.length - 2];
      const r = applyOp(a, b, t);
      return [...s.slice(0, -2), r];
    });
  }, [step, maxStep, tokens]);

  const stepBack = useCallback(() => {
    if (step === 0) return;
    const st: number[] = [];
    for (let si = 0; si < step - 1; si++) {
      const tk = tokens[si];
      if (isNumber(tk)) st.push(Number(tk));
      else {
        const b = st.pop();
        const a = st.pop();
        if (a !== undefined && b !== undefined) st.push(applyOp(a, b, tk));
      }
    }
    setStep((prev) => prev - 1);
    setStack(st);
  }, [step, tokens]);

  const done = step >= maxStep;
  const top = done && stack.length === 1 ? stack[0] : null;

  const narrative = useMemo(() => {
    if (step === 0) return "Token stream (postfix / RPN). Step forward: push numbers, apply each operator to the top two operands.";
    if (step > maxStep) return "";
    const t = tokens[step - 1];
    if (!t) return "";
    if (isNumber(t)) return `Pushed ${t} onto the operand stack.`;
    return `Applied “${t}” to the two topmost operands (second-from-top op top).`;
  }, [step, maxStep, tokens]);

  return (
    <div className="space-y-5">
      <p className="text-center text-sm text-body">
        §3.4.2 — single operand stack: scan left-to-right, push literals, pop twice on each binary
        operator and push the result (book convention).
      </p>

      <div className="flex flex-wrap justify-center gap-2 font-mono text-sm">
        {tokens.map((t, i) => (
          <span
            key={`${i}-${t}`}
            className={`rounded border px-2 py-1 ${
              i < step ? "border-hairline bg-surface-soft text-mute line-through decoration-1" : ""
            } ${i === step && step < maxStep ? "border-ink bg-surface-soft text-ink" : ""} ${
              i > step ? "border-hairline bg-canvas text-body" : ""
            }`}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" className="ui-btn-secondary" onClick={stepBack} disabled={step === 0}>
          ← Back
        </button>
        <button type="button" className="ui-btn-primary" onClick={stepForward} disabled={step >= maxStep}>
          Next token →
        </button>
        <button type="button" className="ui-btn-secondary" onClick={reset}>
          Reset
        </button>
      </div>

      {narrative && (
        <p className="text-center text-sm text-ink" aria-live="polite">
          {narrative}
        </p>
      )}

      <div className="mx-auto max-w-md rounded-lg border border-hairline bg-canvas p-4">
        <h3 className="mb-3 font-mono text-xs font-medium uppercase tracking-wide text-mute">
          Operand stack (bottom → top)
        </h3>
        {stack.length === 0 ? (
          <p className="font-mono text-sm text-mute">(empty)</p>
        ) : (
          <div className="flex flex-col gap-1">
            {stack.map((v, i) => (
              <div
                key={`${i}-${v}`}
                className={`rounded border border-hairline px-3 py-2 font-mono text-center text-ink ${
                  i === stack.length - 1 ? "bg-surface-soft" : "bg-canvas"
                }`}
              >
                {v}
                {i === stack.length - 1 && <span className="ml-2 text-xs text-mute">← top</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {top !== null && (
        <p className="text-center font-mono text-sm text-ink">
          Result of {DEMO.label.split("→")[0].trim()}: <strong>{top}</strong>
        </p>
      )}

      <p className="ui-caption text-center">
        §3.4 (infix, precedence) uses related stacks for operators and operands; this demo is the pure
        postfix evaluation pattern.
      </p>
    </div>
  );
}
