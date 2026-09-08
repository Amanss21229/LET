import type {
  Metadata,
} from "next";


import {
  notFound,
} from "next/navigation";


import Nav from
  "@/components/Nav";


import Enquiry from
  "@/components/Enquiry";


import SuccessShortsFeed from
  "@/components/SuccessShortsFeed";


import {
  prisma,
} from "@/lib/prisma";


import {
  getSuccessShortUrl,
  siteName,
} from "@/lib/seo";


export const dynamic =
  "force-dynamic";


export async function generateMetadata({

  params,

}: {

  params: Promise<{
    slug: string;
  }>;

}): Promise<Metadata> {


  const {

    slug,

  } =
    await params;


  const short =
    await prisma.successShort.findUnique({

      where: {

        slug,

      },

    });


  if (
    !short
  ) {

    return {

      title:
        `Success Short Not Found | ${siteName}`,

    };

  }


  const url =
    getSuccessShortUrl(
      short.slug
    );


  const description =
    short.seoDescription ||

    `Watch ${short.title} on Success Shorts by ${siteName}.`;


  return {

    title:
      `${short.title} | Success Shorts | ${siteName}`,

    description,

    keywords:

      short.seoKeywords
        .split(",")
        .map(

          (
            keyword
          ) =>

            keyword.trim()

        )
        .filter(
          Boolean
        ),

    alternates: {

      canonical:
        url,

    },

    openGraph: {

      title:
        short.title,

      description,

      url,

      type:
        "video.other",

      siteName,

    },

    twitter: {

      card:
        "summary",

      title:
        short.title,

      description,

    },

  };

}


export default async function
SuccessShortDetailPage({

  params,

}: {

  params: Promise<{
    slug: string;
  }>;

}) {


  const {

    slug,

  } =
    await params;


  const short =
    await prisma.successShort.findUnique({

      where: {

        slug,

      },

      select: {

        id:
          true,

      },

    });


  if (
    !short
  ) {

    return notFound();

  }


  return (

    <>

      <Nav />


      <main
        className={
          "success-shorts-page"
        }
      >

        <SuccessShortsFeed

          initialShortSlug={
            slug
          }

        />

      </main>


      <Enquiry />

    </>

  );

}
