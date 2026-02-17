import { db } from "@/db";
import { korisnik, ljubimac, oglas, prijava, tipUsluge } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


//GET jedan oglas
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
    .where(eq(oglas.id, params.id));

  if (!data.length) {
    return NextResponse.json({ message: "Oglas ne postoji" }, { status: 404 });
  }

  return NextResponse.json({
    ...data[0].oglas,
    korisnik: data[0].korisnik,
    ljubimac: data[0].ljubimac,
    tipUsluge: data[0].tipUsluge,
  });
}


//PUT jedan oglas
export async function PUT(req: Request, { params }: any) {
  const body = await req.json();

  const updated = await db.update(oglas).set(body).where(eq(oglas.id, params.id)).returning();

  return Response.json(updated[0]);
}

//DELETE jedan oglas
export async function DELETE(req: Request, { params }: any) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Niste ulogovani" }, { status: 401 });
  }

  const claims = verifyAuthToken(token);
  const ad = await db.query.oglas.findFirst({
    where: eq(oglas.id, params.id),
  });

  if (!ad) {
    return NextResponse.json({ message: "Oglas ne postoji" }, { status: 404 });
  }

  if (ad.idKorisnik !== claims.sub) {
    return NextResponse.json({ message: "Nemate dozvolu" }, { status: 403 });
  }

  try {
    await db.transaction(async (tx) => {
      // Oglas ima FK reference iz prijava, zato prvo brišemo prijave pa oglas.
      await tx.delete(prijava).where(eq(prijava.idOglas, params.id));
      await tx.delete(oglas).where(eq(oglas.id, params.id));
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Brisanje oglasa nije uspelo." },
      { status: 500 }
    );
  }
}
