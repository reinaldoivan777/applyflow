import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApplyFlow",
  description: "Track your job search from applied to offer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
