import { db } from "@/db";
import { korisnik, ljubimac, oglas, tipUsluge } from "@/db/schema";
import { eq } from "drizzle-orm";
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
  await db.delete(oglas).where(eq(oglas.id, params.id));
  return Response.json({ success: true });
}