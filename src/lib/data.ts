/** Icon names for placeholder art (used where there are no real images yet). */
export type PlaceholderIcon =
  | "rocket"
  | "smartphone"
  | "log-in"
  | "layout"
  | "user"
  | "bell"
  | "help"
  | "clock"
  | "calendar"
  | "clipboard"
  | "alert"
  | "plane";

export type Course = {
  id: string;
  title: string;
  duration: string;
  due: string;
  thumbnail: string;
  illustration?: boolean; // thumbnail is a spot illustration: show it whole on a light panel
  description: string;
};

export type Skill = {
  id: string;
  title: string;
  icon: string;
  placeholder?: PlaceholderIcon; // shown instead of the icon image when set
  tint: string; // card background
  bar: string; // progress bar fill
  courses: Course[];
};

export type Program = {
  id: string;
  title: string;
  banner: string; // CSS background for the program banner
  track: string; // progress bar track
  skills: Skill[];
};

export type QuizQuestion = {
  question: string;
  answers: string[];
  correct: number;
};

const due = "09/15/2026";
const t = (name: string) => `/assets/thumb-${name}.png`;

const preHireSkills: Skill[] = [
  {
    id: "custodian",
    title: "Your Role as a Custodian",
    icon: "/assets/skill-custodian.png",
    tint: "bg-[rgba(0,132,255,0.1)]",
    bar: "bg-[#4c469c]",
    courses: [
      {
        id: "daily-cleaning-logs",
        title: "Daily Cleaning Logs",
        duration: "15:32",
        due,
        thumbnail: t("daily-cleaning-logs"),
        description:
          "Learn how to fill out and sign the daily cleaning and disinfection log so every area you service is documented.",
      },
      {
        id: "disinfectant-cleaning",
        title: "Disinfectant Cleaning",
        duration: "15:32",
        due,
        thumbnail: t("disinfectant-cleaning"),
        description:
          "Learn which disinfectants to use, how long they need to sit, and how to apply them safely on high-touch surfaces.",
      },
      {
        id: "active-shooter-awareness",
        title: "Active Shooter Awareness",
        duration: "15:32",
        due,
        thumbnail: t("active-shooter"),
        description:
          "Learn the Run, Hide, Fight response and what to do to keep yourself and others safe during an emergency.",
      },
      {
        id: "stairway-safety",
        title: "Stairway Safety",
        duration: "15:32",
        due,
        thumbnail: t("stairway-safety"),
        description:
          "Learn how to clean stairways safely, use signage correctly, and avoid slips and falls while working on stairs.",
      },
      {
        id: "good-catch",
        title: "Good Catch",
        duration: "15:32",
        due,
        thumbnail: t("good-catch"),
        description:
          "Learn how to spot hazards before they cause harm and how to report a Good Catch to your supervisor.",
      },
      {
        id: "associate-incident-reporting",
        title: "Associate Incident Reporting",
        duration: "9:35",
        due,
        thumbnail: t("incident-reporting"),
        description:
          "Learn the process and detailed methods for reporting injuries, near misses and incidents so they can be addressed quickly.",
      },
      {
        id: "disinfecting-high-traffic-spaces",
        title: "Disinfecting High Traffic Spaces",
        duration: "15:32",
        due,
        thumbnail: t("high-traffic"),
        description:
          "Learn the process and detailed methods for cleaning lobbies, hallways and restrooms that see heavy foot traffic.",
      },
      {
        id: "payroll-overview",
        title: "Payroll Overview",
        duration: "15:32",
        due,
        thumbnail: t("payroll"),
        description:
          "Learn how pay periods work, how to read your pay stub, and who to contact with payroll questions.",
      },
      {
        id: "eye-protection",
        title: "Eye Protection",
        duration: "15:32",
        due,
        thumbnail: t("eye-protection"),
        description:
          "Learn when safety glasses or goggles are required and how to choose and care for the right eye protection.",
      },
      {
        id: "hand-protection",
        title: "Hand Protection",
        duration: "15:32",
        due,
        thumbnail: t("hand-protection"),
        description:
          "Learn which gloves to wear for each task and chemical, and how to put them on and remove them safely.",
      },
    ],
  },
  {
    id: "safe-work",
    title: "Safe Work Practices",
    icon: "/assets/skill-safety.png",
    tint: "bg-[rgba(0,132,255,0.1)]",
    bar: "bg-[#0084ff]",
    courses: [
      ["slips-trips-falls", "Slips, Trips & Falls", "stairway-safety"],
      ["chemical-handling", "Chemical Handling & SDS", "disinfectant-cleaning"],
      ["safe-lifting", "Safe Lifting Techniques", "payroll"],
      ["ladder-safety", "Ladder Safety", "stairway-safety"],
      ["bloodborne-pathogens", "Bloodborne Pathogens", "hand-protection"],
      ["fire-safety", "Fire Safety & Evacuation", "active-shooter"],
      ["ppe-basics", "PPE Basics", "eye-protection"],
      ["hazard-communication", "Hazard Communication", "good-catch"],
      ["wet-floor-procedures", "Wet Floor Procedures", "high-traffic"],
      ["reporting-hazards", "Reporting Hazards", "incident-reporting"],
    ].map(([id, title, thumb]) => ({
      id,
      title,
      duration: "15:32",
      due,
      thumbnail: t(thumb),
      description: `Learn the key practices behind ${title.toLowerCase()} so you can do your job safely from day one.`,
    })),
  },
];

