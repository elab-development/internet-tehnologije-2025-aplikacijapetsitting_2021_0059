import { db } from "@/db";
import { korisnik, ljubimac, oglas, tipUsluge } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const ads = await db
    .select()
    .from(oglas)
    .leftJoin(korisnik, eq(oglas.idKorisnik, korisnik.id))
    .leftJoin(ljubimac, eq(oglas.idLjubimac, ljubimac.id))
    .leftJoin(tipUsluge, eq(oglas.idTipUsluge, tipUsluge.id))
    .orderBy(desc(oglas.createdAt));

  return NextResponse.json(
    ads.map((row) => ({
      ...row.oglas,
      korisnik: row.korisnik,
      ljubimac: row.ljubimac,
      tipUsluge: row.tipUsluge,
    }))
  );
}

