import {
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";

import {
  firebaseAuth,
  googleProvider,
} from "@/lib/firebase";


export async function loginWithGoogle() {

  try {

    const result =
      await signInWithPopup(
        firebaseAuth,
        googleProvider
      );


    return result;

  } catch (error: any) {

    /*
      Popup login can fail on some
      mobile browsers.
    */

    if (
      error?.code ===
        "auth/popup-blocked" ||

      error?.code ===
        "auth/popup-closed-by-user"
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


export async function logoutFirebase() {

  await signOut(firebaseAuth);

}
