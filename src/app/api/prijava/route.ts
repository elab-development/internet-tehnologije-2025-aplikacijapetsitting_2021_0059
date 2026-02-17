import { db } from "@/db";
import { korisnik, ljubimac, oglas, prijava, tipUsluge } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { and, desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

//GET sve prijave
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const oglasId = searchParams.get("oglasId");
  const korisnikId = searchParams.get("korisnikId");

  //prijave na vlasnikov oglas
  if (oglasId) {
    const data = await db
      .select()
      .from(prijava)
      .leftJoin(oglas, eq(prijava.idOglas, oglas.id))
      .leftJoin(korisnik, eq(prijava.idKorisnik, korisnik.id))
      .where(eq(prijava.idOglas, oglasId));

    return NextResponse.json(
      data.map((row) => ({
        ...row.prijava,
        sitter: row.korisnik,
      }))
    );
  }

  //sitterove prijave na oglase
  if (korisnikId) {
    const data = await db
      .select()
      .from(prijava)
      .leftJoin(oglas, eq(prijava.idOglas, oglas.id))
      .leftJoin(ljubimac, eq(oglas.idLjubimac, ljubimac.id))
      .leftJoin(tipUsluge, eq(oglas.idTipUsluge, tipUsluge.id))
      .leftJoin(korisnik, eq(oglas.idKorisnik, korisnik.id))
      .where(eq(prijava.idKorisnik, korisnikId))
      .orderBy(desc(prijava.createdAt));


    return NextResponse.json(
      data.map((row) => ({
      ...row.prijava,
      oglas: {
        ...row.oglas,
        ljubimac: row.ljubimac,
        tipUsluge: row.tipUsluge,
        vlasnik: row.korisnik
      }
    }))
    );
  }

  return NextResponse.json(
    { message: "Nedostaje parametar" },
    { status: 400 }
  );
}

//POST nova prijava
export async function POST(req: NextRequest) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Niste ulogovani" }, { status: 401 });
  }

  const claims = verifyAuthToken(token);

  const body = await req.json();
  const { idOglas } = body;

  // provera da li već postoji prijava
  const postoji = await db.query.prijava.findFirst({
    where: and(
      eq(prijava.idKorisnik, claims.sub),
      eq(prijava.idOglas, idOglas)
    ),
  });

  if (postoji) {
    return NextResponse.json(
      { message: "Već ste prijavljeni na ovaj oglas" },
      { status: 400 }
    );
  }

  await db.insert(prijava).values({
    id: crypto.randomUUID(),
    status: "Na čekanju",
    ocena: null,
    idKorisnik: claims.sub,
    idOglas: idOglas,
  });

  return NextResponse.json({ message: "Uspešno ste se prijavili" });
}

export async function PATCH(req: NextRequest) {

  const body = await req.json();
  const { prijavaId, status } = body;
  const current = await db
    .select()
    .from(prijava)
    .where(eq(prijava.id, prijavaId));

  const idOglas = current[0].idOglas;

  if (status === "Odobreno") {
  await db
    .update(prijava)
    .set({ status: "Odbijeno" })
    .where(eq(prijava.idOglas, idOglas));

  await db
    .update(prijava)
    .set({ status: "Odobreno" })
    .where(eq(prijava.id, prijavaId));
  }else {
    await db
      .update(prijava)
      .set({ status })
      .where(eq(prijava.id, prijavaId));
  }
    
  return NextResponse.json({ message: "Status ažuriran" });
}


export async function DELETE(req: NextRequest) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Niste ulogovani" },
      { status: 401 }
    );
  }

  const claims = verifyAuthToken(token);
  const { searchParams } = new URL(req.url);
  const prijavaId = searchParams.get("id");

  if (!prijavaId) {
    return NextResponse.json(
      { message: "Nedostaje ID prijave" },
      { status: 400 }
    );
  }

  // Provera da li prijava pripada tom korisniku
  const prijavaData = await db.query.prijava.findFirst({
    where: eq(prijava.id, prijavaId),
  });

  if (!prijavaData) {
    return NextResponse.json(
      { message: "Prijava ne postoji" },
      { status: 404 }
    );
  }
  if (prijavaData.status == "Odobreno") {
    return NextResponse.json(
      { message: "Nije moguće opozvati odobrenu prijavu" },
      { status: 404 }
    );
  }

  if (prijavaData.idKorisnik !== claims.sub) {
    return NextResponse.json(
      { message: "Nemate dozvolu" },
      { status: 403 }
    );
  }

  await db.delete(prijava).where(eq(prijava.id, prijavaId));

  return NextResponse.json({ message: "Prijava obrisana" });
}
