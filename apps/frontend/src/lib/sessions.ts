import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { redirect } from "next/navigation";

export type SessionUser = {
  id?: string;
  name?: string;
  avatar?: string;
};

export type SessionPayload = {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
};

const secretKey = process.env.SESSION_SERET_KEY!;
const encodeKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: SessionPayload) {
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodeKey);

  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiredAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookie = (await cookies()).get("session")?.value;

  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encodeKey, {
      algorithms: ["HS256"],
    });

    return payload as SessionPayload;
  } catch (error) {
    console.error("Failed to verify the session: ", error);
    redirect("/auth/signIn");
  }
}

export async function deleteSession(callbackUrl: string = "/") {
  await (await cookies()).delete("session");
  redirect(callbackUrl);
}
