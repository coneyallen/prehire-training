"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, ChevronDown, CircleCheck, ListTree } from "lucide-react";
import { Header, Img, ProgressBar } from "@/components/ui";
import { allCourses, skills, type Course, type Skill } from "@/lib/data";
import { useStore } from "@/lib/store";

type Filter = "All" | "Remaining" | "Completed";

function CourseCard({ course, done }: { course: Course; done: boolean }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex h-[116px] items-center gap-4 overflow-hidden rounded-[12px] border border-white bg-white pr-4 transition-shadow hover:shadow-[0_4px_16px_rgba(24,30,36,0.08)] md:gap-6 md:pr-8"
    >
      <div className="relative h-full w-[116px] shrink-0 overflow-hidden md:w-[208px]">
        <Img src={course.thumbnail} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <span className="absolute bottom-2 right-2 rounded-[4px] bg-[rgba(24,30,36,0.75)] px-1 text-[14px] leading-[22px] text-[#fafbfc]">
          {course.duration}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 md:gap-2">
        <p className="line-clamp-2 text-[14px] font-medium leading-5 text-[#181e24] md:truncate md:text-[16px] md:leading-[22px]">{course.title}</p>
        <p className="text-[14px] leading-[22px] text-[#5b6671]">
          {done ? "Completed" : "Due"}: {course.due}
        </p>
      </div>
      {done && <CircleCheck className="size-[28px] shrink-0 fill-[#00cc70] text-white md:size-[34px]" aria-label="Completed" />}
    </Link>
  );
}

function SkillGroup({ skill, filter, completed }: { skill: Skill; filter: Filter; completed: string[] }) {
  const [open, setOpen] = useState(true);
  const doneCount = skill.courses.filter((c) => completed.includes(c.id)).length;
  const visible = skill.courses.filter((c) => {
    const done = completed.includes(c.id);
    return filter === "All" || (filter === "Completed" ? done : !done);
  });
  if (visible.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex items-center gap-4 rounded-[12px] px-4 py-6 text-left md:gap-6 md:p-6 ${skill.tint}`}
      >
        <Img src={skill.icon} className="size-10 shrink-0 rounded-full border border-[#0084ff] object-cover" />
        <div className="flex min-w-0 flex-1 flex-col gap-1 md:gap-3">
          <h2 className="text-[16px] font-medium leading-[22px] text-[#181e24] md:font-display md:font-black md:text-[20px] md:leading-tight">{skill.title}</h2>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
            <span className="whitespace-nowrap text-[14px] leading-[22px] text-[#5b6671]">
              {doneCount} of {skill.courses.length} Courses Complete
            </span>
            <ProgressBar value={doneCount / skill.courses.length} track="bg-[rgba(24,30,36,0.15)]" fill={skill.bar} />
          </div>
        </div>
        <ChevronDown
          className={`size-[18px] shrink-0 md:size-6 text-[rgba(24,30,36,0.35)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && visible.map((c) => <CourseCard key={c.id} course={c} done={completed.includes(c.id)} />)}
    </section>
  );
}

export default function CoursesPage() {
  const { name, completed } = useStore();
  const [filter, setFilter] = useState<Filter>("All");
  const doneTotal = allCourses.filter((c) => completed.includes(c.id)).length;

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-[906px] flex-col px-4 pb-20 pt-8 md:pt-[71px] xl:px-0">
        <h1 className="font-display text-[20px] leading-none text-black md:text-[32px]">Welcome, {name}</h1>
        <p className="mt-2 text-[16px] leading-6 text-[#5b6671] md:mt-6 md:text-[20px] md:leading-normal md:font-[family-name:var(--font-lato)]">
          Please complete the following training courses
        </p>

        {/* Learning journey banner */}
        <section
          className="relative mt-8 overflow-hidden rounded-[12px] p-6 shadow-[0_4px_8px_rgba(24,30,36,0.04)] md:mt-[48px] md:p-8"
          style={{ backgroundImage: "linear-gradient(175.9deg, #00509c 37.3%, #3c87cf 80.8%)" }}
        >
          <div className="pointer-events-none absolute left-[72%] top-[-117px] hidden size-[372px] items-center justify-center md:flex">
            <Img src="/assets/banner-shape.svg" className="size-[278px] rotate-[-25.82deg]" />
          </div>
          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col items-start gap-3 md:flex-row md:justify-between">
              <h2 className="font-display text-[20px] leading-none text-[#fafbfc] md:text-[32px]">Pre-Hire</h2>
              <div className="flex items-center gap-4 text-[14px] font-medium tracking-[-0.28px] text-[#fafbfc]">
                <span className="flex items-center gap-2">
                  <ListTree size={16} /> {skills.length} Skills
                </span>
                <span className="h-6 w-px bg-white/40" />
                <span className="flex items-center gap-2">
                  <BookOpen size={16} /> {allCourses.length} Courses
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-[17px]">
              <span className="whitespace-nowrap text-[16px] font-medium leading-[22px] text-white">
                {doneTotal} of {allCourses.length} Courses Complete
              </span>
              <ProgressBar value={doneTotal / allCourses.length} track="bg-[#00509c]" fill="bg-white" height="h-3" />
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className="mt-8 flex gap-3 md:mt-[48px]" role="tablist">
          {(["All", "Remaining", "Completed"] as Filter[]).map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`h-10 flex-1 rounded-[8px] px-3 text-[16px] md:flex-none font-medium leading-[22px] transition-colors ${
                filter === f ? "bg-[#181e24] text-[#fafbfc]" : "bg-white text-[#181e24] hover:bg-[#fafbfc]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-10 md:mt-6">
          {skills.map((s) => (
            <SkillGroup key={s.id} skill={s} filter={filter} completed={completed} />
          ))}
        </div>
      </main>
    </>
  );
}
