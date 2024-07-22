import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "@/globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "mmmines",
};

export default function RootLayout(props: Readonly<React.PropsWithChildren>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={GeistSans.className}>
          <header className="sticky top-0 bg-white">
            <div className="container mx-auto">
              <h1 className="text-4xl">mmmines</h1>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <SignOutButton />
              </SignedIn>
            </div>
          </header>
          <main className="flex items-center justify-center">
            {props.children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
