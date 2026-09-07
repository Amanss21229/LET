const appUrl =
  (
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");


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
