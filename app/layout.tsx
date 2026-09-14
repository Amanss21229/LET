import ProfileCompletionPopup
  from "@/components/ProfileCompletionPopup";

import AppDownloadPrompt
  from "@/components/AppDownloadPrompt";

import "./globals.css";

import type {
  Metadata,
} from "next";

import {
  FirebaseAuthProvider,
} from "@/components/FirebaseAuthProvider";

import {
  getAppUrl,
  siteName,
} from "@/lib/seo";

import {
  getOrganizationStructuredData,
  getWebsiteStructuredData,
} from "@/lib/structured-data";


export const metadata: Metadata = {

  metadataBase:

    new URL(
      getAppUrl()
    ),

  alternates: {

    canonical:
      getAppUrl(),

  },


  applicationName:
    siteName,

    icons: {

    icon: [
      {
        url:
          "/favicon.ico",
      },
      {
        url:
          "/let-icon.png",
        type:
          "image/png",
      },
    ],

    apple:
      "/apple-touch-icon.png",

  },


  title: {

    default:
      "LET Online — Learn • Earn • Teach",

    template:
      "%s | LET Online",

  },


  description:

    "LET Online — Learn, Earn, Teach is an educational platform for students offering study materials, notes, learning batches, practice resources and academic support for NEET, JEE and school education.",


  keywords: [

  "LET Online",

  "LET Learn Earn Teach",

  "LET Education",

  "study materials",

  "study notes",

  "student notes",

  "educational resources",

  "free study materials",

  "PDF notes",

  "school notes",

  "NEET study materials",

  "JEE study materials",

  "NEET preparation",

  "JEE preparation",

],


  authors: [

    {

      name:

        siteName,

    },

  ],


  creator:

    siteName,


  publisher:

    siteName,


  robots: {

    index:

      true,

    follow:

      true,

    googleBot: {

      index:

        true,

      follow:

        true,

      "max-video-preview":

        -1,

      "max-image-preview":

        "large",

      "max-snippet":

        -1,

    },

  },


  openGraph: {

    type:

      "website",


    siteName:

      "LET Online",


    title:

       "LET Online — Learn • Earn • Teach",


    description:

       "Explore Study materials, notes, learning batches, practice resources and academic support for NEET, JEE and school students.",

    url:
    getAppUrl(),

  },


  twitter: {

    card:

      "summary_large_image",

    title:

      "LET Online — Learn • Earn • Teach",


    description:

         "Explore Study materials, notes, learning batches, practice resources and academic support for NEET, JEE and school students.",

  },

};


export default function Layout({

  children,

}: {

  children:
    React.ReactNode;

}) {


  const organizationSchema =
    getOrganizationStructuredData();


  const websiteSchema =
    getWebsiteStructuredData();


  return (

    <html lang="en">

      <body>


        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{

            __html:
              JSON.stringify(
                organizationSchema
              ),

          }}
        />


        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{

            __html:
              JSON.stringify(
                websiteSchema
              ),

          }}
        />


        <FirebaseAuthProvider>
          
          {children}


          <ProfileCompletionPopup />

        <AppDownloadPrompt />
</FirebaseAuthProvider>

      </body>

    </html>

  );

}
