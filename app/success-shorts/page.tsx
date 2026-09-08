import Nav from
  "@/components/Nav";

import Enquiry from
  "@/components/Enquiry";

import type {
  Metadata,
} from "next";

import {
  getSuccessShortsUrl,
  siteName,
} from "@/lib/seo";

import SuccessShortsFeed from
  "@/components/SuccessShortsFeed";


export const dynamic =
  "force-dynamic";


export const metadata:
  Metadata = {

    title:
      `Success Shorts | ${siteName}`,

    description:
      "Watch educational and motivational Success Shorts on LET.",

    alternates: {

      canonical:
        getSuccessShortsUrl(),

    },

    openGraph: {

      title:
        `Success Shorts | ${siteName}`,

      description:
        "Watch the latest educational and motivational Success Shorts.",

      url:
        getSuccessShortsUrl(),

      type:
        "website",

      siteName,

    },

    twitter: {

      card:
        "summary_large_image",

      title:
        `Success Shorts | ${siteName}`,

      description:
        "Watch the latest educational and motivational Success Shorts.",

    },

  };


export default function
SuccessShortsPage() {

  return (

    <>

      <Nav />


      <main
        className="success-shorts-page"
      >

        <SuccessShortsFeed />

      </main>


      <Enquiry />

    </>

  );

}
