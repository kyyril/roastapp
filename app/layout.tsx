import { Analytics } from "@vercel/analytics/next";
import { ToastProviders } from "@/components/ToastProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Balsamiq_Sans } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const balsamiq = Balsamiq_Sans({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-balsamiq",
});

export const metadata: Metadata = {
  title: "InstaCook - Instagram Profile Roaster",
  description: "Roast Instagram profiles with AI-powered humor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${balsamiq.variable}`}>
        <ToastProviders>
          {children}

          <Analytics />
        </ToastProviders>
      </body>
    </html>
  );
}
