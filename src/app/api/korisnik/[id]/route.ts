import { db } from "@/db";
import { korisnik } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";


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