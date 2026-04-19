import type { Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIVaiter | AI Receptionist for Restaurants",
  description: "A premium AI receptionist for restaurants and cafés to answer customer questions and capture bookings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoSerif.variable} h-full antialiased bg-background text-foreground`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
