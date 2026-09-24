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
  title: "SearchUnify | Agentic AI for Enterprise Customer Support",
  description:
    "SearchUnify unifies your enterprise knowledge and powers AI agents that resolve customer support, end to end.",
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
