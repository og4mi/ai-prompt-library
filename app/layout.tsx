import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-prompt-library.netlify.app"),
  title: "Curata - Never Rewrite the Perfect Prompt",
  description: "Never rewrite the perfect prompt. Organize and manage your AI prompts with Curata.",
  openGraph: {
    title: "Curata - Never Rewrite the Perfect Prompt",
    description: "Never rewrite the perfect prompt. Organize and manage your AI prompts with Curata.",
    images: [
      {
        url: "/Curata_Opengrah.png",
        width: 1200,
        height: 630,
        alt: "Curata - AI Prompt Library Manager",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Curata - Never Rewrite the Perfect Prompt",
    description: "Never rewrite the perfect prompt. Organize and manage your AI prompts with Curata.",
    images: ["/Curata_Opengrah.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
