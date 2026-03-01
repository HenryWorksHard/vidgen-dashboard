import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VidGen Dashboard",
  description: "AI Video Generation Dashboard - Manage characters, wardrobes, environments, and view generated content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
