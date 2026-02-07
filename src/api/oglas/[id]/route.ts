import { db } from "@/db";
import { oglas } from "@/db/schema";
import { eq } from "drizzle-orm";


//GET jedan oglas
export async function GET( req: Request, { params }: { params: { id: string } }) {
  const ad = await db.query.oglas.findFirst({
    where: eq(oglas.id, params.id),
  });

  if (!ad) {
    return Response.json({ error: "Ad not found" }, { status: 404 });
  }

  return Response.json(ad);
}

//PUT jedan oglas
export async function PUT(req: Request, { params }: any) {
  const body = await req.json();

  const updated = await db.update(oglas).set(body).where(eq(oglas.id, params.id)).returning();

  return Response.json(updated[0]);
}

//DELETE jedan oglas
export async function DELETE(req: Request, { params }: any) {
  await db.delete(oglas).where(eq(oglas.id, params.id));
  return Response.json({ success: true });
}