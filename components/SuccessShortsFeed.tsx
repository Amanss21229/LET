"use client";


import {

  useEffect,

  useMemo,

  useRef,

  useState,

} from "react";


import Link from
  "next/link";


import {

  useFirebaseAuth,

} from "@/hooks/useFirebaseAuth";


import {

  firebaseFetch,

} from "@/lib/firebase-api";


import {

  loginWithGoogle,

} from "@/lib/firebase-auth";

import SuccessShortComments from
  "@/components/SuccessShortComments";


type SuccessShort = {

  id:
    string;

  title:
    string;

  slug:
    string;

  youtubeUrl:
    string;

  youtubeVideoId:
    string;

  seoKeywords:
    string;

  seoDescription:
    string | null;

  createdAt:
    string;

  likes:
    number;

  views:
    number;

  shares:
    number;

  comments:
    number;

  reachScore:
    number;

};

type ShortPlayerProps = {

  short:
    SuccessShort;

  isActive:
    boolean;
  
  playbackBlocked:
    boolean;


  soundEnabled:
    boolean;
  
  onSoundEnabled:
    () => void;

};

function
SuccessShortPlayer({

  short,

  isActive,

  playbackBlocked,

  soundEnabled,

  onSoundEnabled,

}: ShortPlayerProps) {


  const iframeRef =
    useRef<
      HTMLIFrameElement | null
    >(
      null
    );


  const [

    playerReady,

    setPlayerReady,

  ] =
    useState(
      false
    );


  const playerUrl =
    `https://www.youtube.com/embed/${encodeURIComponent(
      short.youtubeVideoId
    )}?enablejsapi=1&autoplay=${

      isActive

        ? "1"

        : "0"

    }&playsinline=1&controls=1&rel=0&modestbranding=1&mute=${

      soundEnabled

        ? "0"

        : "1"

    }`;


  function
  sendPlayerCommand(

    command:
      string,

    args:
      unknown[] =
        []

  ) {

    if (
      !iframeRef.current
    ) {

      return;

    }


    iframeRef.current.contentWindow?.postMessage(

      JSON.stringify({

        event:
          "command",

        func:
          command,

        args,

      }),

      "*"

    );

  }


  useEffect(

    () => {

      if (
        !playerReady
      ) {

        return;

      }


      if (
        isActive &&
        !playbackBlocked
      ) {

        sendPlayerCommand(
          "playVideo"
        );

      }

      else {

        sendPlayerCommand(
          "pauseVideo"
        );

      }

    },

    [

      isActive,

      playerReady,

    ]

  );


  useEffect(

    () => {

      if (
        !playerReady
      ) {

        return;

      }


      if (
        soundEnabled
      ) {

        sendPlayerCommand(
          "unMute"
        );


        sendPlayerCommand(
          "setVolume",

          [
            100,
          ]

        );

      }

      else {

        sendPlayerCommand(
          "mute"
        );

      }

    },

    [

      soundEnabled,

      playerReady,

    ]

  );


  function
  handleEnableSound() {

    onSoundEnabled();


    window.setTimeout(

      () => {

        sendPlayerCommand(
          "unMute"
        );


        sendPlayerCommand(
          "setVolume",

          [
            100,
          ]

        );

      },

      100

    );

  }


  return (

    <div
      className={
        "success-short-video"
      }
    >

      <iframe

        ref={
          iframeRef
        }

        src={
          playerUrl
        }

        title={
          short.title
        }

        onLoad={

          () =>

            setPlayerReady(
              true
            )

        }

        allow={
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        }

        allowFullScreen

      />


      {

        isActive &&

        !soundEnabled && (

          <button

            type="button"

            className={
              "success-short-sound-button"
            }

            onClick={
              handleEnableSound
            }

          >

            <span>

              🔊

            </span>


            <strong>

              Tap for Sound

            </strong>

          </button>

        )

      }

    </div>

  );

}
  
type SuccessShortsFeedProps = {

  initialShortSlug?:
    string;

};


