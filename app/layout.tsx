import ProfileCompletionPopup
  from "@/components/ProfileCompletionPopup";

import "./globals.css";

import type {
  Metadata,
} from "next";

import {
  FirebaseAuthProvider,
} from "@/components/FirebaseAuthProvider";


export const metadata: Metadata = {

  metadataBase:
    new URL(
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000"
    ),

  title: {

    default:
      "LET - Learn Earn Teach",

    template:
      "%s | LET - Learn Earn Teach",

  },

  description:
    "LET - Learn Earn Teach provides learning resources, study materials, notes, batches and educational support for students.",

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


          <ProfileCompletionPopup />

        </FirebaseAuthProvider>

      </body>

    </html>

  );

}
