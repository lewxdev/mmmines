import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Header } from "@/components/header";
import "@/globals.css";

export const metadata: Metadata = {
  title: "mmmines",
};

export default function RootLayout(props: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <main className="flex flex-col items-center h-[100dvh]">
          <Header />
          {props.children}
        </main>
      </body>
    </html>
  );
}
