"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  onAuthStateChanged,
  User,
} from "firebase/auth";

import {
  firebaseAuth,
} from "@/lib/firebase";

import {
  syncFirebaseUser,
} from "@/lib/firebase-auth";


type DatabaseUser = {

  id: string;

  firebaseUid: string | null;

  name: string | null;

  email: string | null;

  image: string | null;

  phone: string | null;

  className: string | null;

  profileComplete: boolean;

};


type FirebaseAuthContextType = {

  firebaseUser: User | null;

  databaseUser: DatabaseUser | null;

  loading: boolean;

  syncing: boolean;

  error: string | null;

  refreshUser: () => Promise<void>;

};


const FirebaseAuthContext =
  createContext<
    FirebaseAuthContextType | undefined
  >(undefined);


export function FirebaseAuthProvider({

  children,

}: {

  children: ReactNode;

}) {


  const [

    firebaseUser,

    setFirebaseUser,

  ] = useState<User | null>(null);


  const [

    databaseUser,

    setDatabaseUser,

  ] =
    useState<DatabaseUser | null>(
      null
    );


  const [

    loading,

    setLoading,

  ] = useState(true);


  const [

    syncing,

    setSyncing,

  ] = useState(false);


  const [

    error,

    setError,

  ] =
    useState<string | null>(
      null
    );


  /*
    Sync Firebase user
    with Neon database.
  */

  const syncUser =
    async (
      user: User
    ) => {

      try {

        setSyncing(true);

        setError(null);


        const result =
          await syncFirebaseUser(
            user
          );


        if (
          result?.user
        ) {

          setDatabaseUser(
            result.user
          );

        }

        return result;

      }

      catch (error: any) {

        console.error(
          "Firebase user sync failed:",
          error
        );


        setError(

          error?.message ||

          "Unable to synchronize user"

        );


        return null;

      }

      finally {

        setSyncing(false);

      }

    };


  /*
    Refresh user data.

    Useful after:
    - Profile update
    - Login
    - Database changes
  */

  const refreshUser =
    async () => {

      const currentUser =
        firebaseAuth.currentUser;


      if (!currentUser) {

        setDatabaseUser(null);

        return;

      }


      await syncUser(
        currentUser
      );

    };


  /*
    Listen for Firebase
    authentication changes.
  */

  useEffect(() => {


    const unsubscribe =
      onAuthStateChanged(

        firebaseAuth,

        async (user) => {


          try {


            setLoading(true);

            setError(null);


            /*
              User logged out
            */

            if (!user) {

              setFirebaseUser(
                null
              );

              setDatabaseUser(
                null
              );

              return;

            }


            /*
              User logged in
            */

            setFirebaseUser(
              user
            );


            await syncUser(
              user
            );


          }

          catch (error: any) {

            console.error(

              "Firebase authentication error:",

              error

            );


            setError(

              error?.message ||

              "Authentication error"

            );


          }

          finally {

            setLoading(false);

          }

        }

      );


    return () => {

      unsubscribe();

    };


  }, []);



  return (

    <FirebaseAuthContext.Provider

      value={{

        firebaseUser,

        databaseUser,

        loading,

        syncing,

        error,

        refreshUser,

      }}

    >

      {children}

    </FirebaseAuthContext.Provider>

  );

}



export function useFirebaseAuthContext() {


  const context =
    useContext(
      FirebaseAuthContext
    );


  if (!context) {

    throw new Error(

      "useFirebaseAuthContext must be used inside FirebaseAuthProvider"

    );

  }


  return context;

  }
