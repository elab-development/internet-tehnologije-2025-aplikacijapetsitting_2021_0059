import { db } from "@/db";
import { korisnik, ljubimac, oglas, prijava } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const data = await db
    .select()
    .from(prijava)
    .leftJoin(korisnik, eq(prijava.idKorisnik, korisnik.id))
    .leftJoin(oglas, eq(prijava.idOglas, oglas.id))
    .leftJoin(ljubimac, eq(oglas.idLjubimac, ljubimac.id))
    .orderBy(desc(prijava.createdAt));

  return NextResponse.json(
    data.map((row) => ({
      id: row.prijava.id,
      status: row.prijava.status,
      createdAt: row.prijava.createdAt,
      sitter: row.korisnik
        ? {
            id: row.korisnik.id,
            ime: row.korisnik.ime,
            prezime: row.korisnik.prezime,
            email: row.korisnik.email,
          }
        : null,
      oglas: row.oglas
        ? {
            id: row.oglas.id,
            opis: row.oglas.opis,
            terminCuvanja: row.oglas.terminCuvanja,
            naknada: row.oglas.naknada,
            ljubimac: row.ljubimac
              ? {
                  id: row.ljubimac.id,
                  ime: row.ljubimac.ime,
                  tip: row.ljubimac.tip,
                }
              : null,
          }
        : null,
    }))
  );
}

