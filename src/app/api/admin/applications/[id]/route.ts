import { db } from "@/db";
import { prijava } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await params;

  await db.delete(prijava).where(eq(prijava.id, id));
  return NextResponse.json({ message: "Prijava je obrisana" });
}
