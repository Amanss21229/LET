"use client";

import Link from "next/link";

export default function NavClient() {
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

        <span>
          LET
        </span>
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

      </div>


    </nav>
  );
}
