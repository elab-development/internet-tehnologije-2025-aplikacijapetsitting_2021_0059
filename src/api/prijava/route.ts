import { db } from "@/db";
import { prijava } from "@/db/schema";

//GET sve prijave
export async function GET() {
  const all = await db.select().from(prijava);
  return Response.json(all);
}

//POST nova prijava
export async function POST(req: Request) {
  const body = await req.json();

  const application = await db.insert(prijava).values(body).returning();

  return Response.json(application[0], { status: 201 });
}