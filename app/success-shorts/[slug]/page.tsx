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
  getAppUrl,
  getSuccessShortUrl,
  getSuccessShortsUrl,
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

        images: [

    {

      url:
        `https://i.ytimg.com/vi/${encodeURIComponent(
          short.youtubeVideoId
        )}/hqdefault.jpg`,

      width:
        480,

      height:
        360,

      alt:
        short.title,

    },

  ],

},

    },

    twitter: {

  card:
    "summary_large_image",

  title:
    short.title,

  description,

  images: [

    `https://i.ytimg.com/vi/${encodeURIComponent(
      short.youtubeVideoId
    )}/hqdefault.jpg`,

  ],

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

      title:
        true,

      slug:
        true,

      youtubeUrl:
        true,

      youtubeVideoId:
        true,

      seoDescription:
        true,

      createdAt:
        true,

      updatedAt:
        true,

    },

  });


  if (
    !short
  ) {

    return notFound();

  }

  const shortUrl =
  getSuccessShortUrl(
    short.slug
  );


const description =
  short.seoDescription ||

  `Watch ${short.title} on Success Shorts by ${siteName}.`;


const breadcrumbSchema = {

  "@context":
    "https://schema.org",

  "@type":
    "BreadcrumbList",

  itemListElement: [

    {

      "@type":
        "ListItem",

      position:
        1,

      name:
        "Home",

      item:
        getAppUrl(),

    },


    {

      "@type":
        "ListItem",

      position:
        2,

      name:
        "Success Shorts",

      item:
        getSuccessShortsUrl(),

    },


    {

      "@type":
        "ListItem",

      position:
        3,

      name:
        short.title,

      item:
        shortUrl,

    },

  ],

};


const videoSchema = {

  "@context":
    "https://schema.org",

  "@type":
    "VideoObject",

  name:
    short.title,

  description,

  embedUrl:
    `https://www.youtube.com/embed/${short.youtubeVideoId}`,

  contentUrl:
    short.youtubeUrl,

  url:
    shortUrl,

  uploadDate:
    short.createdAt.toISOString(),

  publisher: {

    "@type":
      "Organization",

    name:
      siteName,

    url:
      getAppUrl(),

  },

};


  return (

  <>

    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{

        __html:
          JSON.stringify(
            breadcrumbSchema
          ),

      }}
    />


    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{

        __html:
          JSON.stringify(
            videoSchema
          ),

      }}
    />


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
