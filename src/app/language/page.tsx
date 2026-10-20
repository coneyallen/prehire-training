"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button, Header, Img } from "@/components/ui";
import { languages } from "@/lib/data";
import { useStore } from "@/lib/store";

// Spacing follows the Figma frames "Choose Language" (desktop card) and "Choose Language - Mobile".
export default function LanguagePage() {
  const router = useRouter();
  const { name, language, setLanguage } = useStore();

  return (
    <div className="flex h-dvh flex-col">
      <Header title="Training" mobileTitle="Pre-Hire Training" showLanguage={false} />
      <main className="flex min-h-0 flex-1 md:items-center md:justify-center md:px-4 md:py-10">
        {/* Phones: a full-height white panel. Larger screens: a centered card. */}
        <div className="relative flex min-h-0 w-full flex-1 flex-col gap-[25px] bg-white py-8 md:max-w-[438px] md:flex-none md:rounded-[16px]">
          <div className="flex flex-col gap-4 px-4 text-black md:px-8">
            <h1 className="font-display text-[20px] leading-[1.2]">Welcome, {name}</h1>
            <p className="text-[16px] font-medium leading-[22px]">To begin, please select your language</p>
          </div>
          <Img src="/assets/translate.svg" className="absolute right-[29px] top-[30px] h-5 w-[22.5px]" />

          <ul
            role="radiogroup"
            aria-label="Language"
            className="min-h-0 flex-1 overflow-y-auto border-y border-[#f0f3f5] md:h-[324px] md:flex-none"
          >
            {languages.map((l) => {
              const selected = l === language;
              return (
                <li key={l} className="border-b border-[#f0f3f5]">
                  <button
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setLanguage(l)}
                    className={`flex w-full items-center justify-between px-8 py-6 text-left transition-colors ${
                      selected ? "bg-[#eff6ff] text-[#0084ff]" : "text-black hover:bg-[#fafbfc]"
                    }`}
                  >
                    <p className={`text-[16px] leading-6 ${selected ? "font-medium" : ""}`}>{l}</p>
                    {selected && <Check size={18} className="-my-1" />}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="px-[14px] md:px-8">
            <Button onClick={() => router.push("/courses")} className="h-12 w-full text-[16px] tracking-[-0.32px]">
              Continue
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
