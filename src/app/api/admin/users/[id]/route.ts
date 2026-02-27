import { db } from "@/db";
import { korisnik, ljubimac, oglas, prijava } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await params;
  const { uloga } = await req.json();
  const targetUser = await db.query.korisnik.findFirst({
    where: eq(korisnik.id, id),
    columns: { id: true, uloga: true },
  });

  if (!targetUser) {
    return NextResponse.json({ message: "Korisnik nije pronadjen" }, { status: 404 });
  }

  if (targetUser.uloga === "Admin") {
    return NextResponse.json({ message: "Nije dozvoljena izmena admin korisnika" }, { status: 403 });
  }

  if (!uloga || !["Vlasnik", "Sitter"].includes(uloga)) {
    return NextResponse.json({ message: "Neispravna uloga" }, { status: 400 });
  }

  await db.update(korisnik).set({ uloga }).where(eq(korisnik.id, id));
  return NextResponse.json({ message: "Uloga je azurirana" });
}

export async function DELETE(_: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await params;
  const targetUser = await db.query.korisnik.findFirst({
    where: eq(korisnik.id, id),
    columns: { id: true, uloga: true },
  });

  if (!targetUser) {
    return NextResponse.json({ message: "Korisnik nije pronadjen" }, { status: 404 });
  }

  if (auth.user.id === id) {
    return NextResponse.json({ message: "Ne mozete obrisati svoj nalog" }, { status: 400 });
  }

  if (targetUser.uloga === "Admin") {
    return NextResponse.json({ message: "Nije dozvoljeno brisanje admin korisnika" }, { status: 403 });
  }

  await db.transaction(async (tx) => {
    const ownedAds = await tx
      .select({ id: oglas.id })
      .from(oglas)
      .where(eq(oglas.idKorisnik, id));
    const adIds = ownedAds.map((a) => a.id);

    if (adIds.length > 0) {
      await tx.delete(prijava).where(inArray(prijava.idOglas, adIds));
      await tx.delete(oglas).where(inArray(oglas.id, adIds));
    }

    await tx.delete(prijava).where(eq(prijava.idKorisnik, id));
    await tx.delete(ljubimac).where(eq(ljubimac.idKorisnik, id));
    await tx.delete(korisnik).where(eq(korisnik.id, id));
  });

  return NextResponse.json({ message: "Korisnik je obrisan" });
}
