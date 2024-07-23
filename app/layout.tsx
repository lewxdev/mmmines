import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import "@/globals.css";

export const metadata: Metadata = {
  title: "mmmines",
};

export default function RootLayout(props: Readonly<React.PropsWithChildren>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={GeistSans.className}>
          <main className="flex flex-col items-center px-4">
            <Header />
            {props.children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
