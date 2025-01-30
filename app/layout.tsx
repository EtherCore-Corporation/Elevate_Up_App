import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from './providers'
import { spaceGrotesk } from '@/styles/fonts'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ElevateUp",
  description: "Project Management Tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="min-h-screen bg-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
