"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BookOpen, Building2, CalendarDays, Check, ChevronDown, CircleCheck, Clock, ListTree, User } from "lucide-react";
import { Header, Img, ProgressBar, SkillBadge } from "@/components/ui";
import { allCourses, programs, type Course, type Program, type Skill } from "@/lib/data";
import { useStore } from "@/lib/store";

// Layout follows the Figma frame "Option B – Checklist Overlapping Hero" (desktop, 1440).
// Text is trimmed to cap height (see globals.css), so gaps here are the gaps between letters in Figma.

type Filter = "All" | "Remaining" | "Completed";

const visibleCourses = (skill: Skill, filter: Filter, completed: string[]) =>
  skill.courses.filter((c) => {
    const done = completed.includes(c.id);
    return filter === "All" || (filter === "Completed" ? done : !done);
  });

/* ---------- Welcome hero + checklist ---------- */

function WelcomeHero({ name }: { name: string }) {
  const highlight = "font-bold text-[#80c2ff]";
  const details = [
    { icon: CalendarDays, label: "Start Date:", value: "Monday, November 3" },
    { icon: User, label: "Position:", value: "Custodian" },
    { icon: Building2, label: "Site:", value: "Acme Corp" },
  ];
  return (
    <section className="relative overflow-hidden bg-[#004383] px-4 pb-[104px] pt-10 md:rounded-[16px] md:px-8 md:pb-[102px] lg:h-[440px] lg:pb-0 lg:pt-[60px]">
      {/* Phones: the shape sits bottom-right behind the text */}
      <div className="pointer-events-none absolute -right-[25px] bottom-[-15px] flex size-[257px] items-center justify-center opacity-50 md:hidden">
        <Img src="/assets/hero-shape.svg" className="size-[210px] rotate-[15deg]" />
      </div>
      <div className="pointer-events-none absolute right-[-112px] top-[-92px] hidden size-[570px] items-center justify-center md:flex">
        <Img src="/assets/hero-shape.svg" className="size-[465px] rotate-[15deg]" />
      </div>
      <div className="relative mx-auto h-full max-w-[900px]">
        <div className="relative z-10 flex max-w-[500px] flex-col gap-6">
          <div className="flex max-w-[353px] flex-col gap-3 md:max-w-none lg:w-[627px]">
            <h1 className="font-display text-[32px] leading-[1.2] text-white md:text-[44px] md:leading-[1.15] md:[text-box:normal]">Welcome to the team, {name}!</h1>
            {/* Line breaks match the Figma frame on desktop */}
            <p className="text-[16px] leading-[1.5] text-[rgba(255,255,255,0.92)] [text-box:normal] font-[family-name:var(--font-lato)] md:text-[19px]">
              We&apos;re excited to have you join SBM as a <span className={highlight}>Custodian</span> <b>at</b>{" "}
              <span className={highlight}>Acme Corp</span>.<br className="hidden lg:block" /> Your first day is{" "}
              <span className={highlight}>Monday, November 3</span>. Please complete
              <br className="hidden lg:block" /> the following training so you&apos;re ready for day one!
            </p>
          </div>
          <dl className="flex flex-col gap-2 md:gap-[10px]">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex h-7 items-center gap-[10px] text-[16px]">
                <Icon size={14} className="text-white/60" aria-hidden />
                <dt className="trim leading-6 text-white/60">{label}</dt>
                <dd className="trim font-medium leading-[22px] text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Img
          src="/assets/team.png"
          alt="SBM team members"
          className="pointer-events-none absolute left-[532px] top-4 hidden h-[395px] w-[594px] max-w-none object-cover lg:block"
        />
      </div>
    </section>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return checked ? (
    <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#00cc70] text-white" aria-label="Done">
      <Check size={14} strokeWidth={3} />
    </span>
  ) : (
    <span className="size-[22px] shrink-0 rounded-full border-[1.5px] border-[#d0d5d9]" aria-label="Not done" />
  );
}

/** Mini donut chart showing how much of the training is done; becomes a check when finished. */
function ProgressDonut({ value }: { value: number }) {
  if (value >= 1) return <Checkbox checked />;
  const r = 9;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 22 22" className="size-[22px] shrink-0 -rotate-90" role="img" aria-label={`${Math.round(value * 100)}% complete`}>
      <circle cx="11" cy="11" r={r} fill="none" stroke="#e1e5ea" strokeWidth="3" />
      <circle
        cx="11"
        cy="11"
        r={r}
        fill="none"
        stroke="#0084ff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${value * c} ${c}`}
        className="transition-[stroke-dasharray] duration-500"
      />
    </svg>
  );
}

