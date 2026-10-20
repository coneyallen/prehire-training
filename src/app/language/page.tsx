"use client";

import { useRouter } from "next/navigation";
import { Check, Languages } from "lucide-react";
import { Button, Header } from "@/components/ui";
import { languages } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function LanguagePage() {
  const router = useRouter();
  const { name, language, setLanguage } = useStore();

  return (
    <>
      <Header title="Training" showLanguage={false} />
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="relative flex w-full max-w-[438px] flex-col gap-[25px] rounded-[16px] bg-white py-8">
          <div className="flex flex-col gap-4 px-8 text-black">
            <h1 className="font-display text-[20px] leading-none">Welcome, {name}</h1>
            <p className="text-[16px] font-medium leading-[22px]">To begin, please select your language</p>
          </div>
          <Languages size={18} className="absolute right-8 top-8 text-[#a7b1b9]" aria-hidden />

          <ul role="radiogroup" aria-label="Language" className="border-y border-[#f0f3f5]">
            {languages.map((l) => {
              const selected = l === language;
              return (
                <li key={l} className="border-b border-[#f0f3f5] last:border-b-0">
                  <button
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setLanguage(l)}
                    className={`flex w-full items-center justify-between px-8 py-[18px] text-left text-[16px] leading-6 transition-colors ${
                      selected ? "bg-[#eff6ff] font-medium text-[#0084ff]" : "text-black hover:bg-[#fafbfc]"
                    }`}
                  >
                    {l}
                    {selected && <Check size={18} />}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="px-8">
            <Button onClick={() => router.push("/courses")} className="h-12 w-full text-[16px] tracking-[-0.32px]">
              Continue
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
