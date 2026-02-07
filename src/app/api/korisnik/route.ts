import { db } from "@/db";
import { korisnik } from "@/db/schema";

//GET svi korisnici
export async function GET() {
  const users = await db.select().from(korisnik);
  return Response.json(users);
}