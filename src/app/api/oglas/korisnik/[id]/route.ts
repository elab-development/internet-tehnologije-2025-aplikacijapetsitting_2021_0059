import { db } from "@/db";
import { korisnik, ljubimac, oglas, prijava, tipUsluge } from "@/db/schema";
import { count } from "console";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


//GET oglas po idKorisnik
export async function GET(req: NextRequest) {

   const { searchParams } = new URL(req.url);
  const korisnikId = searchParams.get("idKorisnik") ?? searchParams.get("korisnikId");
   if (!korisnikId) {
    return NextResponse.json(
      { message: "Nedostaje idKorisnik/korisnikId" },
      { status: 400 }
    );
  }
  const data = await db
    .select()
    .from(oglas)
    .leftJoin(ljubimac, eq(oglas.idLjubimac, ljubimac.id))
    .leftJoin(tipUsluge, eq(oglas.idTipUsluge, tipUsluge.id))
    .leftJoin(prijava, eq(prijava.idOglas, oglas.id))
    .leftJoin(korisnik, eq(prijava.idKorisnik, korisnik.id))
    .where(eq(oglas.idKorisnik, korisnikId))
    .orderBy(desc(oglas.createdAt));

     const grouped = Object.values(
    data.reduce((acc, row) => {

      const oglasId = row.oglas.id;

      if (!acc[oglasId]) {
        acc[oglasId] = {
        ...row.oglas,
        ljubimac: row.ljubimac,
        tipUsluge: row.tipUsluge,
        prijave: [],
        brojPrijava: 0,
        imaOdobrenog: false,
        odobreniSitter: null
      };
      }

      if (row.prijava) {

        acc[oglasId].prijave.push({
          ...row.prijava,
          sitter: row.korisnik
        });

        acc[oglasId].brojPrijava++;

        if (row.prijava.status === "Odobreno") {
          acc[oglasId].imaOdobrenog = true;
          acc[oglasId].odobreniSitter = row.korisnik;
        }
      }

      return acc;

    }, {} as any)
  );

  return NextResponse.json(grouped);
}
