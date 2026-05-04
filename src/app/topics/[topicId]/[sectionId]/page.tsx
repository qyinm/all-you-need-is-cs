import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SectionPageView from "@/components/layout/SectionPageView";
import TopicPageShell from "@/components/layout/TopicPageShell";
import { getAllTopicSectionParams, getTopicSection } from "@/lib/topics";

type Props = { params: Promise<{ topicId: string; sectionId: string }> };

export function generateStaticParams() {
  return getAllTopicSectionParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topicId, sectionId } = await params;
  const found = getTopicSection(topicId, sectionId);
  if (!found) return { title: "Not found" };
  const { topic, section } = found;
  return {
    title: `${section.label} ${section.title} · ${topic.bookChapter} — All You Need is CS`,
    description: topic.subtitle,
  };
}

export default async function TopicSectionPage({ params }: Props) {
  const { topicId, sectionId } = await params;
  const found = getTopicSection(topicId, sectionId);
  if (!found) notFound();
  const { topic, section } = found;

  return (
    <TopicPageShell
      topicTitle={topic.title}
      topicId={topic.id}
      sectionSubtitle={`${section.label} · ${section.title}`}
    >
      <SectionPageView topic={topic} section={section} />
    </TopicPageShell>
  );
}
