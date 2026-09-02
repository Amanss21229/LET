import { getApps, initializeApp, cert } from "firebase-admin/app";

import {
  getAuth,
} from "firebase-admin/auth";


function getPrivateKey() {

  const privateKey =
    process.env.FIREBASE_PRIVATE_KEY;


  if (!privateKey) {
    return undefined;
  }


  return privateKey.replace(
    /\\n/g,
    "\n"
  );
}


const firebaseAdminApp =
  getApps().length > 0

    ? getApps()[0]

    : initializeApp({

        credential: cert({

          projectId:
            process.env.FIREBASE_PROJECT_ID,

          clientEmail:
            process.env.FIREBASE_CLIENT_EMAIL,

          privateKey:
            getPrivateKey(),

        }),

      });


export const firebaseAdminAuth =
  getAuth(firebaseAdminApp);
