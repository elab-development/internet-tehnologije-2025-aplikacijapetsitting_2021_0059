import { db } from "@/db";
import { korisnik, ljubimac } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

// GET svi ljubimci
export async function GET() {
  const allPets = await db.select().from(ljubimac);
  return Response.json(allPets);
}

// POST novi ljubimac
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

    if (user.uloga !== "Vlasnik") {
      return NextResponse.json({ error: "Nemate dozvolu" }, { status: 403 });
    }

    const body = await req.json();
    const { tip, ime, slika, datumRodjenja, alergije, lekovi, ishrana } = body;

    if (!tip || !ime || !datumRodjenja) {
      return NextResponse.json(
        { message: "Vrsta, ime i datum rodjenja su obavezni!" },
        { status: 400 }
      );
    }

    await db.insert(ljubimac).values({
      tip,
      ime,
      slika: slika || undefined,
      datumRodjenja,
      alergije: alergije || undefined,
      lekovi: lekovi || undefined,
      ishrana: ishrana || undefined,
      idKorisnik: user.id,
    });

    return NextResponse.json({ message: "Ljubimac uspesno dodat" });
  } catch (error) {
    console.error(error);
  return NextResponse.json(
      { message: "Greška na serveru" },
      { status: 500 }
    );
  }
}
