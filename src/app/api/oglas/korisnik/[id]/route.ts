import { db } from "@/db";
import { korisnik, ljubimac, oglas, tipUsluge } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


//GET oglas po idKorisnik
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await db
    .select()
    .from(oglas)
    .leftJoin(korisnik, eq(oglas.idKorisnik, korisnik.id))
    .leftJoin(ljubimac, eq(oglas.idLjubimac, ljubimac.id))
    .leftJoin(tipUsluge, eq(oglas.idTipUsluge, tipUsluge.id))
    .where(eq(oglas.idKorisnik, params.id));

  return NextResponse.json(
    data.map((row) => ({
      ...row.oglas,
      korisnik: row.korisnik,
      ljubimac: row.ljubimac,
      tipUsluge: row.tipUsluge,
    }))
  );
}

