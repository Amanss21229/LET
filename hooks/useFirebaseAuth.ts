"use client";

import {
  useFirebaseAuthContext,
} from "@/components/FirebaseAuthProvider";


export function useFirebaseAuth() {

  return useFirebaseAuthContext();

}
