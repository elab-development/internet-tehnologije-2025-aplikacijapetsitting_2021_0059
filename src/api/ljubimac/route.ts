import { db } from "@/db";
import { ljubimac } from "@/db/schema";

//GET svi ljubimci
export async function GET() {
  const allPets = await db.select().from(ljubimac);
  return Response.json(allPets);
}
//POST novi ljubimac
export async function POST(req: Request) {
  const body = await req.json();
  const pet = await db.insert(ljubimac).values(body).returning();
  return Response.json(pet[0], { status: 201 });
}