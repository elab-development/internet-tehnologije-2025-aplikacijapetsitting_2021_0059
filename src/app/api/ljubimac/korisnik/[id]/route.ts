import { db } from "@/db";
import { ljubimac } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest,{ params }: { params: Promise<{ id: string }> }) {
  
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "Nedostaje korisnikId" }, { status: 400 });
  }

const data = await db
  .select()
  .from(ljubimac)
  .where(eq(ljubimac.idKorisnik, id));

  return NextResponse.json(data);
}
