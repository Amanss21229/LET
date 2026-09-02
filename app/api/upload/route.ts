import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE =
  100 * 1024 * 1024;

const ALLOWED_TYPES = [

  "application/pdf",

];

function isAllowedFile(
  type: string
) {

  return (

    type.startsWith("image/") ||

    type.startsWith("audio/") ||

    ALLOWED_TYPES.includes(type)

  );

}

export async function POST(
  req: Request
) {

  try {

    const form =
      await req.formData();

    const file =
      form.get("file") as File | null;

    if (!file) {

      return NextResponse.json(
        {
          error:
            "No file selected",
        },
        {
          status: 400,
        }
      );

    }

    if (!isAllowedFile(file.type)) {

      return NextResponse.json(
        {
          error:
            "Only images, audio and PDF files are allowed",
        },
        {
          status: 400,
        }
      );

    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {

      return NextResponse.json(
        {
          error:
            "File size must be less than 100MB",
        },
        {
          status: 400,
        }
      );

    }

    const buffer =
      Buffer.from(
        await file.arrayBuffer()
      );

    const base64 =
      buffer.toString(
        "base64"
      );

    const dataUri =
      `data:${file.type};base64,${base64}`;

    const resourceType =

  file.type ===
  "application/pdf"

    ? "raw"

    : "auto";


const result =
  await cloudinary.uploader.upload(
    dataUri,
    {

      resource_type:
        resourceType,

      folder:
        "LET",

      use_filename:
        true,

      unique_filename:
        true,


      /*
            Important for PDFs
          */

          format:

            file.type ===
            "application/pdf"

              ? "pdf"

              : undefined,

    }
  );

    return NextResponse.json(
      {

        success: true,

        url:
          result.secure_url,

        type:
          file.type,

        originalName:
          file.name,

      }
    );

  } catch (error) {

    console.error(
      "Upload error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "File upload failed",
      },
      {
        status: 500,
      }
    );

  }

}
