import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TravelCheck - Decentralized Travel Check-in DApp",
  description: "Earn rewards for every destination you visit. Join the decentralized travel network today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
