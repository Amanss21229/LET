import "./globals.css";

import type {
  Metadata,
} from "next";

import {
  FirebaseAuthProvider,
} from "@/components/FirebaseAuthProvider";


export const metadata: Metadata = {

  title:
    "LET - Learn Earn Teach",

  description:
    "Learn • Earn • Teach",

};


export default function Layout({

  children,

}: {

  children:
    React.ReactNode;

}) {

  return (

    <html lang="en">

      <body>

        <FirebaseAuthProvider>

          {children}

        </FirebaseAuthProvider>

      </body>

    </html>

  );

}
