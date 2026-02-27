import { db } from "@/db";
import { korisnik } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { ne } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const users = await db
    .select({
      id: korisnik.id,
      ime: korisnik.ime,
      prezime: korisnik.prezime,
      email: korisnik.email,
      grad: korisnik.grad,
      opstina: korisnik.opstina,
      uloga: korisnik.uloga,
    })
    .from(korisnik)
    .where(ne(korisnik.uloga, "Admin"));

  return NextResponse.json(users);
}
