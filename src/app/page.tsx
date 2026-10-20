"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Img, Logo4insite } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useStore();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [help, setHelp] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(userId || "Jane");
    router.push("/language");
  };

  return (
    <main className="flex min-h-screen bg-white md:h-screen md:p-4">
      {/* Brand panel: 30% of the screen from tablet up; text and photo scale with its width */}
      <section className="relative hidden w-[30%] shrink-0 flex-col overflow-hidden rounded-[16px] bg-[#00509c] md:flex">
        <div className="pointer-events-none absolute left-[-2px] top-[-73px] flex size-[1224px] items-center justify-center">
          <Img src="/assets/brand-shape.svg" className="size-[866px] -rotate-45" />
        </div>
        <div className="relative flex shrink-0 flex-col gap-[clamp(20px,3.9vw,56px)] px-[clamp(20px,3.3vw,69px)] pb-8 pt-[clamp(32px,6vw,88px)] text-white">
          <h1 className="font-display text-[clamp(22px,2.8vw,48px)] leading-none">
            Welcome to your
            <br />
            pre-hire training
          </h1>
          <p className="text-[clamp(14px,1.3vw,20px)] leading-[2] font-[family-name:var(--font-lato)]">
            Sign in to get started. Completing these courses helps move your hiring process forward.
          </p>
          <p className="text-[clamp(14px,1.3vw,20px)] leading-[2] font-[family-name:var(--font-lato)]">
            Questions? Please reach out to your SBM Hiring Contact
          </p>
        </div>
        {/* Photo sits at the bottom center and scales with the panel width */}
        <div className="relative mt-auto min-h-0">
          <Img
            src="/assets/team.png"
            alt="SBM team members"
            className="relative left-1/2 block h-auto w-[112%] max-w-none -translate-x-1/2"
          />
        </div>
      </section>

      {/* Sign-in form */}
      <section className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-12">
        <form onSubmit={submit} className="flex w-full max-w-[472px] flex-col gap-[47px]">
          <div className="flex items-center gap-6">
            <Img src="/assets/sbm-logo.svg" alt="SBM" className="h-[27px] w-[88px]" />
            <Logo4insite className="h-[31px] w-[125px]" />
          </div>

          <div className="md:hidden">
            <p className="font-display text-[28px] leading-tight text-[#181e24]">Welcome to your pre-hire training</p>
            <p className="mt-3 text-[16px] text-[#5b6671]">
              Sign in to get started. Completing these courses helps move your hiring process forward.
            </p>
          </div>

          <h2 className="font-display text-[48px] leading-none text-black">Login</h2>

          <label className="flex flex-col gap-2">
            <span className="text-[12px] leading-[18px] text-[#5b6671]">User ID</span>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Jane"
              autoComplete="username"
              className="h-10 rounded-[4px] border border-[#d0d5d9] bg-[#fafbfc] px-3 text-[16px] outline-none focus:border-[#0084ff] focus:ring-2 focus:ring-[#0084ff]/20"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-[12px] leading-[18px] text-[#5b6671]">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="h-10 rounded-[4px] border border-[#d0d5d9] bg-[#fafbfc] px-3 text-[16px] outline-none focus:border-[#0084ff] focus:ring-2 focus:ring-[#0084ff]/20"
            />
          </label>

          <div className="flex flex-col gap-6">
            <Button type="submit" className="h-12 w-full text-[16px] tracking-[-0.32px]">
              Sign In
            </Button>
            <button
              type="button"
              onClick={() => setHelp((h) => !h)}
              className="self-start text-[16px] font-medium tracking-[-0.32px] text-[#0084ff] underline"
            >
              Trouble Logging In?
            </button>
            {help && (
              <p className="rounded-[4px] bg-[#eff6ff] p-3 text-[14px] text-[#181e24]">
                This is a demo — any User ID and password will work. Leave them blank to sign in as Jane.
              </p>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
