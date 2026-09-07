import ProfileCompletionPopup
  from "@/components/ProfileCompletionPopup";

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


  applicationName:

    siteName,


  title: {

    default:

      siteName,


    template:

      "%s | LET",

  },


  description:

    "LET - Learn Earn Teach provides study materials, notes, educational resources, learning batches and academic support for students.",


  keywords: [

    "LET",

    "Learn Earn Teach",

    "study materials",

    "study notes",

    "student notes",

    "educational resources",

    "free study materials",

    "PDF notes",

    "school notes",

    "NEET study materials",

    "JEE study materials",

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

      siteName,


    title:

      siteName,


    description:

      "Explore study materials, notes, PDFs and educational resources on LET - Learn Earn Teach.",

  },


  twitter: {

    card:

      "summary_large_image",

    title:

      siteName,


    description:

      "Explore study materials, notes, PDFs and educational resources on LET.",

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

        </FirebaseAuthProvider>

      </body>

    </html>

  );

}
