"use client";

import { useEffect, useState } from "react";
import { Check, PartyPopper, X } from "lucide-react";
import { Button } from "@/components/ui";
import { getQuiz } from "@/lib/data";

// The quiz isn't graded: a wrong pick is marked, and the user keeps trying until they find the right answer.
export function QuizModal({
  courseTitle,
  onClose,
  onComplete,
}: {
  courseTitle: string;
  onClose: () => void;
  onComplete: () => void;
}) {
  const questions = getQuiz();
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState<number[][]>(() => questions.map(() => []));
  const [solved, setSolved] = useState<boolean[]>(() => questions.map(() => false));
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = questions[index];
  const isLast = index === questions.length - 1;
  const answered = (index + (solved[index] ? 1 : 0)) / questions.length;

  const choose = (i: number) => {
    if (solved[index]) return;
    if (i === q.correct) setSolved((s) => s.map((v, j) => (j === index ? true : v)));
    else setWrong((w) => w.map((v, j) => (j === index && !v.includes(i) ? [...v, i] : v)));
  };

  const next = () => {
    if (!isLast) return setIndex(index + 1);
    setFinished(true);
    onComplete();
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
            {!finished && (
              <p className="text-[14px] leading-[22px] text-[#181e24]">
                Question {index + 1} of {questions.length}
              </p>
            )}
          </div>
          <button onClick={onClose} aria-label="Close quiz" className="text-[#a7b1b9] hover:text-[#5b6671]">
            <X size={20} />
          </button>
        </div>
        {!finished && (
          <div className="-mt-6 h-1.5 overflow-hidden rounded-[8px] bg-[#dfe3e6] sm:-mt-11">
            <div className="h-full rounded-[8px] bg-[#0084ff] transition-[width] duration-300" style={{ width: `${answered * 100}%` }} />
          </div>
        )}

        {finished ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-[rgba(0,134,73,0.15)] text-[#008649]">
              <PartyPopper size={30} />
            </div>
            <h2 className="font-display text-[20px] text-[#181e24]">Nice job!</h2>
            <p className="text-[14px] leading-[22px] text-[#5b6671]">You&apos;ve earned credit for this course.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-[20px] leading-tight text-[#181e24]">{q.question}</h2>
            <div className="flex flex-col gap-2">
              {q.answers.map((a, i) => {
                const isRight = solved[index] && i === q.correct;
                const isWrong = wrong[index].includes(i);
                return (
                  <button
                    key={a}
                    onClick={() => choose(i)}
                    disabled={solved[index] || isWrong}
                    className={`flex min-h-[54px] items-center justify-between gap-3 rounded-[4px] border bg-white px-3 py-2 text-left text-[14px] leading-[22px] tracking-[-0.28px] text-[#181e24] transition-colors ${
                      solved[index] || isWrong ? "border-[#f0f3f5]" : "border-[#f0f3f5] hover:border-[#0084ff] hover:bg-[#f7fbff]"
                    }`}
                  >
                    {a}
                    {isRight && (
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[rgba(0,134,73,0.15)] text-[#008649]" aria-label="Correct">
                        <Check size={14} />
                      </span>
                    )}
                    {isWrong && (
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[rgba(204,0,82,0.15)] text-[#cc0052]" aria-label="Incorrect">
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
            <Button onClick={onClose} className="h-10 px-4 text-[14px]">
              Done
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => (index === 0 ? onClose() : setIndex(index - 1))} className="h-10 px-4 text-[14px]">
                Back
              </Button>
              <Button onClick={next} disabled={!solved[index]} className="h-10 px-4 text-[14px]">
                {isLast ? "Submit" : "Next"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
