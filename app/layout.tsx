import "./globals.css";

import type {
  Metadata,
} from "next";

import {
  AuthProvider,
} from "@/components/AuthProvider";


export const metadata: Metadata = {

  title:
    "LET - Learn Earn Teach",

  description:
    "Learn • Earn • Teach",

};


export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html lang="en">

      <body>

        <AuthProvider>

          {children}

        </AuthProvider>

      </body>

    </html>

  );

}
