"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Captions, Check, Lock, Maximize, MessagesSquare, Play, RotateCcw, Volume2 } from "lucide-react";
import { Button, Header, Img } from "@/components/ui";
import { QuizModal } from "@/components/QuizModal";
import { findCourse, type Course, type Skill } from "@/lib/data";
import { useStore } from "@/lib/store";

// Spacing follows the Figma frames "Video Web" (1440) and "Video Mobile" (402).

const toSeconds = (d: string) => d.split(":").reduce((acc, n) => acc * 60 + Number(n), 0);
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function Player({ thumbnail, duration, onEnded }: { thumbnail: string; duration: string; onEnded: () => void }) {
  const total = toSeconds(duration);
  const [progress, setProgress] = useState(0); // 0..1
  const [cc, setCc] = useState(true);
  const endedRef = useRef(onEnded);
  useEffect(() => {
    endedRef.current = onEnded;
  });

  useEffect(() => {
    if (progress >= 1) endedRef.current();
  }, [progress]);

  // For the demo, pressing play skips straight to the end and unlocks the quiz.
  const play = () => setProgress(1);

  return (
    <div className="overflow-hidden bg-[#e8e8e8] md:rounded-t-[4px]">
      <button onClick={play} className="group relative block aspect-[952/520] w-full" aria-label="Play">
        <Img src={thumbnail} className="absolute inset-0 size-full object-cover" />
        {progress < 1 && (
          <span className="absolute inset-0 flex items-center justify-center transition-colors group-hover:bg-black/10">
            <span className="flex size-12 items-center justify-center rounded-full bg-[rgba(24,30,36,0.75)] text-white md:size-16">
              <Play className="ml-1 size-6 md:size-[30px]" fill="currentColor" />
            </span>
          </span>
        )}
      </button>

      <div className="flex h-9 items-center gap-3 bg-[#1f2235] px-3 text-white md:h-[46px] md:gap-5 md:px-4">
        <button onClick={play} aria-label="Play">
          <Play className="size-4 md:size-[18px]" fill="currentColor" />
        </button>
        <span className="whitespace-nowrap text-[11px] tabular-nums text-white/80 md:text-[12px]">
          {fmt(progress * total)} / {duration}
        </span>
        <button onClick={() => setProgress((p) => Math.max(0, p - 10 / total))} aria-label="Back 10 seconds" className="hidden md:block">
          <RotateCcw size={18} />
        </button>
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(progress * 1000)}
          onChange={(e) => setProgress(Number(e.target.value) / 1000)}
          aria-label="Seek"
          className="h-1 min-w-0 flex-1 cursor-pointer accent-[#2d9cdb]"
        />
        <button onClick={() => setCc((c) => !c)} aria-label="Captions" aria-pressed={cc} className={cc ? "text-[#2d9cdb]" : "text-white"}>
          <Captions className="size-5 md:size-[22px]" />
        </button>
        <Volume2 size={20} className="hidden md:block" />
        <input type="range" defaultValue={70} aria-label="Volume" className="hidden h-1 w-[70px] accent-[#2d9cdb] lg:block" />
        <Maximize className="size-4 md:size-[18px]" />
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/courses"
      className="flex h-[14px] w-fit items-center gap-2 text-[14px] font-medium leading-5 text-black hover:text-[#0084ff] md:text-[16px] md:leading-[22px]"
    >
      <ArrowLeft size={14} strokeWidth={2.5} />
      <span className="trim">Back to All Courses</span>
    </Link>
  );
}

function EarnCredit({ course, done, watched, onTakeQuiz }: { course: Course; done: boolean; watched: boolean; onTakeQuiz: () => void }) {
  // Phones drop the icon bubble, per the mobile design, except on "Credit earned".
  const icon = (tone: "done" | "ready" | "locked") => (
    <span
      className={`size-10 shrink-0 items-center justify-center rounded-full ${tone === "done" ? "flex" : "hidden md:flex"} ${
        tone === "done"
          ? "bg-[rgba(0,134,73,0.15)] text-[#008649]"
          : tone === "ready"
            ? "bg-[rgba(0,132,255,0.12)] text-[#0084ff]"
            : "bg-[rgba(167,177,185,0.15)] text-[#5b6671]"
      }`}
    >
      {tone === "done" ? <Check size={20} /> : <MessagesSquare size={18} />}
    </span>
  );
  const text = (title: string, sub: string) => (
    <div className="flex min-w-0 flex-col gap-3 md:gap-2">
      <p className="text-[16px] font-medium leading-[22px] text-[#181e24]">{title}</p>
      <p className="text-[12px] leading-[18px] text-[#5b6671]">{sub}</p>
    </div>
  );

  return (
    <div className="flex items-center gap-4 rounded-[8px] bg-white px-4 py-6 md:gap-6 md:p-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {done ? (
          <>
            {icon("done")}
            {text("Credit earned", "Quiz complete · Added to transcript")}
          </>
        ) : (
          <>
            {icon(watched ? "ready" : "locked")}
            {text("Get credit for this course", watched ? `Take the quiz to earn credit for ${course.title}` : "Finish the video to unlock")}
          </>
        )}
      </div>
      {!done &&
        (watched ? (
          <Button onClick={onTakeQuiz} className="h-10 shrink-0 px-4 text-[14px]">
            Take Quiz
          </Button>
        ) : (
          <Button variant="locked" disabled className="h-10 shrink-0 px-4 text-[14px]" title="Finish the video to unlock">
            <Lock size={14} /> Take Quiz
          </Button>
        ))}
    </div>
  );
}