export default function
SuccessShortsFeed({

  initialShortSlug,

}: SuccessShortsFeedProps) {


  const {

    firebaseUser,

    loading:
      authLoading,

  } =
    useFirebaseAuth();


  const [

    shorts,

    setShorts,

  ] =
    useState<SuccessShort[]>([]);

  const [

  soundEnabled,

  setSoundEnabled,

] =
  useState(
    false
  );


const [

  soundPreferenceLoaded,

  setSoundPreferenceLoaded,

] =
  useState(
    false
  );

  const [

  activeShortId,

  setActiveShortId,

] =
  useState<
    string | null
  >(
    null
  );


  const [

    loading,

    setLoading,

  ] =
    useState(true);


  const [

    error,

    setError,

  ] =
    useState("");


  const [

    search,

    setSearch,

  ] =
    useState("");


  const [

    loginPopup,

    setLoginPopup,

  ] =
    useState(false);


  const [

    loginLoading,

    setLoginLoading,

  ] =
    useState(false);


  const [

    likedShorts,

    setLikedShorts,

  ] =
    useState<
      Record<string, boolean>
    >(
      {}
    );


  const [

    likeCounts,

    setLikeCounts,

  ] =
    useState<
      Record<string, number>
    >(
      {}
    );

  const [

  viewedShorts,

  setViewedShorts,

] =
  useState<
    Record<string, boolean>
  >(
    {}
  );


  async function
  loadShorts() {

    try {

      setLoading(
        true
      );


      setError(
        ""
      );


      const response =
        await fetch(

          "/api/success-shorts",

          {

            cache:
              "no-store",

          }

        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(

          data?.error ||

          "Unable to load Success Shorts"

        );

      }


      const loadedShorts =
        Array.isArray(data)

          ? data

          : [];


      setShorts(
        loadedShorts
      );

          if (

  initialShortSlug

) {

  const requestedShort =
    loadedShorts.find(

      (
        short:
          SuccessShort
      ) =>

        short.slug ===
        initialShortSlug

    );


  if (
    requestedShort
  ) {

    setActiveShortId(
      requestedShort.id
    );

  }

}


      const initialLikeCounts:
        Record<string, number> =
        {};


      loadedShorts.forEach(

        (
          short
        ) => {

          initialLikeCounts[
            short.id
          ] =
            short.likes;

        }

      );


      setLikeCounts(
        initialLikeCounts
      );

    }

    catch (
      err
    ) {

      setError(

        err instanceof Error

          ? err.message

          : "Unable to load Success Shorts"

      );

    }

    finally {

      setLoading(
        false
      );

    }

  }


  useEffect(

    () => {

      loadShorts();

    },

    []

  );

  useEffect(

  () => {

    try {

      const savedPreference =
        window.localStorage.getItem(

          "successShortsSoundEnabled"

        );


      if (
        savedPreference ===
        "true"
      ) {

        setSoundEnabled(
          true
        );

      }

    }

    catch (
      error
    ) {

      console.error(

        "Unable to load sound preference:",

        error

      );

    }

    finally {

      setSoundPreferenceLoaded(
        true
      );

    }

  },

  []

);

  
  /*
    Show login popup after
    10 seconds only for
    non-logged-in users.
  */

  useEffect(

    () => {

      if (
        authLoading ||
        firebaseUser
      ) {

        return;

      }


      const timer =
        window.setTimeout(

          () => {

            setLoginPopup(
              true
            );

          },

          10000

        );


      return () => {

        window.clearTimeout(
          timer
        );

      };

    },

    [

      authLoading,

      firebaseUser,

    ]

  );


  const filteredShorts =
    useMemo(

      () => {

        const query =
          search
            .trim()
            .toLowerCase();


        if (!query) {

          return shorts;

        }


        return shorts.filter(

          (
            short
          ) => {

            const searchableText =
              [

                short.title,

                short.seoKeywords,

                short.seoDescription ||

                  "",

              ]

                .join(
                  " "
                )

                .toLowerCase();


            return searchableText.includes(
              query
            );

          }

        );

      },

      [

        shorts,

        search,

      ]

    );

  useEffect(

  () => {

    if (

      filteredShorts.length ===
      0

    ) {

      setActiveShortId(
        null
      );

      return;

    }


    setActiveShortId(

      (
        currentId
      ) =>

        currentId ||

        filteredShorts[0].id

    );

  },

  [

    filteredShorts,

  ]

);

  useEffect(

  () => {

    if (

      typeof window ===
      "undefined"

    ) {

      return;

    }


    const observer =
      new IntersectionObserver(

        (

          entries

        ) => {

          const visibleEntry =
            entries

              .filter(

                (
                  entry
                ) =>

                  entry.isIntersecting

              )

              .sort(

                (
                  a,
                  b
                ) =>

                  b.intersectionRatio

                  -

                  a.intersectionRatio

              )[0];


          if (

            visibleEntry

          ) {

            const shortId =
              visibleEntry.target.getAttribute(
                "data-short-id"
              );


            if (

              shortId

            ) {

              setActiveShortId(
                shortId
              );

            }

          }

        },

        {

          threshold:
            0.65,

        }

      );

                
    const shortCards =
      document.querySelectorAll(
        "[data-success-short]"
      );


    shortCards.forEach(

      (
        card
      ) => {

        observer.observe(
          card
        );

      }

    );


    return () => {

      observer.disconnect();

    };

  },

  [

    filteredShorts,

  ]

);

  useEffect(

  () => {

    if (
      !activeShortId
    ) {

      return;

    }


    recordView(
      activeShortId
    );

  },

  [

    activeShortId,

  ]

);

  function
handleEnableGlobalSound() {

  setSoundEnabled(
    true
  );


  try {

    window.localStorage.setItem(

      "successShortsSoundEnabled",

      "true"

    );

  }

  catch (
    error
  ) {

    console.error(

      "Unable to save sound preference:",

      error

    );

  }

}

  async function
  handleLogin() {

    try {

      setLoginLoading(
        true
      );


      await loginWithGoogle();


      setLoginPopup(
        false
      );

    }

    catch (
      error
    ) {

      console.error(

        "Success Shorts login error:",

        error

      );

    }

    finally {

      setLoginLoading(
        false
      );

    }

  }


  async function
  handleLike(
    shortId:
      string
  ) {

    if (!firebaseUser) {

      setLoginPopup(
        true
      );

      return;

    }


    try {

      const response =
        await firebaseFetch(

          `/api/success-shorts/${shortId}/like`,

          {

            method:
              "POST",

          }

        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(

          data?.error ||

          "Unable to update like"

        );

      }


      setLikedShorts(

        (
          previous
        ) => ({

          ...previous,

          [shortId]:
            data.liked,

        })

      );


      setLikeCounts(

        (
          previous
        ) => ({

          ...previous,

          [shortId]:
            data.likes,

        })

      );

    }

    catch (
      error
    ) {

      console.error(

        "Success Short like error:",

        error

      );

    }

  }


  async function
  handleShare(
    shortId:
      string
  ) {

    const short =
      shorts.find(

        (
          item
        ) =>

          item.id ===
          shortId

      );


    if (!short) {

      return;

    }


    const shareUrl =
  `${window.location.origin}/success-shorts/${encodeURIComponent(
    short.slug
  )}`;


    try {

      if (

        navigator.share

      ) {

        await navigator.share({

          title:
            short.title,

          text:
            short.title,

          url:
            shareUrl,

        });

      }

      else {

        await navigator.clipboard.writeText(
          shareUrl
        );


        alert(
          "Success Short link copied!"
        );

      }


      await firebaseFetch(

        `/api/success-shorts/${shortId}/share`,

        {

          method:
            "POST",

        }

      );

    }

    catch (
      error
    ) {

      console.error(

        "Success Short share error:",

        error

      );

    }

  }


  async function
  recordView(
    shortId:
      string
  ) {

    /*
    Do not count the same
    short repeatedly during
    the current page session.
  */

  if (
    viewedShorts[
      shortId
    ]
  ) {

    return;

  }


  setViewedShorts(

    (
      previous
    ) => ({

      ...previous,

      [shortId]:
        true,

    })

  );

    try {

      await firebaseFetch(

        `/api/success-shorts/${shortId}/view`,

        {

          method:
            "POST",

        }

      );

    }

    catch (
      error
    ) {

      console.error(

        "Success Short view error:",

        error

      );

    }

  }


  if (loading) {

    return (

      <section
        className="success-shorts-loading"
      >

        Loading Success Shorts...

      </section>

    );

  }


  if (error) {

    return (

      <section
        className="success-shorts-error"
      >

        {error}

      </section>

    );

  }


  return (

    <>

      <section
        className="success-shorts-header"
      >

        <Link
          href="/"
          className="success-shorts-back"
        >

          ←

        </Link>


        <h1>

          Success Shorts

        </h1>


        <div
          className="success-shorts-search"
        >

          <span>

            🔍

          </span>


          <input

            type="search"

            placeholder="Search shorts..."

            value={
              search
            }

            onChange={

              (
                event
              ) =>

                setSearch(
                  event.target.value
                )

            }

          />

        </div>

      </section>


      {filteredShorts.length ===
        0 && (

        <section
          className="success-shorts-empty"
        >

          No Success Shorts found.

        </section>

      )}


      <section
        className="success-shorts-feed"
      >

        {filteredShorts.map(

          (
            short
          ) => (

            <article

              key={
                short.id
              }

              id={
                short.slug
              }

              data-success-short

              data-short-id={
                short.id
              }

              className={
                "success-short-card"
              }
              
              >

              <SuccessShortPlayer

  short={
    short
  }

  isActive={

    activeShortId ===
    short.id

  }

                playbackBlocked={
                  loginPopup &&
                  !firebaseUser
                }
                
                soundEnabled={

    soundPreferenceLoaded &&

    soundEnabled

  }

  onSoundEnabled={
    handleEnableGlobalSound
  }

/>


              <div
                className={
                  "success-short-info"
                }
              >

                <h2>

                  {short.title}

                </h2>


                <p>

                  {short.views}

                  {" views"}

                </p>

              </div>


              <div
                className={
                  "success-short-actions"
                }
              >

                <button

                  type="button"

                  className={

                    likedShorts[
                      short.id
                    ]

                      ?

                      "success-short-action liked"

                      :

                      "success-short-action"

                  }

                  onClick={

                    () =>

                      handleLike(
                        short.id
                      )

                  }

                >

                  <span>

                    ❤️

                  </span>


                  <small>

                    {

                      likeCounts[
                        short.id
                      ]

                      ??

                      short.likes

                    }

                  </small>

                </button>

              <SuccessShortComments
  shortId={
    short.id
  }
  initialCount={
    short.comments
  }
/>


                <button

                  type="button"

                  className={
                    "success-short-action"
                  }

                  onClick={

                    () =>

                      handleShare(
                        short.id
                      )

                  }

                >

                  <span>

                    ↗️

                  </span>


                  <small>

                    Share

                  </small>

                </button>


                <Link

                  href="/profile"

                  className={
                    "success-short-action"
                  }

                >

                  <span>

                    👤

                  </span>


                  <small>

                    Profile

                  </small>

                </Link>

              </div>

            </article>

          )

        )}

      </section>


      {loginPopup && (

        <div
          className="success-shorts-login-overlay"
        >

          <div
            className="success-shorts-login-popup"
          >

            <h2>

              Continue Watching

            </h2>


            <p>

              Login with Google
              to continue watching
              Success Shorts.

            </p>


            <button

              type="button"

              className="btn primary"

              disabled={
                loginLoading
              }

              onClick={
                handleLogin
              }

            >

              {

                loginLoading

                  ?

                  "Logging in..."

                  :

                  "Login with Google"

              }

            </button>

          </div>

        </div>

      )}

    </>

  );

}
