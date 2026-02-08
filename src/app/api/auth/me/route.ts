export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { korisnik } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";

export async function GET() {
     const token = (await cookies()).get(AUTH_COOKIE)?.value;

     // Ako token ne postoji, korisnik nije ulogovan
     if (!token) {
         return NextResponse.json({ user: null });
     }

     try {
         const claims = verifyAuthToken(token);


         const [u] = await db.select({
                 id: korisnik.id,
                 ime: korisnik.ime,
                 email: korisnik.email,
                 uloga: korisnik.uloga,
             })
             .from(korisnik)
             .where(eq(korisnik.id, claims.sub));

         return NextResponse.json({ user: u ?? null });
     } catch {

         return NextResponse.json({ user: null }, { status: 401 });
  }
}
