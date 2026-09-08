const appUrl =
  (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://let-edu.onrender.com"
  ).replace(/\/$/, "");


export const siteName =
  "LET - Learn Earn Teach";


export const siteShortName =
  "LET";


export function getAppUrl() {

  return appUrl;

}


export function getStudyMaterialsUrl() {

  return `${appUrl}/study-materials`;

}


export function getCategoryUrl(
  categorySlug: string
) {

  return `${getStudyMaterialsUrl()}/${encodeURIComponent(
    categorySlug
  )}`;

}


export function getSubjectUrl(
  categorySlug: string,
  subjectSlug: string
) {

  return `${getCategoryUrl(
    categorySlug
  )}/${encodeURIComponent(
    subjectSlug
  )}`;

}


export function getMaterialUrl(
  categorySlug: string,
  subjectSlug: string,
  materialSlug: string
) {

  return `${getSubjectUrl(
    categorySlug,
    subjectSlug
  )}/${encodeURIComponent(
    materialSlug
  )}`;

}

export function getSuccessShortsUrl() {

  return `${appUrl}/success-shorts`;

}


export function getSuccessShortUrl(
  shortSlug: string
) {

  return `${getSuccessShortsUrl()}/${encodeURIComponent(
    shortSlug
  )}`;

}
