import Nav from "@/components/Nav";

import Enquiry from "@/components/Enquiry";

import BatchLoginButton from "@/components/BatchLoginButton";

import StudyMaterialActions from
  "@/components/StudyMaterialActions";

import type {
  Metadata,
} from "next";

import {
  prisma,
} from "@/lib/prisma";

import {
  currentUser,
} from "@/lib/guards";

import {
  getGoogleDriveDownloadUrl,
} from "@/lib/study-materials";

import {
  getAppUrl,
  getMaterialUrl,
  siteName,
} from "@/lib/seo";

import {
  notFound,
} from "next/navigation";


export const dynamic =
  "force-dynamic";

export async function generateMetadata({

  params,

}: {

  params: Promise<{
    categorySlug: string;
    subjectSlug: string;
    materialSlug: string;
  }>;

}): Promise<Metadata> {

  const {

    categorySlug,

    subjectSlug,

    materialSlug,

  } =
    await params;


  const category =
    await prisma.studyCategory.findUnique({

      where: {

        slug:
          categorySlug,

      },

    });


  if (!category) {

    return {

      title:
        "Study Material Not Found | LET",

    };

  }


  const subject =
    await prisma.studySubject.findUnique({

      where: {

        categoryId_slug: {

          categoryId:
            category.id,

          slug:
            subjectSlug,

        },

      },

    });


  if (!subject) {

    return {

      title:
        "Study Material Not Found | LET",

    };

  }


  const material =
    await prisma.studyMaterial.findUnique({

      where: {

        subjectId_slug: {

          subjectId:
            subject.id,

          slug:
            materialSlug,

        },

      },

    });


  if (!material) {

    return {

      title:
        "Study Material Not Found | LET",

    };

  }


  const url =
    getMaterialUrl(

      category.slug,

      subject.slug,

      material.slug

    );


  const title =
  `${material.title} | ${subject.name} Study Material for ${category.name}`;


const description =
  `Access ${material.title}, a ${subject.name} study material for ${category.name}. Explore notes, PDFs, planners and useful educational resources on LET - Learn Earn Teach.`;


  return {

  title,

  description,


  alternates: {

    canonical:
      url,

  },


  openGraph: {

    title,

    description,

    url,

    type:
      "article",

    publishedTime:

      material.createdAt.toISOString(),


    modifiedTime:

      material.updatedAt.toISOString(),


    siteName,

  },


  twitter: {

    card:

      "summary",


    title,

    description,

  },


  robots: {

    index:

      true,

    follow:

      true,

  },

}; 


}


export default async function StudyMaterialPage({

  params,

}: {

  params: Promise<{

    categorySlug: string;

    subjectSlug: string;

    materialSlug: string;

  }>;

}) {


  const {

    categorySlug,

    subjectSlug,

    materialSlug,

  } =
    await params;


  /*
    Find category.
  */

  const category =
    await prisma.studyCategory.findUnique({

      where: {

        slug:
          categorySlug,

      },

    });


  if (!category) {

    return notFound();

  }


  /*
    Find subject inside
    this category.
  */

  const subject =
    await prisma.studySubject.findUnique({

      where: {

        categoryId_slug: {

          categoryId:
            category.id,

          slug:
            subjectSlug,

        },

      },

    });


  if (!subject) {

    return notFound();

  }


  /*
    Find material inside
    this subject.
  */

  const material =
    await prisma.studyMaterial.findUnique({

      where: {

        subjectId_slug: {

          subjectId:
            subject.id,

          slug:
            materialSlug,

        },

      },

    });


  if (!material) {

    return notFound();

  }


  /*
    Check current user.
  */

  const user =
    await currentUser();


  /*
    Generate safe Google Drive
    download URL.
  */

  const downloadUrl =
    getGoogleDriveDownloadUrl(

      material.googleDriveUrl

    );

  const materialUrl =
  getMaterialUrl(

    category.slug,

    subject.slug,

    material.slug

  );


const appUrl =
  getAppUrl();


const creativeWorkSchema = {

  "@context":

    "https://schema.org",


  "@type":

    "CreativeWork",


  "@id":

    `${materialUrl}#study-material`,


  name:

    material.title,


  headline:

    material.title,


  description:

    `Study material for ${subject.name} in ${category.name}. ${material.title} is available on ${siteName}.`,


  url:

    materialUrl,


  datePublished:

    material.createdAt.toISOString(),


  dateModified:

    material.updatedAt.toISOString(),


  inLanguage:

    "en-IN",


  isAccessibleForFree:

    true,


  educationalLevel:

    category.name,


  about: [

    {

      "@type":

        "Thing",


      name:

        subject.name,

    },

    {

      "@type":

        "Thing",


      name:

        category.name,

    },

  ],


  learningResourceType:

    "Educational Resource",


  publisher: {

    "@type":

      "Organization",


    name:

      siteName,


    url:

      appUrl,

  },


  mainEntityOfPage: {

    "@type":

      "WebPage",


    "@id":

      materialUrl,

  },

};

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

        appUrl,

    },


    {

      "@type":

        "ListItem",


      position:

        2,


      name:

        "Study Materials",


      item:

        `${appUrl}/study-materials`,

    },


    {

      "@type":

        "ListItem",


      position:

        3,


      name:

        category.name,


      item:

        `${appUrl}/study-materials/${category.slug}`,

    },


    {

      "@type":

        "ListItem",


      position:

        4,


      name:

        subject.name,


      item:

        `${appUrl}/study-materials/${category.slug}/${subject.slug}`,

    },


    {

      "@type":

        "ListItem",


      position:

        5,


      name:

        material.title,


      item:

        materialUrl,

    },

  ],

};


  return (

  <>

    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{

        __html:

          JSON.stringify(
            creativeWorkSchema
          ),

      }}
    />


    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{

        __html:

          JSON.stringify(
            breadcrumbSchema
          ),

      }}
    />


    <Nav />


      <main className="wrap">


        <section className="hero">

          <p className="yellow">

            {category.name}

          </p>


          <h1>

            {material.title}

          </h1>


          <p className="muted">

            {subject.name}

          </p>


        </section>


        <section className="card study-material-detail-card">


          <div className="study-material-file-icon">

            📄

          </div>


          <h2>

            {material.title}

          </h2>


          <p className="muted">

            Study Material for{" "}

            <b>

              {subject.name}

            </b>

          </p>


          <p className="muted">

            Added on{" "}

            {material.createdAt.toLocaleDateString()}

          </p>


          <hr />


          {!user && (

            <>

              <div className="study-material-login-box">


                <h3>

                  🔒 Login Required

                </h3>


                <p className="muted">

                  Please login with Google
                  to download or share this
                  study material.

                </p>


                <BatchLoginButton />


              </div>

            </>

          )}


          {user && (

            <StudyMaterialActions

              downloadUrl={
                downloadUrl
              }

            />

          )}


        </section>


      </main>


      <Enquiry />


    </>

  );

}
