"use client";

import {
  useEffect,
  useState,
} from "react";


const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL ||
  "";


export default function AppDownloadPrompt() {

  const [
    visible,
    setVisible,
  ] = useState(false);


  useEffect(() => {

    /*
      Do not show the prompt inside
      standalone/PWA/app mode.
    */
    const isStandalone =
      window.matchMedia(
        "(display-mode: standalone)"
      ).matches ||
      (window.navigator as Navigator & {
        standalone?: boolean;
      }).standalone === true;


    if (isStandalone) {
      return;
    }


    /*
      Only show on Android browsers.
    */
    const isAndroid =
      /Android/i.test(
        navigator.userAgent
      );


    if (!isAndroid) {
      return;
    }


    /*
      Play Store URL is required.
      Until the app is published, don't
      show a broken button.
    */
    if (!PLAY_STORE_URL) {
      return;
    }


    /*
      Respect user's dismissal for 14 days.
    */
    const dismissedUntil =
      localStorage.getItem(
        "let-app-prompt-dismissed-until"
      );


    if (
      dismissedUntil &&
      Number(dismissedUntil) >
        Date.now()
    ) {

      return;

    }


    const timer =
      window.setTimeout(
        () => {

          setVisible(true);

        },
        1200
      );


    return () =>
      window.clearTimeout(
        timer
      );

  }, []);


  if (!visible) {
    return null;
  }


  function dismiss() {

    localStorage.setItem(

      "let-app-prompt-dismissed-until",

      String(
        Date.now() +
        14 * 24 * 60 * 60 * 1000
      )

    );

    setVisible(false);

  }


  function openPlayStore() {

    window.location.href =
      PLAY_STORE_URL;

  }


  return (

    <div
      className="let-app-prompt"
      role="dialog"
      aria-label="Download LET Online app"
    >

      <button
        type="button"
        className="let-app-prompt-close"
        onClick={dismiss}
        aria-label="Close"
      >
        ×
      </button>


      <div className="let-app-prompt-icon">

        <img
          src="/let-icon.png"
          alt="LET Online"
        />

      </div>


      <div className="let-app-prompt-content">

        <strong>
          Get the LET Online App
        </strong>

        <p>
          Learn, practice and access
          your LET resources faster.
        </p>


        <button
          type="button"
          className="let-app-prompt-button"
          onClick={openPlayStore}
        >

          Get it on Google Play

        </button>

      </div>

    </div>

  );

}
