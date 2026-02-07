import { db } from "@/db";
import { korisnik } from "@/db/schema";
import { eq } from "drizzle-orm";


//GET korisnik po ID‑ju
export async function GET( req: Request, { params }: { params: { id: string } }) {
  const user = await db.query.korisnik.findFirst({
    where: eq(korisnik.id, params.id),
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json(user);
}