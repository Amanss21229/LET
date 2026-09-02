"use client";


import {
  firebaseAuth,
} from "@/lib/firebase";


export async function getFirebaseToken() {

  const user =
    firebaseAuth.currentUser;


  if (!user) {

    return null;

  }


  const token =
    await user.getIdToken();


  return token;

}



export async function getFirebaseAuthHeaders() {

  const token =
    await getFirebaseToken();


  if (!token) {

    return {};

  }


  return {

    Authorization:
      `Bearer ${token}`,

  };

}
