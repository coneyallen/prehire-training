"use client";

import { useEffect, useState } from "react";
import { Check, PartyPopper, X } from "lucide-react";
import { Button } from "@/components/ui";
import { getQuiz } from "@/lib/data";

// The quiz isn't graded: a wrong pick is marked, and the user keeps trying until they find the right answer.
// Layout follows the Figma frames "Quiz Modal - Web" (a 600px pop-up) and "Quiz - Modal" (full screen on phones).
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
      className="fixed inset-x-0 bottom-0 top-[60px] z-50 bg-white md:top-0 md:flex md:items-center md:justify-center md:bg-[rgba(24,30,36,0.5)] md:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Quiz: ${courseTitle}`}
    >
      <div
        className="relative flex size-full flex-col border-t border-[rgba(24,30,36,0.15)] bg-white py-8 md:h-auto md:max-h-full md:max-w-[600px] md:gap-[60px] md:overflow-y-auto md:rounded-[12px] md:border-0 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close quiz"
          className="absolute right-4 top-8 text-[#a7b1b9] hover:text-[#5b6671] md:right-10 md:top-10"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        <div className="flex flex-col gap-4 px-4 md:px-0">
          <p className="pr-8 text-[16px] font-medium leading-[22px] text-black">Quiz: {courseTitle}</p>
          {!finished && (
            <>
              <p className="text-[14px] leading-[22px] text-[#181e24]">
                Question {index + 1} of {questions.length}
              </p>
              <div className="h-1.5 overflow-hidden rounded-[8px] bg-[#dfe3e6]">
                <div className="h-full rounded-[8px] bg-[#0084ff] transition-[width] duration-300" style={{ width: `${answered * 100}%` }} />
              </div>
            </>
          )}
        </div>

        <div className="mt-[25px] min-h-0 flex-1 overflow-y-auto px-4 py-6 md:mt-0 md:flex-none md:overflow-visible md:p-0">
          {finished ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-[rgba(0,134,73,0.15)] text-[#008649]">
                <PartyPopper size={30} />
              </div>
              <h2 className="font-display text-[20px] leading-[1.2] text-[#181e24]">Nice job!</h2>
              <p className="text-[14px] leading-[22px] text-[#5b6671]">You&apos;ve earned credit for this course.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-[20px] leading-[1.2] text-[#181e24]">{q.question}</h2>
              <div className="flex flex-col gap-2">
                {q.answers.map((a, i) => {
                  const isRight = solved[index] && i === q.correct;
                  const isWrong = wrong[index].includes(i);
                  return (
                    <button
                      key={a}
                      onClick={() => choose(i)}
                      disabled={solved[index] || isWrong}
                      className={`flex min-h-[54px] items-center justify-between gap-3 rounded-[4px] border bg-white px-3 py-1 text-left text-[14px] leading-[22px] tracking-[-0.28px] text-[#181e24] transition-colors ${
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
        </div>

        <div className="flex items-center justify-end gap-[18px] px-4 md:px-0">
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
