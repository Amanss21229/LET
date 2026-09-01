import {

  GoogleAuthProvider,

  signInWithPopup,

  signInWithRedirect,

  signOut,

} from "firebase/auth";


import {
  firebaseAuth,
} from "@/lib/firebase";


export async function loginWithGoogle() {

  const provider =
    new GoogleAuthProvider();


  provider.setCustomParameters({

    prompt:
      "select_account",

  });


  try {

    return await signInWithPopup(

      firebaseAuth,

      provider

    );

  } catch (error: any) {

    /*
      Popup can sometimes be blocked
      on mobile browsers.
    */

    if (
      error?.code ===
      "auth/popup-blocked"
    ) {

      return signInWithRedirect(

        firebaseAuth,

        provider

      );

    }


    throw error;

  }

}


export async function logout() {

  return signOut(
    firebaseAuth
  );

    }
