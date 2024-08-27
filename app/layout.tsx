import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/header";
import { SocketProvider } from "@/components/socket-provider";
import {
  APP_DESCRIPTION,
  APP_NAME,
  APP_THEME_COLOR_DARK,
  APP_THEME_COLOR_LIGHT,
} from "@/utils/const";
import "@/globals.css";

const APP_URL = new URL(process.env["BASE_URL"]!);

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  icons: {
    icon: [
      { url: "/icon-light.svg" },
      { url: "/icon-dark.svg", media: "(prefers-color-scheme: dark)" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "default",
  },
  metadataBase: APP_URL,
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    url: APP_URL,
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { color: APP_THEME_COLOR_LIGHT, media: "(prefers-color-scheme: light)" },
    { color: APP_THEME_COLOR_DARK, media: "(prefers-color-scheme: dark)" },
  ],
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
