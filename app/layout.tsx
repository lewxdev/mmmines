import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "@/globals.css";

export const metadata: Metadata = {
  title: "mmmines",
};

export default function RootLayout(props: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <div className="flex h-screen items-center justify-center">
          {props.children}
        </div>
      </body>
    </html>
  );
}
