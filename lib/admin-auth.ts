import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "let_admin_session";

const SESSION_DURATION =
  60 * 60 * 12;

function getSecretKey() {
  const secret =
    process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error(
      "AUTH_SECRET is missing"
    );
  }

  return new TextEncoder().encode(
    secret
  );
}

export async function createAdminSession() {
  const token =
    await new SignJWT({
      role: "admin",
    })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime(
        "12h"
      )
      .sign(
        getSecretKey()
      );

  return token;
}

export async function verifyAdminSession() {
  try {
    const cookieStore =
      await cookies();

    const token =
      cookieStore
        .get(COOKIE_NAME)
        ?.value;

    if (!token) {
      return false;
    }

    const { payload } =
      await jwtVerify(
        token,
        getSecretKey()
      );

    return (
      payload.role === "admin"
    );
  } catch {
    return false;
  }
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}
