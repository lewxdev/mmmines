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
          <div className="p-4">
            <h1 className="text-4xl">mmmines</h1>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <SignOutButton />
              </SignedIn>
            </div>
          <div className="flex h-screen items-center justify-center">
            {props.children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
