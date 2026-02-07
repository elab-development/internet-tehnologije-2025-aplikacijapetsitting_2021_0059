import { db } from "@/db";
import { oglas } from "@/db/schema";


//GET svi oglasi
export async function GET() {
  const allAds = await db.select().from(oglas);
  return Response.json(allAds);
}

//POST novi oglas
export async function POST(req: Request) {
  const body = await req.json();

  const newAd = await db.insert(oglas).values(body).returning();
  return Response.json(newAd[0], { status: 201 });
}