"use client";

import Link from "next/link";

import { useState } from "react";

import ThemeToggle from "./ThemeToggle";

import {
  useFirebaseAuth,
} from "@/hooks/useFirebaseAuth";

import {
  loginWithGoogle,
  logoutFirebase,
} from "@/lib/firebase-auth";


export default function NavClient() {

  const {
    firebaseUser,
    databaseUser,
    loading,
  } =
    useFirebaseAuth();


  const [
    actionLoading,
    setActionLoading,
  ] =
    useState(false);


  async function handleLogin() {

    try {

      setActionLoading(true);

      await loginWithGoogle();

    }

    catch (error) {

      console.error(
        "Login failed:",
        error
      );

      alert(
        "Google login failed. Please try again."
      );

    }

    finally {

      setActionLoading(false);

    }

  }


  async function handleLogout() {

    try {

      setActionLoading(true);

      await logoutFirebase();

      window.location.href =
        "/";

    }

    catch (error) {

      console.error(
        "Logout failed:",
        error
      );

    }

    finally {

      setActionLoading(false);

    }

  }


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

        <Link href="/admin">
          Admin
        </Link>

      </div>


      <div className="nav-actions">

        <ThemeToggle />


        {loading ? (

          <button
            className="btn"
            disabled
          >
            Loading...
          </button>

        ) : !firebaseUser ? (

          <button
            className="btn primary"
            onClick={handleLogin}
            disabled={actionLoading}
          >

            {actionLoading
              ? "Opening Google..."
              : "Continue with Google"}

          </button>

        ) : (

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >

            <Link
              href="/profile"
              className="btn"
            >

              {databaseUser?.name ||
                firebaseUser.displayName ||
                "My Profile"}

            </Link>


            <button
              className="btn primary"
              onClick={handleLogout}
              disabled={actionLoading}
            >

              Logout

            </button>

          </div>

        )}

      </div>

    </nav>

  );

}
