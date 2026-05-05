"use client";

import { useCallback, useState } from "react";

const NUM_STACKS = 4;
const NUM_QUEUES = 3;

/** Singly linked stack as head-first list for display (head at index 0). */
type Chain = number[];

function pushHead(chain: Chain, v: number): Chain {
  return [v, ...chain];
}

function popHead(chain: Chain): Chain {
  return chain.slice(1);
}

function enqueueRear(q: Chain, v: number): Chain {
  return [...q, v];
}

function dequeueFront(q: Chain): Chain {
  return q.slice(1);
}

export default function LinkedStacksQueuesViz() {
  const [stacks, setStacks] = useState<Chain[]>(() =>
    Array.from({ length: NUM_STACKS }, () => [])
  );
  const [queues, setQueues] = useState<Chain[]>(() =>
    Array.from({ length: NUM_QUEUES }, () => [])
  );
  const [stackIdx, setStackIdx] = useState(0);
  const [queueIdx, setQueueIdx] = useState(0);

  const pushStack = useCallback(() => {
    const v = Math.floor(Math.random() * 90) + 10;
    setStacks((prev) => {
      const next = [...prev];
      next[stackIdx] = pushHead(next[stackIdx], v);
      return next;
    });
  }, [stackIdx]);

  const popStack = useCallback(() => {
    setStacks((prev) => {
      const next = [...prev];
      if (next[stackIdx].length === 0) return prev;
      next[stackIdx] = popHead(next[stackIdx]);
      return next;
    });
  }, [stackIdx]);

  const enqueueQ = useCallback(() => {
    const v = Math.floor(Math.random() * 90) + 10;
    setQueues((prev) => {
      const next = [...prev];
      next[queueIdx] = enqueueRear(next[queueIdx], v);
      return next;
    });
  }, [queueIdx]);

  const dequeueQ = useCallback(() => {
    setQueues((prev) => {
      const next = [...prev];
      if (next[queueIdx].length === 0) return prev;
      next[queueIdx] = dequeueFront(next[queueIdx]);
      return next;
    });
  }, [queueIdx]);

  const reset = () => {
    setStacks(Array.from({ length: NUM_STACKS }, () => []));
    setQueues(Array.from({ length: NUM_QUEUES }, () => []));
  };

  return (
    <div className="space-y-8">
      <p className="text-center text-sm text-body">
        §4.3 pattern: many stacks/queues share the heap; each logical stack keeps <span className="font-mono">top[i]</span>{" "}
        to the head of its chain. Linked queues keep <span className="font-mono">front[i]</span> and{" "}
        <span className="font-mono">rear[i]</span> (empty when both <span className="font-mono">NULL</span>). Chains
        themselves are ordinary list nodes.
      </p>

      <div className="rounded-lg border border-hairline bg-canvas p-4">
        <h3 className="mb-3 font-mono text-xs font-medium uppercase tracking-wide text-mute">
          Linked stacks (top[i] → first node)
        </h3>
        <div className="mb-3 flex flex-wrap gap-2">
          {Array.from({ length: NUM_STACKS }, (_, i) => (
            <button
              key={`si-${i}`}
              type="button"
              onClick={() => setStackIdx(i)}
              className={stackIdx === i ? "ui-btn-primary" : "ui-btn-secondary-sm"}
            >
              stack {i}
            </button>
          ))}
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          <button type="button" className="ui-btn-primary" onClick={pushStack}>
            Push (random)
          </button>
          <button type="button" className="ui-btn-secondary" onClick={popStack}>
            Pop
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stacks.map((s, i) => (
            <div key={i} className="rounded border border-hairline p-2">
              <p className="mb-1 font-mono text-[10px] text-mute">top[{i}]</p>
              <div className="flex min-h-10 flex-wrap items-center gap-1">
                {s.length === 0 ? (
                  <span className="text-xs text-mute">NULL</span>
                ) : (
                  s.map((v, j) => (
                    <span key={`${i}-${j}-${v}`} className="font-mono text-xs">
                      <span className="rounded border border-hairline bg-surface-soft px-1.5 py-0.5">{v}</span>
                      {j < s.length - 1 && <span className="text-mute"> → </span>}
                    </span>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-hairline bg-canvas p-4">
        <h3 className="mb-3 font-mono text-xs font-medium uppercase tracking-wide text-mute">
          Linked queues (front[i] / rear[i])
        </h3>
        <div className="mb-3 flex flex-wrap gap-2">
          {Array.from({ length: NUM_QUEUES }, (_, i) => (
            <button
              key={`qi-${i}`}
              type="button"
              onClick={() => setQueueIdx(i)}
              className={queueIdx === i ? "ui-btn-primary" : "ui-btn-secondary-sm"}
            >
              queue {i}
            </button>
          ))}
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          <button type="button" className="ui-btn-primary" onClick={enqueueQ}>
            Enqueue (random)
          </button>
          <button type="button" className="ui-btn-secondary" onClick={dequeueQ}>
            Dequeue
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {queues.map((q, i) => (
            <div key={i} className="rounded border border-hairline p-2">
              <p className="mb-1 font-mono text-[10px] text-mute">
                front[{i}] → … → rear[{i}]
              </p>
              <div className="flex min-h-10 flex-wrap items-center gap-1">
                {q.length === 0 ? (
                  <span className="text-xs text-mute">empty</span>
                ) : (
                  q.map((v, j) => (
                    <span key={`${i}-${j}-${v}`} className="font-mono text-xs">
                      <span
                        className={`rounded border px-1.5 py-0.5 ${
                          j === 0
                            ? "border-ink bg-surface-soft"
                            : j === q.length - 1
                              ? "border-charcoal bg-surface-soft"
                              : "border-hairline bg-canvas"
                        }`}
                      >
                        {v}
                      </span>
                      {j < q.length - 1 && <span className="text-mute"> → </span>}
                    </span>
                  ))
                )}
              </div>
              {q.length > 0 && (
                <p className="mt-1 font-mono text-[10px] text-mute">
                  head style: front · tail style: rear
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button type="button" className="ui-btn-secondary" onClick={reset}>
          Clear all
        </button>
      </div>

      <p className="ui-caption text-center">
        Slides contrast this with <span className="font-mono">stack[N][MAX]</span>—here linked nodes avoid a
        rectangular “maximum per stack” grid when sizes differ.
      </p>
    </div>
  );
}
