import Nav from "@/components/Nav";

import Enquiry from "@/components/Enquiry";

import BatchLoginButton from "@/components/BatchLoginButton";

import StudyMaterialActions from
  "@/components/StudyMaterialActions";

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
  notFound,
} from "next/navigation";


export const dynamic =
  "force-dynamic";


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


  return (

    <>

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
