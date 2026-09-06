export function createSlug(
  value: string
) {

  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

}


export function getGoogleDriveFileId(
  url: string
) {

  try {

    const parsed =
      new URL(url);


    if (
      !parsed.hostname.includes(
        "drive.google.com"
      )
    ) {

      return null;

    }


    const match =
      parsed.pathname.match(
        /\/d\/([^/]+)/
      );


    if (match?.[1]) {

      return match[1];

    }


    const id =
      parsed.searchParams.get(
        "id"
      );


    return id || null;

  }

  catch {

    return null;

  }

}


export function getGoogleDriveDownloadUrl(
  url: string
) {

  const fileId =
    getGoogleDriveFileId(url);


  if (!fileId) {

    return null;

  }


  return `https://drive.google.com/uc?export=download&id=${fileId}`;

}
