import { db } from "@/db";
import { korisnik } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


//GET korisnik po ID‑ju
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await db.query.korisnik.findFirst({
    where: eq(korisnik.id, id),
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json(user);
}

//DELETE korisnik po ID-ju
export async function DELETE( req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await db.delete(korisnik).where(eq(korisnik.id, id));

  return Response.json({ message: "User deleted" });
}

export async function PUT(req: Request) {
  try {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ message: "Niste ulogovani" }, { status: 401 });
    }

    const claims = verifyAuthToken(token);

    const body = await req.json();
    const {
      ime,
      prezime,
      brojTelefona,
      grad,
      opstina,
      datumRodjenja,
    } = body;

    await db
      .update(korisnik)
      .set({
        ime,
        prezime,
        brojTelefona,
        grad,
        opstina,
        datumRodjenja,
      })
      .where(eq(korisnik.id, claims.sub));
     
    return NextResponse.json({ message: "Profil ažuriran" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Greška na serveru" }, { status: 500 });
  }
}