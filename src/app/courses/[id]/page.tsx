import { allCourses } from "@/lib/data";
import CourseView from "./CourseView";

export function generateStaticParams() {
  return allCourses.map((c) => ({ id: c.id }));
}

export default async function CoursePage({ params }: PageProps<"/courses/[id]">) {
  const { id } = await params;
  return <CourseView id={id} />;
}
