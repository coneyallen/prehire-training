import type { Metadata } from "next";
import { Lato, Roboto } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const lato = Lato({ variable: "--font-lato", subsets: ["latin"], weight: ["400", "900"] });
const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Pre-Hire Training · 4insite",
  description: "Interactive prototype of the 4insite pre-hire training experience.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${lato.variable} ${roboto.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
