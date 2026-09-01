"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  return (
    <nav className="nav wrap">
      <Link className="brand" href="/">
        <img src="/let-logo.png" alt="LET logo" />
        LET
      </Link>

      <div className="links">
        <Link href="/">All Batches</Link>
        <Link href="/my-batches">My Batches</Link>
        <Link href="/profile">My Profile</Link>
        <Link href="/admin">Admin</Link>
      </div>

      <div className="nav-actions">
        <ThemeToggle />

        <a
          className="btn primary"
          href="/api/auth/signin/google"
        >
          Continue with Google
        </a>
      </div>
    </nav>
  );
}
