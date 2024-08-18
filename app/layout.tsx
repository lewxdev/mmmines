import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Header } from "@/components/header";
import "@/globals.css";
import { SocketProvider } from "@/components/socket-provider";

export const metadata: Metadata = {
  title: "mmmines",
};

export default function RootLayout(props: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <main className="flex flex-col items-center h-[100dvh]">
          <SocketProvider>
            <Header />
            {props.children}
          </SocketProvider>
        </main>
      </body>
    </html>
  );
}
