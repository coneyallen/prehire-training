"use client";

import { useEffect, useState } from "react";
import { Check, PartyPopper, X } from "lucide-react";
import { Button } from "@/components/ui";
import { getQuiz } from "@/lib/data";

const PASS = 2; // correct answers needed out of 3

export function QuizModal({
  courseId,
  courseTitle,
  onClose,
  onPass,
}: {
  courseId: string;
  courseTitle: string;
  onClose: () => void;
  onPass: () => void;
}) {
  const questions = getQuiz(courseId);
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>(() => questions.map(() => null));
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = questions[index];
  const pick = picks[index];
  const score = picks.filter((p, i) => p === questions[i].correct).length;
  const passed = score >= PASS;

  const next = () => {
    if (index < questions.length - 1) setIndex(index + 1);
    else {
      setFinished(true);
      if (score >= PASS) onPass();
    }
  };

  const retry = () => {
    setPicks(questions.map(() => null));
    setIndex(0);
    setFinished(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(24,30,36,0.5)] sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Quiz: ${courseTitle}`}
    >
      <div
        className="flex max-h-full w-full max-w-[600px] flex-col gap-10 overflow-y-auto rounded-t-[16px] bg-white p-6 sm:gap-[60px] sm:rounded-[12px] sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-6 sm:gap-[60px]">
          <div className="flex flex-1 flex-col gap-4">
            <p className="text-[16px] font-medium leading-[22px] text-black">Quiz: {courseTitle}</p>
            <p className="text-[14px] leading-[22px] text-[#181e24]">
              {finished ? "Results" : `Question ${index + 1} of ${questions.length}`}
            </p>
            <div className="h-1.5 overflow-hidden rounded-[8px] bg-[#dfe3e6]">
              <div
                className="h-full rounded-[8px] bg-[#0084ff] transition-[width] duration-300"
                style={{ width: `${((finished ? questions.length : index + (pick !== null ? 1 : 0)) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <button onClick={onClose} aria-label="Close quiz" className="text-[#a7b1b9] hover:text-[#5b6671]">
            <X size={20} />
          </button>
        </div>

        {finished ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className={`flex size-16 items-center justify-center rounded-full ${passed ? "bg-[rgba(0,134,73,0.15)] text-[#008649]" : "bg-[rgba(204,0,82,0.12)] text-[#cc0052]"}`}>
              {passed ? <PartyPopper size={30} /> : <X size={30} />}
            </div>
            <h2 className="font-display text-[20px] text-[#181e24]">{passed ? "Nice work — you passed!" : "Not quite"}</h2>
            <p className="text-[14px] leading-[22px] text-[#5b6671]">
              You got {score} of {questions.length} correct.{" "}
              {passed ? "Credit for this course has been added to your transcript." : `You need ${PASS} correct to pass.`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-[20px] leading-tight text-[#181e24]">{q.question}</h2>
            <div className="flex flex-col gap-2" role="radiogroup">
              {q.answers.map((a, i) => {
                const answered = pick !== null;
                const isCorrect = i === q.correct;
                const isPicked = i === pick;
                return (
                  <button
                    key={a}
                    role="radio"
                    aria-checked={isPicked}
                    disabled={answered}
                    onClick={() => setPicks((p) => p.map((v, j) => (j === index ? i : v)))}
                    className={`flex min-h-[54px] items-center justify-between gap-3 rounded-[4px] border px-3 py-2 text-left text-[14px] leading-[22px] tracking-[-0.28px] text-[#181e24] transition-colors ${
                      answered
                        ? isCorrect
                          ? "border-[#008649]/30 bg-[rgba(0,134,73,0.05)]"
                          : isPicked
                            ? "border-[#cc0052]/30 bg-[rgba(204,0,82,0.05)]"
                            : "border-[#f0f3f5] bg-white"
                        : "border-[#f0f3f5] bg-white hover:border-[#0084ff] hover:bg-[#f7fbff]"
                    }`}
                  >
                    {a}
                    {answered && isCorrect && (
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[rgba(0,134,73,0.15)] text-[#008649]">
                        <Check size={14} />
                      </span>
                    )}
                    {answered && isPicked && !isCorrect && (
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[rgba(204,0,82,0.15)] text-[#cc0052]">
                        <X size={14} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-[18px]">
          {finished ? (
            passed ? (
              <Button onClick={onClose} className="h-10 px-4 text-[14px]">
                Done
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={onClose} className="h-10 px-4 text-[14px]">
                  Rewatch video
                </Button>
                <Button onClick={retry} className="h-10 px-4 text-[14px]">
                  Try again
                </Button>
              </>
            )
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => (index === 0 ? onClose() : setIndex(index - 1))}
                className="h-10 px-4 text-[14px]"
              >
                Back
              </Button>
              <Button onClick={next} disabled={pick === null} className="h-10 px-4 text-[14px]">
                {index === questions.length - 1 ? "Finish" : "Next"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
