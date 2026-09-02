"use client";

import { firebaseAuth } from "@/lib/firebase";

export async function getFirebaseHeaders() {
  const user = firebaseAuth.currentUser;

  if (!user) {
    throw new Error("Please login first");
  }

  const token = await user.getIdToken();

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function firebaseFetch(
  url: string,
  options: RequestInit = {}
) {
  const headers = await getFirebaseHeaders();

  return fetch(url, {
    ...options,

    headers: {
      ...headers,

      ...(options.headers || {}),
    },
  });
      }
