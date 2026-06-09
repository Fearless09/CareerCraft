import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../context";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ToastNotification from "../components/shared/ToastNotification";
import FeedbackWidget from "../components/shared/FeedbackWidget";
import { Suspense } from "react";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CareerCraft — Your Premium Career Launchpad",
  description:
    "Craft professional resumes, review insider resume and interview tips, study step-by-step career guides, drill Q&A questions, and read career articles.",
  applicationName: "CareerCraft",
  openGraph: {
    type: "website",
    title: "CareerCraft — Your Premium Career Launchpad",
    description:
      "Craft professional resumes, review insider resume and interview tips, study step-by-step career guides, drill Q&A questions, and read career articles.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerCraft — Your Premium Career Launchpad",
    description:
      "Craft professional resumes, review insider resume and interview tips, study step-by-step career guides, drill Q&A questions, and read career articles.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} h-full scroll-smooth antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="font-body text-primary flex min-h-full flex-col bg-zinc-50 antialiased">
        <Suspense>
          <AppProvider>
            <Navbar />
            {/* Main content pushed down to avoid navbar overlap */}
            <main
              id="main"
              className="flex min-h-[calc(100vh-250px)] flex-1 flex-col pt-19"
            >
              {children}
            </main>
            <Footer />
            <ToastNotification />
            <FeedbackWidget />
          </AppProvider>
        </Suspense>
      </body>
    </html>
  );
}
