import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/header";
import { SocketProvider } from "@/components/socket-provider";
import "@/globals.css";

const title = "mmmines!";
const description = "an endless, massive multiplayer minesweeper game";
const baseUrl = process.env["BASE_URL"];

export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: [
      { url: "/icon-light.svg" },
      { url: "/icon-dark.svg", media: "(prefers-color-scheme: dark)" },
    ],
  },
  metadataBase: baseUrl ? new URL(baseUrl) : null,
  openGraph: {
    title,
    description,
    siteName: title,
    url: "https://mmmines.fly.dev",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout(props: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-slate-950 font-sans antialiased">
        <main className="flex flex-col items-center h-[100dvh]">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SocketProvider>
              <Header />
              {props.children}
            </SocketProvider>
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
