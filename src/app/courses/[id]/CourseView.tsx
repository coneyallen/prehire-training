"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Captions,
  Check,
  Lock,
  Maximize,
  MessagesSquare,
  Pause,
  Play,
  RotateCcw,
  Volume2,
} from "lucide-react";
import { Button, Header, Img } from "@/components/ui";
import { QuizModal } from "@/components/QuizModal";
import { findCourse } from "@/lib/data";
import { useStore } from "@/lib/store";

const toSeconds = (d: string) => d.split(":").reduce((acc, n) => acc * 60 + Number(n), 0);
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function Player({ thumbnail, duration, onEnded }: { thumbnail: string; duration: string; onEnded: () => void }) {
  const total = toSeconds(duration);
  const [progress, setProgress] = useState(0); // 0..1
  const playing = false;
  const [cc, setCc] = useState(true);
  const endedRef = useRef(onEnded);
  useEffect(() => {
    endedRef.current = onEnded;
  });

  useEffect(() => {
    if (progress >= 1) endedRef.current();
  }, [progress]);

  // For the demo, pressing play skips straight to the end and unlocks the quiz.
  const toggle = () => setProgress(1);

  return (
    <div className="overflow-hidden rounded-t-[4px] bg-[#e8e8e8]">
      <button onClick={toggle} className="group relative block aspect-[952/520] w-full" aria-label={playing ? "Pause" : "Play"}>
        <Img src={thumbnail} className="absolute inset-0 size-full object-cover" />
        {progress < 1 && (
          <span className="absolute inset-0 flex items-center justify-center transition-colors group-hover:bg-black/10">
            <span className="flex size-16 items-center justify-center rounded-full bg-[rgba(24,30,36,0.75)] text-white">
              <Play size={30} className="ml-1" fill="currentColor" />
            </span>
          </span>
        )}
      </button>

      <div className="flex h-[46px] items-center gap-3 bg-[#1f2235] px-4 text-white sm:gap-5">
        <button onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
          {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </button>
        <span className="whitespace-nowrap text-[12px] tabular-nums text-white/80">
          {fmt(progress * total)} / {duration}
        </span>
        <button onClick={() => setProgress((p) => Math.max(0, p - 10 / total))} aria-label="Back 10 seconds" className="hidden sm:block">
          <RotateCcw size={18} />
        </button>
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(progress * 1000)}
          onChange={(e) => setProgress(Number(e.target.value) / 1000)}
          aria-label="Seek"
          className="h-1 flex-1 cursor-pointer accent-[#2d9cdb]"
        />
        <button onClick={() => setCc((c) => !c)} aria-label="Captions" aria-pressed={cc} className={cc ? "text-[#2d9cdb]" : "text-white"}>
          <Captions size={22} />
        </button>
        <Volume2 size={20} className="hidden sm:block" />
        <input type="range" defaultValue={70} aria-label="Volume" className="hidden h-1 w-[70px] accent-[#2d9cdb] md:block" />
        <Maximize size={18} className="hidden sm:block" />
      </div>
    </div>
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
  const doneCount = skill.courses.filter((c) => completed.includes(c.id)).length;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-6 sm:px-8 sm:pt-8">
        <Link href="/courses" className="inline-flex items-center gap-2 text-[16px] font-medium leading-[22px] text-black hover:text-[#0084ff]">
          <ArrowLeft size={16} /> Back to All Courses
        </Link>

        <div className="mt-6 grid gap-6 lg:mt-[38px] lg:grid-cols-[minmax(0,952px)_400px] lg:gap-8">
          <div className="flex flex-col gap-6">
            <Player key={course.id} thumbnail={course.thumbnail} duration={course.duration} onEnded={() => setWatched(true)} />

            {/* Earn credit */}
            <div className="flex flex-col gap-4 rounded-[8px] bg-white p-4 sm:flex-row sm:items-center sm:p-6">
              {done ? (
                <div className="flex flex-1 items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-[rgba(0,134,73,0.15)] text-[#008649]">
                    <Check size={20} />
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-[16px] font-medium leading-[22px] text-[#181e24]">Credit earned</p>
                    <p className="text-[12px] leading-[18px] text-[#5b6671]">Quiz passed · Added to transcript</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-1 items-center gap-3">
                    <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${watched ? "bg-[rgba(0,132,255,0.12)] text-[#0084ff]" : "bg-[rgba(167,177,185,0.15)] text-[#5b6671]"}`}>
                      <MessagesSquare size={18} />
                    </span>
                    <div className="flex flex-col gap-1">
                      <p className="text-[16px] font-medium leading-[22px] text-[#181e24]">Get credit for this course</p>
                      <p className="text-[12px] leading-[18px] text-[#5b6671]">
                        {watched ? `Take the quiz to earn credit for ${course.title}` : "Finish the video to unlock"}
                      </p>
                    </div>
                  </div>
                  {watched ? (
                    <Button onClick={() => setQuizOpen(true)} className="h-10 px-4 text-[14px]">
                      Take Quiz
                    </Button>
                  ) : (
                    <Button variant="locked" disabled className="h-10 px-4 text-[14px]" title="Finish the video to unlock">
                      <Lock size={14} /> Take Quiz
                    </Button>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-col gap-4 px-1 text-[#181e24]">
              <h1 className="font-display text-[20px] leading-tight">{course.title}</h1>
              <p className="max-w-[935px] text-[16px] leading-6 tracking-[-0.32px]">{course.description}</p>
            </div>
          </div>

          {/* Skill playlist */}
          <aside className="h-fit rounded-[8px] bg-white pt-6 shadow-[0_4px_4px_rgba(24,30,36,0.04)]">
            <div className="flex flex-col gap-3 px-6">
              <p className="text-[16px] font-medium leading-[22px] text-[#181e24]">{skill.title}</p>
              <p className="text-[12px] leading-[18px] text-[#5b6671]">
                {doneCount} of {skill.courses.length} courses complete
              </p>
            </div>
            <ol className="mt-4 pb-2">
              {skill.courses.map((c, i) => {
                const current = c.id === course.id;
                const isDone = completed.includes(c.id);
                return (
                  <li key={c.id}>
                    <Link
                      href={`/courses/${c.id}`}
                      aria-current={current ? "page" : undefined}
                      className={`flex items-center justify-between gap-3 px-6 py-3 transition-colors ${
                        current ? (isDone ? "bg-[#dbeafe]" : "bg-[#eff6ff]") : "hover:bg-[#fafbfc]"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[12px] ${
                            isDone ? "bg-[#22c55e] text-white" : current ? "bg-[#3b82f6] text-white" : "bg-[#d0d5d9] text-[#5b6671]"
                          }`}
                        >
                          {isDone ? <Check size={11} strokeWidth={3} /> : i + 1}
                        </span>
                        <span className={`truncate text-[14px] font-medium tracking-[-0.28px] ${current ? "text-[#3b82f6]" : "text-[#181e24]"}`}>
                          {c.title}
                        </span>
                      </span>
                      <span className={`text-[12px] leading-[18px] ${current ? "text-[#3b82f6]" : "text-[#a7b1b9]"}`}>{c.duration}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </aside>
        </div>
      </main>

      {quizOpen && (
        <QuizModal
          courseId={course.id}
          courseTitle={course.title}
          onClose={() => setQuizOpen(false)}
          onPass={() => completeCourse(course.id)}
        />
      )}
    </>
  );
}