function Checklist({ doneTotal, total }: { doneTotal: number; total: number }) {
  return (
    <section className="relative z-10 mx-auto -mt-16 w-[calc(100%-32px)] md:-mt-[62px] max-w-[900px] overflow-hidden rounded-[12px] bg-white md:w-full">
      <h2 className="p-6 text-[16px] font-medium leading-[22px] text-[#171c24]">Before your Start Date</h2>
      <div className="flex items-start gap-4 border-b border-[#e1e5ea] p-4 md:min-h-[72px] md:items-center">
        <ProgressDonut value={doneTotal / total} />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <p className="text-[14px] font-medium leading-5 text-[#171c24]">Finish your pre-hire training</p>
          <p className="text-[14px] leading-[22px] text-[#5b6671] md:text-[12px] md:leading-[18px]">
            {doneTotal} of {total} courses complete
          </p>
        </div>
        {doneTotal < total && (
          <span className="flex shrink-0 items-center gap-[6px] rounded-[8px] bg-[rgba(237,92,33,0.12)] py-[5px] pl-[10px] pr-3 text-[12px] leading-[18px] text-[#ed5c21]">
            <Clock size={12} strokeWidth={2.5} /> Due in 8 days
          </span>
        )}
      </div>
      <div className="flex items-start gap-4 p-4 md:items-center">
        <Checkbox checked />
        <div className="flex min-w-0 flex-1 flex-col gap-3 md:gap-2">
          <p className="text-[14px] font-medium leading-5 text-[#171c24]">Update your profile</p>
          <p className="text-[14px] leading-[22px] text-[#5b6671] md:text-[12px] md:leading-[18px]">Add your Profile pic, about me and more</p>
          {/* Phones: the link sits under the text */}
          <Link href="/profile" className="flex h-[14px] w-fit items-center gap-1 text-[16px] font-medium tracking-[-0.32px] text-[#0084ff] md:hidden">
            Edit Profile <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
        <Link href="/profile" className="hidden h-12 shrink-0 items-center gap-1 rounded-[4px] px-3 text-[16px] font-medium tracking-[-0.32px] text-[#0084ff] hover:bg-[#f0f7ff] md:flex">
          Edit Profile <ArrowRight size={16} strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  );
}

/* ---------- Training list ---------- */

function CourseCard({ course, done }: { course: Course; done: boolean }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex h-[116px] items-center gap-4 overflow-hidden rounded-[12px] border border-white bg-white pr-4 transition-shadow hover:shadow-[0_4px_16px_rgba(24,30,36,0.08)] md:gap-6 md:pr-8"
    >
      <div className="relative h-full w-[116px] shrink-0 overflow-hidden md:w-[208px]">
        {course.illustration ? (
          <div className="size-full bg-[#e8e8e8] p-2">
            <Img src={course.thumbnail} className="size-full object-contain transition-transform duration-300 group-hover:scale-105" />
          </div>
        ) : (
          <Img src={course.thumbnail} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
        )}
        <span className="absolute bottom-2 right-2 rounded-[4px] bg-[rgba(24,30,36,0.75)] px-1 text-[14px] leading-[22px] text-[#fafbfc]">
          {course.duration}
        </span>
      </div>
      <div className={`flex min-w-0 flex-1 flex-col gap-3 ${done ? "" : "md:gap-2"}`}>
        <p className="text-[14px] font-medium leading-5 text-[#181e24] md:text-[16px] md:leading-[22px]">{course.title}</p>
        <p className="text-[14px] leading-[22px] text-[#5b6671]">
          {done ? "Completed" : "Due"}: {course.due}
        </p>
      </div>
      {done && <CircleCheck className="size-8 shrink-0 fill-[#00cc70] text-white md:size-10" aria-label="Completed" />}
    </Link>
  );
}

