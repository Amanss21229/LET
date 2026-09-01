import {
  NextResponse,
} from "next/server";

import {
  signOut,
} from "@/lib/auth";

export async function GET() {
  await signOut({
    redirect: false,
  });

  return NextResponse.redirect(
    new URL(
      "/",
      process.env.NEXT_PUBLIC_APP_URL
    )
  );
}
