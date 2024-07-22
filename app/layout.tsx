import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "@/globals.css";
import { ClerkProvider, SignedIn, SignOutButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "mmmines",
};

export default function RootLayout(props: Readonly<React.PropsWithChildren>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={GeistSans.className}>
          <div className="p-10">
            <h1 className="text-4xl">mmmines</h1>
            <SignedIn>
              <SignOutButton />
            </SignedIn>
            <div className="pb-10" />
            <div className="flex flex-col items-center justify-center">
              {props.children}
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
