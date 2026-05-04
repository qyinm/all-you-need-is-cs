import SectionLab from "@/components/layout/SectionLab";
import SectionNav from "@/components/layout/SectionNav";
import { getSectionProse } from "@/lib/sectionProse";
import type { BookOutlineItem, Topic } from "@/lib/topics";
import { getAdjacentSections } from "@/lib/topics";

export default function SectionPageView({
  topic,
  section,
}: {
  topic: Topic;
  section: BookOutlineItem;
}) {
  const paragraphs = getSectionProse(topic, section);
  const { prev, next } = getAdjacentSections(topic.id, section.id);

  return (
    <article className="scroll-mt-14 border-t border-hairline px-6 py-12 md:py-[88px]">
      <div className="mx-auto w-full max-w-[720px]">
        <header className="mb-10 text-center">
          <div className="mb-3 flex flex-wrap items-center justify-center gap-3">
            <span className="font-mono text-sm font-medium text-ink">{topic.bookChapter}</span>
            <span className="font-mono text-sm text-mute">{section.label}</span>
          </div>
          <h1 className="font-display text-[1.75rem] font-medium leading-[1.2] text-ink md:text-[28px]">
            {section.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-[1.5] text-body">{topic.subtitle}</p>
        </header>

        <div className="mb-10 space-y-4 text-left text-base leading-[1.5] text-body">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <SectionLab topicId={topic.id} sectionId={section.id} />

        <SectionNav topicId={topic.id} prev={prev} next={next} />
      </div>
    </article>
  );
}
