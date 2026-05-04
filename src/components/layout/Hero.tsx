"use client";

export default function Hero() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 py-16 md:py-[88px]">
      <div className="relative z-10 max-w-[720px] text-center">
        <h1 className="font-display text-[1.75rem] font-medium leading-[1.15] text-ink sm:text-[2.25rem] sm:leading-[1.11]">
          All You Need is Computer Science
        </h1>

        <p className="mt-6 text-base leading-normal text-body md:text-[16px] md:leading-[1.5]">
          Learn data structures and algorithms through{" "}
          <span className="font-medium text-ink">interactive visualizations</span>
          . Same quiet layout as the docs—no chrome, just the lesson.
        </p>

        <div className="mt-8 flex justify-center px-2">
          <div className="ui-install-snippet overflow-x-auto">
            <code className="whitespace-nowrap">npm run dev</code>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href="#topics" className="ui-btn-primary">
            Browse topics
          </a>
          <span className="ui-caption text-mute">
            Phase 1 · 8 topics
          </span>
        </div>
      </div>
    </section>
  );
}
