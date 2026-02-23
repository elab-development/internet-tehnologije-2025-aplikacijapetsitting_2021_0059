import { db } from "@/db";
import { korisnik } from "@/db/schema";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Body = {
    ime: string;
    email: string;
    lozinka: string;
    uloga: string;
};

export async function POST(req: Request) {
  const { ime, email, lozinka, uloga } = await req.json();

  if (!ime || !email || !lozinka || !uloga) {
    
    return NextResponse.json({ error: "Nedostaju podaci" }, { status: 400 });
  }

  if (!["Vlasnik", "Sitter"].includes(uloga)) {
    return NextResponse.json({ error: "Neispravna uloga" }, { status: 400 });
  }

  const exists = await db.select().from(korisnik).where(eq(korisnik.email, email));

  if (exists.length) {
    return NextResponse.json(
      { error: "Email postoji u bazi" },
      { status: 400 }
    );
  }

  const hashedLozinka = await bcrypt.hash(lozinka, 10);

  const [u] = await db.insert(korisnik).values({
      ime,
      email,
      lozinka: hashedLozinka,
      uloga,
    })
    .returning({
      id: korisnik.id,
      ime: korisnik.ime,
      email: korisnik.email,
      uloga: korisnik.uloga,
    });

  const token = signAuthToken({
    sub: u.id,
    email: u.email,
    name: u.ime,
  });

  const res = NextResponse.json(u);
  res.cookies.set(AUTH_COOKIE, token, cookieOpts());

  return res;
}
