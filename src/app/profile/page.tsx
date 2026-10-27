"use client";

import { Languages, Plus } from "lucide-react";
import { CalendarIcon, PencilIcon } from "@heroicons/react/24/solid";
import EG from "country-flag-icons/react/3x2/EG";
import FR from "country-flag-icons/react/3x2/FR";
import IT from "country-flag-icons/react/3x2/IT";
import US from "country-flag-icons/react/3x2/US";
import { BackLink, Button, Header, Img } from "@/components/ui";
import { useStore } from "@/lib/store";

// Layout follows the Figma frame "Profile" (desktop, 1440).
// Text is trimmed to cap height (see globals.css), so gaps here are the gaps between letters in Figma.

const a = (name: string) => `/assets/profile/${name}.png`;

// Jane is the demo user; the welcome banner uses her first name only.
const lastName = "Ramirez";

const aboutMe = [
  "I speak Spanish and English and I would like to learn French.",
  "My favorite movie is Ghost.",
  "My most memorable moment was the birth of my children.",
  "The greatest lesson I have learned is that good things don't come easy.",
];

// Image sizes are the ones used in the design (written out so Tailwind can see them).
const family = [
  { label: "Me", img: "family-me", size: "h-[78px] w-[56px]" },
  { label: "Husband", img: "family-husband", size: "h-[82px] w-[62px]" },
  { label: "Daughter", img: "family-daughter", size: "h-[65px] w-[41px]" },
  { label: "Son", img: "family-son", size: "h-[67px] w-[44px]" },
  { label: "Pet", img: "family-pet", size: "h-[66px] w-[42px]" },
];

const interests = [
  { label: "Beach", img: "beach" },
  { label: "Camping", img: "camping" },
  { label: "Music", img: "music" },
  { label: "Running", img: "running" },
  { label: "Travel", img: "travel" },
];

const travel = [
  { label: "Egypt", Flag: EG },
  { label: "United States", Flag: US },
  { label: "France", Flag: FR },
  { label: "Italy", Flag: IT },
];

