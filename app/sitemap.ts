import type {
  MetadataRoute,
} from "next";

import {
  prisma,
} from "@/lib/prisma";

import {
  getAppUrl,
  getCategoryUrl,
  getMaterialUrl,
  getStudyMaterialsUrl,
  getSubjectUrl,
  getSuccessShortUrl,
  getSuccessShortsUrl,
} from "@/lib/seo";


const siteUrl =
  getAppUrl();


export default async function sitemap():
  Promise<MetadataRoute.Sitemap> {


  const categories =
    await prisma.studyCategory.findMany({

      include: {

        subjects: {

          include: {

            materials: true,

          },

        },

      },

      orderBy: {

        createdAt:
          "desc",

      },

    });

  const successShorts =
  await prisma.successShort.findMany({

    select: {

      slug:
        true,

      updatedAt:
        true,

    },

    orderBy: {

      createdAt:
        "desc",

    },

  });

  const urls:
    MetadataRoute.Sitemap = [


    /*
      Homepage
    */

    {

      url:
        siteUrl,

      lastModified:
        new Date(),

      changeFrequency:
        "daily",

      priority:
        1,

    },


    /*
      Study Materials Main Page
    */

    {

      url:
        getStudyMaterialsUrl(),

      lastModified:
        new Date(),

      changeFrequency:
        "daily",

      priority:
        0.9,

    },

  ];


  for (
    const category of categories
  ) {


    /*
      Category URL
    */

    urls.push({

      url:

        getCategoryUrl(
          category.slug
        ),

      lastModified:

        category.updatedAt,

      changeFrequency:

        "weekly",

      priority:

        0.8,

    });


    for (
      const subject of category.subjects
    ) {


      /*
        Subject URL
      */

      urls.push({

        url:

          getSubjectUrl(

            category.slug,

            subject.slug

          ),

        lastModified:

          subject.updatedAt,

        changeFrequency:

          "weekly",

        priority:

          0.7,

      });


      for (
        const material of subject.materials
      ) {


        /*
          Individual Study
          Material URL
        */

        urls.push({

          url:

            getMaterialUrl(

              category.slug,

              subject.slug,

              material.slug

            ),

          lastModified:

            material.updatedAt,

          changeFrequency:

            "monthly",

          priority:

            0.6,

        });

      }

    }

  }

  for (
  const short of successShorts
) {

  urls.push({

    url:

      getSuccessShortUrl(
        short.slug
      ),

    lastModified:

      short.updatedAt,

    changeFrequency:

      "weekly",

    priority:

      0.7,

  });

}

  return urls;

}
