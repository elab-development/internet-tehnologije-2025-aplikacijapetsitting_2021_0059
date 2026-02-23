import { db } from "@/db";
import { korisnik, oglas, prijava } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const users = await db.select({ id: korisnik.id, uloga: korisnik.uloga }).from(korisnik);
  const ads = await db.select({ id: oglas.id }).from(oglas);
  const applications = await db.select({ id: prijava.id }).from(prijava);

  const sitters = users.filter((u) => u.uloga === "Sitter").length;
  const owners = users.filter((u) => u.uloga === "Vlasnik").length;

  return NextResponse.json({
    users: users.length,
    ads: ads.length,
    applications: applications.length,
    sitters,
    owners,
  });
}

