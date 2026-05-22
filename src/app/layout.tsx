// =============================================================
// app/layout.tsx — Root Layout
// =============================================================

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cypher Lite — AI Learning Companion",
  description:
    "Learn by Thinking, Not Copying. Cypher Lite is an AI-powered educational chatbot that guides students toward understanding through Socratic teaching.",
  keywords: [
    "AI Tutor",
    "Educational AI",
    "Multimodal AI",
    "RAG",
    "Groq",
    "Vercel AI SDK",
    "Tool Calling",
    "Learning Companion",
  ],
  openGraph: {
    title: "Cypher Lite — AI Learning Companion",
    description: "Learn by Thinking, Not Copying.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {/* Animated background */}
        <div className="animated-bg" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
