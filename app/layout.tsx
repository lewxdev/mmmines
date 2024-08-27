import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/header";
import { SocketProvider } from "@/components/socket-provider";
import "@/globals.css";

const title = "mmmines!";
const description = "an endless, massive multiplayer minesweeper game";

export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: [
      { url: "/icon-light.svg" },
      { url: "/icon-dark.svg", media: "(prefers-color-scheme: dark)" },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title,
  },
  metadataBase: new URL(process.env["BASE_URL"]!),
  openGraph: {
    title,
    description,
    siteName: title,
    url: "https://mmmines.fly.dev",
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout(props: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans antialiased dark:bg-slate-950">
        <main className="flex h-[100dvh] flex-col items-center">
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