function SkillGroup({
  skill,
  visible,
  completed,
  open,
  onToggle,
  className,
}: {
  skill: Skill;
  visible: Course[];
  completed: string[];
  open: boolean;
  onToggle: () => void;
  className: string;
}) {
  const doneCount = skill.courses.filter((c) => completed.includes(c.id)).length;
  return (
    <section className={`flex flex-col gap-4 ${className}`}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className={`flex items-center gap-4 rounded-[12px] px-4 py-6 text-left md:gap-6 md:p-6 ${skill.tint}`}
      >
        {skill.placeholder ? (
          <SkillBadge icon={skill.placeholder} />
        ) : (
          <Img src={skill.icon} className="size-10 shrink-0 rounded-full border border-[#0084ff] object-cover" />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-3 md:gap-4">
          <h3 className="text-[16px] font-medium leading-[22px] text-[#181e24] md:font-display md:font-black md:text-[20px] md:leading-[1.2]">
            {skill.title}
          </h3>
          <p className="text-[14px] leading-[22px] text-[#181e24]">
            {doneCount} of {skill.courses.length} Courses Complete
          </p>
        </div>
        <ChevronDown className={`size-6 shrink-0 p-[3px] text-[rgba(24,30,36,0.35)] transition-transform md:p-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && visible.map((c) => <CourseCard key={c.id} course={c} done={completed.includes(c.id)} />)}
    </section>
  );
}

function ProgramSection({
  program,
  filter,
  completed,
}: {
  program: Program;
  filter: Filter;
  completed: string[];
}) {
  const [open, setOpen] = useState(true);
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const courses = program.skills.flatMap((s) => s.courses);
  const doneCount = courses.filter((c) => completed.includes(c.id)).length;
  const shown = program.skills.map((s) => ({ skill: s, visible: visibleCourses(s, filter, completed) })).filter((s) => s.visible.length > 0);

  return (
    <section className="flex flex-col">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="relative overflow-hidden rounded-[12px] p-6 text-left shadow-[0_4px_8px_rgba(24,30,36,0.04)] [background-image:var(--banner-mobile)] md:p-8 md:[background-image:var(--banner)]"
        style={{ "--banner": program.banner, "--banner-mobile": program.mobileBanner ?? program.banner } as React.CSSProperties}
      >
        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col items-start gap-3 md:flex-row md:justify-between">
            <h2 className="font-display text-[20px] leading-[1.2] text-[#fafbfc] md:text-[32px]">{program.title}</h2>
            <div className="flex h-5 items-center gap-4 text-[14px] font-medium tracking-[-0.28px] text-[#fafbfc]">
              <span className="flex items-center gap-2">
                <ListTree size={16} /> {program.skills.length} Skills
              </span>
              <span className="h-6 w-px bg-white/40" />
              <span className="flex items-center gap-2">
                <BookOpen size={16} /> {courses.length} Courses
              </span>
              <ChevronDown size={20} strokeWidth={2.5} className={`hidden transition-transform md:block ${open ? "rotate-180" : ""}`} />
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-[17px]">
            <p className="whitespace-nowrap text-[16px] font-medium leading-[22px] text-white">
              {doneCount} of {courses.length} Courses Complete
            </p>
            <ProgressBar value={doneCount / courses.length} track={program.track} fill="bg-white" height="h-3" radius="rounded-[4px] md:rounded-full" />
          </div>
        </div>
      </button>

      {/* After an expanded skill there is a 40px gap; after a collapsed one, the normal 16px card gap. */}
      {open && shown.length > 0 && (
        <div className="mt-4 flex flex-col md:mt-6">
          {shown.map(({ skill, visible }, i) => (
            <SkillGroup
              key={skill.id}
              skill={skill}
              visible={visible}
              completed={completed}
              open={!collapsed.includes(skill.id)}
              onToggle={() => setCollapsed((c) => (c.includes(skill.id) ? c.filter((id) => id !== skill.id) : [...c, skill.id]))}
              className={i === 0 ? "" : collapsed.includes(shown[i - 1].skill.id) ? "mt-4" : "mt-10"}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function CoursesPage() {
  const { name, completed } = useStore();
  const [filter, setFilter] = useState<Filter>("All");
  const doneTotal = allCourses.filter((c) => completed.includes(c.id)).length;

  const filters = (
    <div className="flex gap-3" role="tablist">
      {(["All", "Remaining", "Completed"] as Filter[]).map((f) => (
        <button
          key={f}
          role="tab"
          aria-selected={filter === f}
          onClick={() => setFilter(f)}
          className={`h-10 flex-1 rounded-[8px] px-3 text-[16px] font-medium leading-[22px] transition-colors md:flex-none ${
            filter === f ? "bg-[#181e24] text-[#fafbfc]" : "bg-white text-[#181e24] hover:bg-[#fafbfc]"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <Header />
      <main className="w-full pb-20 md:px-8 md:pt-8">
        <WelcomeHero name={name} />
        <Checklist doneTotal={doneTotal} total={allCourses.length} />

        <div className="mx-auto mt-8 flex max-w-[900px] flex-col px-4 md:mt-[60px] md:px-0">
          <h2 className="font-display text-[24px] leading-[1.2] text-[#171c24] [text-box:normal] md:text-[32px] md:[text-box:trim-both_cap_alphabetic]">My Training</h2>
          <div className="mt-4 md:mt-8">{filters}</div>

          <div className="mt-4 flex flex-col gap-6 md:mt-8">
            {programs.map((p) => (
              <ProgramSection key={p.id} program={p} filter={filter} completed={completed} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