function Playlist({ skill, current, completed }: { skill: Skill; current: string; completed: string[] }) {
  const doneCount = skill.courses.filter((c) => completed.includes(c.id)).length;
  return (
    <aside className="h-fit rounded-[8px] bg-white pt-6 shadow-[0_4px_4px_rgba(24,30,36,0.04)]">
      <div className="flex flex-col gap-3 px-6">
        <p className="text-[16px] font-medium leading-[22px] text-[#181e24]">{skill.title}</p>
        <p className="text-[12px] leading-[18px] text-[#5b6671]">
          {doneCount} of {skill.courses.length} courses complete
        </p>
      </div>
      <ol className="mt-4 overflow-hidden rounded-b-[8px]">
        {skill.courses.map((c, i) => {
          const isCurrent = c.id === current;
          const isDone = completed.includes(c.id);
          return (
            <li key={c.id}>
              <Link
                href={`/courses/${c.id}`}
                aria-current={isCurrent ? "page" : undefined}
                className={`flex h-11 items-center justify-between gap-3 px-6 transition-colors ${
                  isCurrent ? (isDone ? "bg-[#dbeafe]" : "bg-[#eff6ff]") : "hover:bg-[#fafbfc]"
                }`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[12px] tracking-[-0.24px] ${
                      isDone ? "bg-[#22c55e] text-white" : isCurrent ? "bg-[#3b82f6] text-white" : "bg-[#d0d5d9] text-[#5b6671]"
                    }`}
                  >
                    {isDone ? <Check size={11} strokeWidth={3} /> : i + 1}
                  </span>
                  <span className={`truncate text-[14px] font-medium tracking-[-0.28px] ${isCurrent ? "text-[#3b82f6]" : "text-[#181e24]"}`}>
                    {c.title}
                  </span>
                </span>
                <span className={`text-[12px] leading-[18px] ${isCurrent ? "text-[#3b82f6]" : "text-[#a7b1b9]"}`}>{c.duration}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

export default function CourseView({ id }: { id: string }) {
  const found = findCourse(id);
  const { completed, completeCourse } = useStore();
  const [watched, setWatched] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  if (!found) notFound();
  const { skill, course } = found;
  const done = completed.includes(course.id);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1440px] pb-4 md:px-8 md:pb-16 md:pt-8">
        <div className="hidden md:block">
          <BackLink />
        </div>

        <div className="grid gap-[25px] md:mt-6 lg:grid-cols-[minmax(0,952px)_400px] lg:gap-6">
          <div className="flex flex-col gap-6 md:gap-5">
            {/* Phones: the video runs edge to edge directly under the header */}
            <Player key={course.id} thumbnail={course.thumbnail} duration={course.duration} onEnded={() => setWatched(true)} />

            <div className="flex flex-col gap-[25px] px-4 md:gap-[19px] md:px-0">
              <div className="md:hidden">
                <BackLink />
              </div>
              <EarnCredit course={course} done={done} watched={watched} onTakeQuiz={() => setQuizOpen(true)} />
              <div className="flex flex-col gap-2 text-[#181e24] md:gap-4">
                <h1 className="font-display text-[20px] leading-[1.2] tracking-[-0.4px] [text-box:normal] md:tracking-normal md:[text-box:trim-both_cap_alphabetic]">{course.title}</h1>
                <p className="max-w-[892px] text-[14px] leading-[22px] md:text-[16px] md:leading-6 md:tracking-[-0.32px] md:[text-box:normal]">{course.description}</p>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-0">
            <Playlist skill={skill} current={course.id} completed={completed} />
          </div>
        </div>
      </main>

      {quizOpen && (
        <QuizModal courseTitle={course.title} onClose={() => setQuizOpen(false)} onComplete={() => completeCourse(course.id)} />
      )}
    </>
  );
}
