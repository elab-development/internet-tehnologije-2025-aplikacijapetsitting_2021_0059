import { db } from "@/db";
import { korisnik } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) {
    return {
      error: NextResponse.json({ message: "Niste ulogovani" }, { status: 401 }),
    };
  }

  try {
    const claims = verifyAuthToken(token);
    const user = await db.query.korisnik.findFirst({
      where: eq(korisnik.id, claims.sub),
    });

    if (!user || user.uloga !== "Admin") {
      return {
        error: NextResponse.json({ message: "Nemate dozvolu" }, { status: 403 }),
      };
    }

    return { user };
  } catch {
    return {
      error: NextResponse.json({ message: "Neispravan token" }, { status: 401 }),
    };
  }
}

