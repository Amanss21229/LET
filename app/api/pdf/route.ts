import {
  NextRequest,
  NextResponse,
} from "next/server";


export const runtime =
  "nodejs";


export async function GET(
  request: NextRequest
) {

  try {

    const fileUrl =
      request.nextUrl.searchParams.get(
        "url"
      );


    const download =
      request.nextUrl.searchParams.get(
        "download"
      );


    if (!fileUrl) {

      return NextResponse.json(

        {
          error:
            "PDF URL is required",
        },

        {
          status:
            400,
        }

      );

    }


    let parsedUrl:
      URL;


    try {

      parsedUrl =
        new URL(
          fileUrl
        );

    }

    catch {

      return NextResponse.json(

        {
          error:
            "Invalid PDF URL",
        },

        {
          status:
            400,
        }

      );

    }


    /*
      SECURITY:

      Allow only Cloudinary URLs
    */

    if (

      parsedUrl.protocol !==
        "https:" ||

      parsedUrl.hostname !==
        "res.cloudinary.com"

    ) {

      return NextResponse.json(

        {
          error:
            "Invalid file source",
        },

        {
          status:
            403,
        }

      );

    }


    const response =
      await fetch(
        fileUrl
      );


    if (!response.ok) {

      return NextResponse.json(

        {
          error:
            "Unable to fetch PDF",
        },

        {
          status:
            response.status,
        }

      );

    }


    const fileBuffer =
      await response.arrayBuffer();


    const fileName =

      parsedUrl.pathname
        .split("/")
        .pop() ||

      "document.pdf";


    const disposition =

      download === "1"

        ? "attachment"

        : "inline";


    return new NextResponse(

      fileBuffer,

      {

        status:
          200,

        headers: {

          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `${disposition}; filename="${fileName}"`,

          "Cache-Control":
            "public, max-age=3600",

        },

      }

    );

  }

  catch (error) {

    console.error(

      "PDF proxy error:",

      error

    );


    return NextResponse.json(

      {
        error:
          "Unable to open PDF",
      },

      {
        status:
          500,
        }

    );

  }

}
