# Pre-Hire Training — interactive prototype

A clickable prototype of the 4insite pre-hire training experience, built from the Figma designs with Next.js and Tailwind CSS.

## Demo flow

1. **Login** — any User ID and password work (leave blank to sign in as "Jane").
2. **Choose language** — pick a language; it's remembered in the header menu.
3. **Course list** — a welcome banner with start details, a "Before your Start Date" checklist (Edit Profile checks off the profile task), and My Training: two programs (Pre-Hire and Introduction to 4insite) with collapsible skills and All / Remaining / Completed filters.
4. **Course video** — press play to jump to the end of the video and unlock the quiz.
5. **Quiz** — 3 questions, not graded. A wrong pick is marked, and the user keeps trying until they choose the right answer. Finishing earns credit for the course.

Progress is saved in the browser. Use the avatar menu → **Restart demo** to reset.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Images

The images come from the Figma file. To download them into `public/assets`:

```bash
./scripts/fetch-figma-assets.sh
```

Figma's download links expire about a week after they were generated. If they have expired, export the images from Figma and save them under the file names listed in the script. Any missing image shows as a neutral placeholder.

## Deploy

Import this repo into [Vercel](https://vercel.com/new). It detects Next.js automatically, so no settings are needed.
