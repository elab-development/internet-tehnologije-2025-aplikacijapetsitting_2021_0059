import { db } from "@/db";
import { korisnik, ljubimac, oglas, prijava } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: vlasnikId } = await params;
  const token = (await cookies()).get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ message: "Niste ulogovani" }, { status: 401 });
  }

  let claimsSub: string;
  try {
    claimsSub = verifyAuthToken(token).sub;
  } catch {
    return NextResponse.json({ message: "Neispravan token" }, { status: 401 });
  }

  const authUser = await db.query.korisnik.findFirst({
    where: eq(korisnik.id, claimsSub),
  });

  if (!authUser) {
    return NextResponse.json({ message: "Korisnik ne postoji" }, { status: 401 });
  }

  if (authUser.uloga !== "Admin" && authUser.id !== vlasnikId) {
    return NextResponse.json({ message: "Nemate dozvolu" }, { status: 403 });
  }

  const data = await db
    .select()
    .from(prijava)
    .leftJoin(oglas, eq(prijava.idOglas, oglas.id))
    .leftJoin(ljubimac, eq(oglas.idLjubimac, ljubimac.id))
    .leftJoin(korisnik, eq(prijava.idKorisnik, korisnik.id))
    .where(
      and(
        eq(oglas.idKorisnik, vlasnikId), 
        eq(prijava.status, "Na čekanju")
      )
    );

  return NextResponse.json(
    data.map((row) => ({
      ...row.prijava,
      oglas: row.oglas,
      ljubimac: row.ljubimac,
      sitter: row.korisnik
    }))
  );
}