function EditButton({ label, className = "text-[#181e24]" }: { label: string; className?: string }) {
  return (
    <button aria-label={label} className={`-m-2 flex size-[30px] shrink-0 items-center justify-center rounded-full hover:bg-black/5 ${className}`}>
      <PencilIcon className="size-[14px]" />
    </button>
  );
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`flex flex-col gap-6 rounded-[8px] bg-[#fafbfc] p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-[20px] leading-[1.2] text-[#181e24]">{title}</h3>
        <EditButton label={`Edit ${title}`} />
      </div>
      {children}
    </section>
  );
}

function ProfileHeader({ name, language }: { name: string; language: string }) {
  return (
    <div className="relative flex flex-col px-4 md:flex-row md:gap-8 md:px-0">
      <div className="relative -mt-[60px] w-fit shrink-0 md:-mt-8">
        <Img src="/assets/profile/photo.png" alt={`${name} ${lastName}`} className="size-[120px] rounded-full object-cover md:size-[187px]" />
        <button
          aria-label="Change profile picture"
          className="absolute left-[93px] top-[9px] flex size-[30px] items-center justify-center rounded-full bg-[#fafbfc] text-[#181e24] shadow-[0_4px_4px_rgba(24,30,36,0.04)] hover:bg-white md:left-[145px] md:top-[14.5px]"
        >
          <PencilIcon className="size-[14px]" />
        </button>
      </div>

      <div className="mt-6 flex min-w-0 flex-1 flex-col gap-6 md:mt-0 md:flex-row md:items-start md:justify-between md:pt-[25.5px]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-[28px] leading-[1.2] text-[#181e24] md:text-[32px]">{name} {lastName}</h2>
            <div className="flex flex-wrap items-center gap-[6px] text-[16px] font-medium leading-[22px] text-[#181e24]">
              <p>Custodian</p>
              <span aria-hidden className="size-[3px] rounded-full bg-[#181e24]" />
              <p>Acme Corp</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 text-[16px] font-medium leading-[22px] text-[#5b6671]">
            <div className="flex h-[11px] items-center gap-2">
              <CalendarIcon className="size-4" />
              <p>Start Date: November 3, 2026</p>
            </div>
            <div className="flex h-[11px] items-center gap-2">
              <Languages className="size-4" strokeWidth={2.25} />
              <p>Preferred Language: {language}</p>
            </div>
          </div>
        </div>
        <Button className="h-10 w-fit shrink-0 px-4 text-[14px]">
          <Plus className="size-4" strokeWidth={2.5} /> Add My Story
        </Button>
      </div>
    </div>
  );
}

function AboutMe() {
  return (
    <section className="relative isolate flex flex-col gap-8 overflow-hidden rounded-[8px] bg-[#006acd] px-6 pb-12 pt-6 text-[#fafbfc]">
      {/* Decorative pattern, rotated and blended as in the design */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[calc(50%-1.5px)] -z-10 flex h-[616px] w-[924px] -translate-x-1/2 -translate-y-1/2 items-center justify-center mix-blend-color-burn"
      >
        <Img src={a("about-pattern")} className="h-[924px] w-[616px] max-w-none rotate-90 object-cover opacity-15" />
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-medium leading-[22px]">About Me</h3>
        <EditButton label="Edit About Me" className="text-[#fafbfc]" />
      </div>

      <div className="flex flex-col gap-10">
        <div className="flex items-start">
          <Img src="/assets/profile/quote.svg" className="-mr-3 h-10 w-[50px] shrink-0 mix-blend-multiply" />
          {/* Runs 30px past the card padding, like the text box in the design */}
          <p className="min-w-0 flex-1 lg:-mr-[30px] font-[family-name:var(--font-lato)] text-[24px] font-bold leading-[29px] md:text-[28px] md:leading-[33px]">
            My proudest accomplishment is being a good mother to my children.
          </p>
        </div>
        <ul className="flex flex-col gap-4 pl-5">
          {aboutMe.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span aria-hidden className="mt-[3px] size-[6px] shrink-0 rounded-full bg-current" />
              <p className="min-w-0 flex-1 text-[16px] leading-6">{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function ProfilePage() {
  const { name, language } = useStore();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1440px] pb-16 pt-6 md:px-8 md:pt-8 lg:pb-[106px]">
        <h1 className="sr-only">Employee Profile</h1>
        <div className="px-4 md:px-0">
          <BackLink />
        </div>

        {/* Banner: the image is flipped and blended over blue, as in the design */}
        <div className="relative mt-6 h-[140px] overflow-hidden bg-[#0084ff] md:h-[235px] md:rounded-[4px]">
          <div className="absolute left-[calc(50%-110px)] top-[calc(50%+40px)] h-[480px] w-[720px] md:left-[calc(50%-120px)] md:top-[calc(50%+30px)] md:h-[733px] md:w-[1100px] lg:left-[calc(50%+31px)] lg:top-[calc(50%+75px)] lg:h-[1005px] lg:w-[1507px] -translate-x-1/2 -translate-y-1/2 mix-blend-luminosity">
            <Img src={a("banner")} className="size-full -scale-x-100 object-cover" />
          </div>
        </div>

        <ProfileHeader name={name} language={language} />

        <div className="mt-12 grid items-start gap-6 px-4 md:px-0 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <AboutMe />
            <Card title="My Family" className="pb-8">
              <ul className="flex flex-wrap">
                {family.map((m) => (
                  <li key={m.label} className="flex w-[100px] flex-col items-center gap-[14px] px-2 pb-2">
                    <div className="flex h-[82px] w-full items-end justify-center">
                      <Img src={a(m.img)} className={`object-contain ${m.size}`} />
                    </div>
                    <p className="text-[14px] leading-[22px] text-[#181e24]">{m.label}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card title="My Interests">
              <ul className="flex flex-wrap">
                {interests.map((i) => (
                  <li key={i.label} className="flex w-[100px] flex-col items-center gap-[14px] p-2">
                    <div className="flex h-[50px] w-[72px] items-center justify-center">
                      <Img src={a(i.img)} className="h-[46px] object-contain" />
                    </div>
                    <p className="text-[14px] leading-[22px] text-[#181e24]">{i.label}</p>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="My Travel">
              <ul className="flex flex-wrap gap-3">
                {travel.map(({ label, Flag }) => (
                  <li key={label} className="flex h-10 items-center gap-2 rounded-full border border-[#dfe3e6] px-4">
                    <Flag aria-hidden className="w-5 rounded-[2px]" />
                    <p className="text-[14px] leading-[22px] text-[#181e24]">{label}</p>
                  </li>
                ))}
              </ul>
              <div className="relative aspect-[628.5/367] overflow-hidden rounded-[4px]">
                <Img
                  src={a("map")}
                  alt="Map highlighting the countries visited"
                  className="absolute left-[52.67%] top-[48.23%] h-[111.72%] w-[112.17%] max-w-none -translate-x-1/2 -translate-y-1/2"
                />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
