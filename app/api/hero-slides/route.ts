import {
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

import {
  verifyAdminSession,
} from "@/lib/admin-auth";


type HeroSlide = {

  id: string;

  imageUrl: string;

};


/* =====================
   VALIDATE SLIDES
===================== */

function normalizeSlides(
  value: unknown
): HeroSlide[] {

  if (
    !Array.isArray(value)
  ) {

    return [];

  }


  return value

    .filter(

      (
        item
      ): item is HeroSlide =>

        !!item &&

        typeof item ===
          "object" &&

        typeof (
          item as HeroSlide
        ).id ===
          "string" &&

        typeof (
          item as HeroSlide
        ).imageUrl ===
          "string" &&

        (
          item as HeroSlide
        ).imageUrl.trim().length > 0

    )

    .slice(
      0,
      15
    );

}


/* =====================
   GET HERO SLIDES
===================== */

export async function GET() {


  const hero =
    await prisma.tutorPage.findUnique({

      where: {

        id:
          "hero-slider",

      },

    });


  const content =

    hero?.content &&

    typeof hero.content ===
      "object" &&

    !Array.isArray(
      hero.content
    )

      ? (

          hero.content as {

            slides?: unknown;

          }

        )

      : {};


  return NextResponse.json({

    slides:

      normalizeSlides(
        content.slides
      ),

  });

}


/* =====================
   SAVE HERO SLIDES
===================== */

export async function PUT(
  req: Request
) {


  const isAdmin =
    await verifyAdminSession();


  if (!isAdmin) {

    return NextResponse.json(

      {

        error:
          "Forbidden",

      },

      {

        status:
          403,

      }

    );

  }


  const body =
    await req.json();


  const slides =
    normalizeSlides(
      body?.slides
    );


  if (

    Array.isArray(
      body?.slides
    ) &&

    body.slides.length > 15

  ) {

    return NextResponse.json(

      {

        error:
          "Maximum 15 hero images are allowed",

      },

      {

        status:
          400,

      }

    );

  }


  const hero =
    await prisma.tutorPage.upsert({

      where: {

        id:
          "hero-slider",

      },


      update: {

        content: {

          slides,

        },

      },


      create: {

        id:
          "hero-slider",

        content: {

          slides,

        },

      },

    });


  return NextResponse.json({

    slides:

      normalizeSlides(

        (
          hero.content as {

            slides?: unknown;

          }

        )?.slides

      ),

  });

}
