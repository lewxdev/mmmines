import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/header";
import { SocketProvider } from "@/components/socket-provider";
import { app } from "@/utils/const";
import "@/globals.css";

export const metadata: Metadata = {
  title: app.NAME,
  description: app.DESCRIPTION,
  icons: {
    icon: [
      { url: "/icon-light.svg" },
      { url: "/icon-dark.svg", media: "(prefers-color-scheme: dark)" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: app.NAME,
    statusBarStyle: "default",
  },
  metadataBase: app.URL,
  openGraph: {
    title: app.NAME,
    description: app.DESCRIPTION,
    siteName: app.NAME,
    url: app.URL,
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { color: app.THEME_COLOR_LIGHT, media: "(prefers-color-scheme: light)" },
    { color: app.THEME_COLOR_DARK, media: "(prefers-color-scheme: dark)" },
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
