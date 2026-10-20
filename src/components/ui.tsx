"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Languages, RotateCcw } from "lucide-react";
import { languages } from "@/lib/data";
import { useStore } from "@/lib/store";

/** Image that collapses to a neutral block if the file is missing. */
export function Img({ src, alt = "", className = "" }: { src: string; alt?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  // The image can fail before React attaches onError, so also check after mount.
  useEffect(() => {
    const img = ref.current;
     
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);
  if (failed) return <div aria-hidden className={`${className} bg-black/5`} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}

/** 4insite logo, built from the three layers in the Figma file. */
export function Logo4insite({ className = "h-[30px] w-[116px]" }: { className?: string }) {
  return (
    <div className={`relative shrink-0 ${className}`} role="img" aria-label="4insite">
      <div className="absolute inset-[16.69%_0_16.17%_31.26%]">
        <Img src="/assets/4insite-logo-word.svg" className="absolute inset-0 size-full" />
      </div>
      <div className="absolute inset-[18.72%_28.78%_72.93%_52.73%]">
        <Img src="/assets/4insite-logo-dot.svg" className="absolute inset-0 size-full" />
      </div>
      <div className="absolute inset-y-0 left-0 right-3/4">
        <Img src="/assets/4insite-logo-mark.svg" className="absolute inset-0 size-full" />
      </div>
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "locked" }) {
  const styles = {
    primary: "bg-[#0084ff] text-[#fafbfc] enabled:hover:bg-[#0070d9] disabled:bg-[#0084ff]/30",
    ghost: "bg-white text-[#0084ff] hover:bg-[#f0f7ff]",
    locked: "bg-[#f0f3f5] text-[#a7b1b9] cursor-not-allowed",
  }[variant];
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-[4px] font-medium transition-colors ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function LanguageMenu() {
  const { language, setLanguage } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 items-center gap-3 rounded-[8px] border border-[#f0f3f5] bg-white px-3 text-[14px] font-medium text-[#181e24] hover:bg-[#fafbfc]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Languages size={16} className="text-[#5b6671]" />
        <span className="hidden min-w-[46px] text-left sm:inline">{language}</span>
        <ChevronDown size={16} className="text-[#a7b1b9]" />
      </button>
      {open && (
        <ul role="listbox" className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-[8px] border border-[#f0f3f5] bg-white py-1 shadow-lg">
          {languages.map((l) => (
            <li key={l}>
              <button
                role="option"
                aria-selected={l === language}
                onClick={() => {
                  setLanguage(l);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-[14px] hover:bg-[#f0f3f5] ${l === language ? "font-medium text-[#0084ff]" : "text-[#181e24]"}`}
              >
                {l}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AvatarMenu() {
  const { resetDemo } = useStore();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-label="Account menu" className="block rounded-full">
        <Img src="/assets/avatar.png" className="size-9 rounded-full" />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-48 rounded-[8px] border border-[#f0f3f5] bg-white py-1 shadow-lg">
          <Link
            href="/"
            onClick={resetDemo}
            className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#181e24] hover:bg-[#f0f3f5]"
          >
            <RotateCcw size={14} /> Restart demo
          </Link>
        </div>
      )}
    </div>
  );
}

export function Header({ title = "Pre-Hire Training", showLanguage = true }: { title?: string; showLanguage?: boolean }) {
  return (
    <header className="sticky top-0 z-10 grid h-[60px] grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_1fr] items-center bg-white px-4 sm:px-8">
      <Link href="/courses" aria-label="Home">
        <Logo4insite />
      </Link>
      <span className="hidden text-[16px] font-medium leading-[22px] text-[#181e24] sm:block">{title}</span>
      <div className="flex items-center justify-end gap-4 sm:gap-6">
        {showLanguage && <LanguageMenu />}
        <AvatarMenu />
      </div>
    </header>
  );
}

export function ProgressBar({ value, track, fill, height = "h-2" }: { value: number; track: string; fill: string; height?: string }) {
  return (
    <div className={`relative ${height} min-w-0 grow overflow-hidden rounded-[8px] ${track}`}>
      <div className={`absolute inset-y-0 left-0 rounded-[8px] ${fill} transition-[width] duration-500`} style={{ width: `${value * 100}%` }} />
    </div>
  );
}
