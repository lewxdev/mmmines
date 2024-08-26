import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Header } from "@/components/header";
import { SocketProvider } from "@/components/socket-provider";
import { ThemeProvider } from "@/components/theme-provider";
import "@/globals.css";

export const metadata: Metadata = {
  title: "mmmines",
};

export default function RootLayout(props: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en" className={GeistSans.variable}>
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
