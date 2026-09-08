import {
  createSlug,
} from "@/lib/study-materials";


export function createSuccessShortSlug(
  title: string
) {

  return createSlug(
    title
  );

}


export function getYouTubeVideoId(
  url: string
) {

  try {

    const parsedUrl =
      new URL(url);


    const hostname =
      parsedUrl.hostname
        .replace(
          "www.",
          ""
        )
        .toLowerCase();


    /*
      YouTube Shorts URL

      youtube.com/shorts/VIDEO_ID
    */

    if (
      hostname === "youtube.com" &&
      parsedUrl.pathname.startsWith(
        "/shorts/"
      )
    ) {

      const videoId =
        parsedUrl.pathname
          .replace(
            "/shorts/",
            ""
          )
          .split("/")[0];


      return videoId || null;

    }


    /*
      Normal YouTube URL

      youtube.com/watch?v=VIDEO_ID
    */

    if (
      hostname === "youtube.com"
    ) {

      const videoId =
        parsedUrl.searchParams.get(
          "v"
        );


      return videoId || null;

    }


    /*
      Short YouTube URL

      youtu.be/VIDEO_ID
    */

    if (
      hostname === "youtu.be"
    ) {

      const videoId =
        parsedUrl.pathname
          .replace(
            "/",
            ""
          )
          .split("/")[0];


      return videoId || null;

    }


    return null;

  }

  catch {

    return null;

  }

}


export function isValidYouTubeUrl(
  url: string
) {

  return Boolean(
    getYouTubeVideoId(
      url
    )
  );

}


export function getSuccessShortEmbedUrl(
  videoId: string
) {

  return `https://www.youtube.com/embed/${encodeURIComponent(
    videoId
  )}`;

}


export function getSuccessShortReachScore(
  views: number,
  likes: number,
  shares: number
) {

  return (
    views +
    likes * 3 +
    shares * 5
  );

}
