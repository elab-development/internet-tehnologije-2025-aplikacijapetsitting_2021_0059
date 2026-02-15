import { db } from "@/db";
import { korisnik, ljubimac, oglas, tipUsluge } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";



//GET svi oglasi
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sort = searchParams.get("sort");

    const query = db
    .select()
    .from(oglas)
    .leftJoin(korisnik, eq(oglas.idKorisnik, korisnik.id))
    .leftJoin(ljubimac, eq(oglas.idLjubimac, ljubimac.id))
    .leftJoin(tipUsluge, eq(oglas.idTipUsluge, tipUsluge.id));

  const data =
    sort === "staro" ? await query.orderBy(asc(oglas.createdAt)) : 
    sort === "cena_desc" ? await query.orderBy(desc(oglas.naknada)) : 
    sort === "cena_asc" ? await query.orderBy(asc(oglas.naknada)) : 
    sort === "datum_asc" ? await query.orderBy(asc(oglas.terminCuvanja)) : 
    sort === "datum_desc" ? await query.orderBy(desc(oglas.terminCuvanja)) : 
    await query.orderBy(desc(oglas.createdAt)); // default


  return NextResponse.json(
    data.map((row) => ({
      ...row.oglas,
      korisnik: row.korisnik,
      ljubimac: row.ljubimac,
      tipUsluge: row.tipUsluge,
    }))
  );
}


//POST novi oglas
export async function POST(req: Request) {
  try {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;
    if (!token) {
      return NextResponse.json({ message: "Niste ulogovani" }, { status: 401 });
    }
   

    const claims = verifyAuthToken(token);

    const user = await db.query.korisnik.findFirst({
      where: eq(korisnik.id, claims.sub),
    });

    if (!user) {
      return NextResponse.json({ message: "Korisnik ne postoji" }, { status: 401 });
    }
    
    if (user?.uloga !== "Vlasnik") {
      return NextResponse.json({ error: "Nemate dozvolu" }, { status: 403 });
    }

    const {
      opis,
      terminCuvanja,
      naknada,
      idLjubimac,
      idTipUsluge,
    } = await req.json();

    if (!opis || !terminCuvanja || !naknada || !idLjubimac || !idTipUsluge) {
      return NextResponse.json({ message: "Nedostaju podaci" }, { status: 400 });
    }

    await db.insert(oglas).values({
      opis,
      terminCuvanja, 
      naknada: Number(naknada),
      idKorisnik: user.id, 
      idLjubimac,
      idTipUsluge,
    });

    return NextResponse.json({ message: "Oglas dodat" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Greška" }, { status: 500 });
  }}