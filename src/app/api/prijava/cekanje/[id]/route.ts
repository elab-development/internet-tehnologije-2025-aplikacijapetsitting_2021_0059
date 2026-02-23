import { db } from "@/db";
import { korisnik, ljubimac, oglas, prijava } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: vlasnikId } = await params;
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