// Demo content for the second program (the Figma frame repeats the Pre-Hire courses as placeholders).
// Thumbnails are unDraw illustrations (see public/assets/illustrations/LICENSE.md).
const course = (id: string, title: string, description: string): Course => ({
  id,
  title,
  duration: "15:32",
  due,
  thumbnail: `/assets/illustrations/${id}.svg`,
  illustration: true,
  description,
});

const introSkills: Skill[] = [
  {
    id: "getting-started-4insite",
    title: "Getting Started with 4insite",
    icon: "",
    placeholder: "rocket",
    tint: "bg-[rgba(200,197,246,0.25)]",
    bar: "bg-[#4c469c]",
    courses: [
      course("logging-in", "Logging In to 4insite", "Learn how to sign in to the 4insite app and keep your account secure."),
      course("navigating-the-app", "Navigating the App", "Take a quick tour of the 4insite home screen and where to find what you need."),
      course("your-profile", "Setting Up Your Profile", "Add your photo and details so your team knows who you are."),
      course("notifications", "Notifications and Messages", "Learn how 4insite keeps you up to date on schedules, tasks and announcements."),
      course("getting-help", "Getting Help in 4insite", "Find answers fast and learn who to contact when you need support."),
    ],
  },
  {
    id: "using-4insite",
    title: "Using 4insite on the Job",
    icon: "",
    placeholder: "smartphone",
    tint: "bg-[rgba(200,197,246,0.25)]",
    bar: "bg-[#0084ff]",
    courses: [
      course("clocking-in", "Clocking In and Out", "Learn how to clock in and out of your shift using 4insite."),
      course("your-schedule", "Viewing Your Schedule", "See your upcoming shifts and where you'll be working."),
      course("completing-inspections", "Completing Inspections", "Learn how to complete and submit an area inspection in 4insite."),
      course("reporting-issues", "Reporting Issues", "Report a hazard, damage or supply need right from your phone."),
      course("time-off", "Requesting Time Off", "Learn how to request time off and check its status."),
    ],
  },
];

export const programs: Program[] = [
  {
    id: "pre-hire",
    title: "Pre-Hire",
    banner: "linear-gradient(146.4deg, #181e24 9.6%, #006acd 59.6%)",
    track: "bg-[#00509c]",
    skills: preHireSkills,
  },
  {
    id: "intro-4insite",
    title: "Introduction to 4insite",
    banner: "linear-gradient(175.9deg, #4c469c 37.3%, #635cbb 80.8%)",
    track: "bg-[#3d3888]",
    skills: introSkills,
  },
];

export const skills = programs.flatMap((p) => p.skills);

/** Courses already completed when the demo starts (matches the Figma file). */
export const initiallyCompleted = [
  "daily-cleaning-logs",
  "disinfectant-cleaning",
  "active-shooter-awareness",
  "stairway-safety",
  "good-catch",
];

export const allCourses = skills.flatMap((s) => s.courses);

export function findCourse(id: string) {
  for (const skill of skills) {
    const course = skill.courses.find((c) => c.id === id);
    if (course) return { skill, course };
  }
  return null;
}

export const languages = ["English", "Spanish", "中文", "हिन्दी", "Français", "العربية", "বাংলা", "Português", "Русский"];

// Every course uses the same demo quiz.
const quiz: QuizQuestion[] = [
  {
    question: "When should you report a workplace incident?",
    answers: [
      "At the end of the week, with your timesheet.",
      "It should be reported immediately.",
      "Only if someone needed medical care.",
      "Only if your supervisor saw it happen.",
    ],
    correct: 1,
  },
  {
    question: "A wet floor almost caused a fall, but no one was hurt. What should you do?",
    answers: [
      "Nothing, since no one was injured.",
      "Mop it up and forget about it.",
      "Report it as a near miss so it can be prevented.",
      "Mention it at next month's team meeting.",
    ],
    correct: 2,
  },
  {
    question: "What belongs in an incident report?",
    answers: [
      "Who was at fault and what their punishment should be.",
      "Your opinion of the people involved.",
      "Only the name of the person who was hurt.",
      "What happened, when and where, and who was involved.",
    ],
    correct: 3,
  },
];

export function getQuiz() {
  return quiz;
}
