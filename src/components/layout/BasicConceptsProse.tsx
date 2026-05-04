/**
 * Read-only summary aligned with Horowitz et al., Ch. 1 (Basic Concepts).
 */
export default function BasicConceptsProse() {
  return (
    <div className="space-y-6 text-left text-base leading-[1.5] text-body">
      <p className="text-ink font-medium">
        Before manipulating structures in code, the text establishes how we{" "}
        <em className="not-italic text-body">specify</em>,{" "}
        <em className="not-italic text-body">abstract</em>, and{" "}
        <em className="not-italic text-body">analyze</em> algorithms.
      </p>
      <div className="space-y-3">
        <h3 className="font-display text-[18px] font-medium text-ink">
          Algorithm specification
        </h3>
        <p>
          Problems are solved by precisely defined steps. A specification names
          inputs, outputs, and pre/post conditions so implementations can be
          compared fairly.
        </p>
      </div>
      <div className="space-y-3">
        <h3 className="font-display text-[18px] font-medium text-ink">
          Data abstraction
        </h3>
        <p>
          An <span className="font-medium text-ink">abstract data type (ADT)</span>{" "}
          separates <strong className="font-medium text-ink">what</strong> operations
          are allowed from <strong className="font-medium text-ink">how</strong> they
          are stored. Later chapters give concrete representations (arrays, links,
          trees).
        </p>
      </div>
      <div className="space-y-3">
        <h3 className="font-display text-[18px] font-medium text-ink">
          Performance analysis
        </h3>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <span className="text-ink font-medium">Time &amp; space complexity</span>{" "}
            — asymptotic growth (e.g. Big-O) predicts behavior as input size grows.
          </li>
          <li>
            <span className="text-ink font-medium">Measurement vs. analysis</span>{" "}
            — timing runs complement but do not replace reasoning about growth rates.
          </li>
        </ul>
      </div>
      <p className="border-t border-hairline pt-6 font-mono text-sm text-mute">
        Use the chapter links above for interactive representations of each structure.
        This page has no canvas—read it once, then start with Arrays (Ch. 2).
      </p>
    </div>
  );
}
