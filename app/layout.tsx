import "./globals.css";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { HomeContentProvider } from "@/components/home-content-provider";

export const metadata = {
  title: "Kickers Academy",
  description: "A sporty football academy website with an admin dashboard and custom store."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <HomeContentProvider>{children}</HomeContentProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
