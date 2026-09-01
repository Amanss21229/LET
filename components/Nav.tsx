import Link from "next/link";

import { auth } from "@/lib/auth";

import ThemeToggle from "./ThemeToggle";

export default async function Nav() {
  const session =
    await auth();

  return (
    <nav className="nav wrap">

      <Link
        className="brand"
        href="/"
      >
        <img
          src="/let-logo.png"
          alt="LET logo"
        />

        LET
      </Link>

      <div className="links">

        <Link href="/">
          All Batches
        </Link>

        <Link href="/my-batches">
          My Batches
        </Link>

        <Link href="/profile">
          My Profile
        </Link>

        <Link href="/admin">
          Admin
        </Link>

      </div>

      <div className="nav-actions">

        <ThemeToggle />

        {!session?.user ? (

          <a
            className="btn primary"
            href="/api/auth/signin/google"
          >
            Continue with Google
          </a>

        ) : (

          <form
            action="/api/auth/signout"
            method="POST"
          >

            <button
              className="btn primary"
              type="submit"
            >
              Logout
            </button>

          </form>

        )}

      </div>

    </nav>
  );
}
