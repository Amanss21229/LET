import {
  signInWithPopup,
  signInWithRedirect,
  signOut,
  User,
} from "firebase/auth";


import {
  firebaseAuth,
  googleProvider,
} from "@/lib/firebase";


/*
  Sync Firebase user with
  LET Neon database.
*/

export async function syncFirebaseUser(
  user: User
) {

  const idToken =
    await user.getIdToken();


  const response =
    await fetch(
      "/api/auth/firebase/sync",
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${idToken}`,

        },

      }
    );


  const data =
    await response.json();


  if (!response.ok) {

    throw new Error(

      data?.error ||
      "Failed to sync user"

    );

  }


  return data;

}


export async function createFirebaseSession(
  user: User
) {

  const idToken =
    await user.getIdToken();


  const response =
    await fetch(
      "/api/auth/firebase/session",
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

        },

        body:
          JSON.stringify({

            idToken,

          }),

      }
    );


  const data =
    await response.json();


  if (!response.ok) {

    throw new Error(

      data?.error ||

      "Unable to create Firebase session"

    );

  }


  return data;

}


/*
  Google Login
*/

export async function loginWithGoogle() {

  try {

    const result =
      await signInWithPopup(

        firebaseAuth,

        googleProvider

      );


    const firebaseUser =
      result.user;


    /*
      Sync user with Neon DB
    */

    const syncedUser =
      await syncFirebaseUser(
        firebaseUser
      );

    await createFirebaseSession(
      firebaseUser
    );


    return {

      firebaseUser,

      syncedUser,

    };

  }

  catch (error: any) {


    /*
      Some mobile browsers may
      block popups.

      Redirect is used as fallback.
    */

    if (

      error?.code ===
        "auth/popup-blocked"

      ||

      error?.code ===
        "auth/cancelled-popup-request"

    ) {

      await signInWithRedirect(

        firebaseAuth,

        googleProvider

      );


      return null;

    }


    throw error;

  }

}



/*
  Logout Firebase
*/

export async function logoutFirebase() {

  try {

    await fetch(
      "/api/auth/firebase/session",
      {

        method:
          "DELETE",

      }
    );

  }

  catch (error) {

    console.error(
      "Unable to remove server session:",
      error
    );

  }


  await signOut(
    firebaseAuth
  );

}
