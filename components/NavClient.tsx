"use client";

import Link from "next/link";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import ThemeToggle from "./ThemeToggle";

import {
  useFirebaseAuth,
} from "@/hooks/useFirebaseAuth";

import {
  loginWithGoogle,
  logoutFirebase,
} from "@/lib/firebase-auth";


export default function NavClient() {

    const router =
    useRouter();

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

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] =
    useState(false);


async function handleLogin() {

  try {

    setActionLoading(true);

    const result =
      await loginWithGoogle();


    /*
      Firebase popup login
      completed successfully.
    */

    if (result) {

      /*
        Refresh server-rendered pages.

        This allows pages such as
        /batches/[id] to immediately
        recognize the firebase-session
        cookie.
      */
      router.refresh();

    }

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

    const closeMobileMenu = () => {

    setMobileMenuOpen(false);

  };


  return (

  <>

    <nav className="nav wrap">

      <button
        type="button"
        className="mobile-menu-button"
        onClick={() =>

          setMobileMenuOpen(
            !mobileMenuOpen
          )

        }
        aria-label="Open navigation menu"
        aria-expanded={
          mobileMenuOpen
        }
      >

        <span />

        <span />

        <span />

      </button>


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


    {mobileMenuOpen && (

  <>

    <button
      type="button"
      className="mobile-menu-overlay"
      onClick={closeMobileMenu}
      aria-label="Close navigation menu"
    />


    <aside
      className="mobile-menu-drawer"
    >

      <div
        className="mobile-menu-header"
      >

        <img
          src="/let-logo.png"
          alt="LET Online"
          style={{
            width: 92,
            height: 68,
            objectFit: "contain",
            borderRadius: 12,
          }}
        />


        <strong
          style={{
            fontSize: 22,
            letterSpacing: 1,
          }}
        >
          LET ONLINE
        </strong>


        <small
          style={{
            color:
              "var(--muted)",
            fontSize: 12,
            letterSpacing: 2,
          }}
        >
          LEARN • EARN • TEACH
        </small>


        <button
          type="button"
          className="mobile-menu-close"
          onClick={closeMobileMenu}
          aria-label="Close navigation menu"
        >
          ×
        </button>

      </div>


      <nav
        className="mobile-menu-links"
      >

        <Link
          href="/"
          onClick={
            closeMobileMenu
          }
        >
          All Batches
        </Link>


        <Link
          href="/my-batches"
          onClick={
            closeMobileMenu
          }
        >
          My Batches
        </Link>


        <Link
          href="/success-shorts"
          onClick={
            closeMobileMenu
          }
        >
          Success Shorts
        </Link>


        <Link
          href="/study-materials"
          onClick={
            closeMobileMenu
          }
        >
          Study Materials
        </Link>


        <a
          href={
            "https://wa.me/9153021229" +
            "?text=" +
            encodeURIComponent(
              "Hello LET Support, I need help regarding the LET website/classes. Please assist me."
            )
          }
          target="_blank"
          rel="noopener noreferrer"
          onClick={
            closeMobileMenu
          }
        >
          Contact for Help / Support
        </a>


        <Link
          href="/profile"
          onClick={
            closeMobileMenu
          }
        >
          My Profile
        </Link>

      </nav>

    </aside>

  </>

)}
      
  </>

);

}
