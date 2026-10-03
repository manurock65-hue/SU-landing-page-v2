import type { Metadata } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import { AgentationToolbar } from "@/components/agentation-toolbar";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SearchUnify | AI Support Agents That Don't Bluff",
  description:
    "Every SearchUnify agent retrieves from your CRM, ticketing, knowledge base, docs, community and telemetry before it acts, shows what it found, and hands off when it can't. No source, no action.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <AgentationToolbar />
      </body>
    </html>
  );
}
