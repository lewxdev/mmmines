import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";

export const HEADER_HEIGHT = 64;

export function Header() {
  return (
    <header
      className="w-[min(var(--field-size),100%)] bg-white"
      style={{ height: HEADER_HEIGHT }}
    >
      <h1 className="text-4xl">mmmines</h1>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
    </header>
  );
}
