import { db } from "@/db";
import { ljubimac } from "@/db/schema";
import { eq } from "drizzle-orm";

//GET ljubimac
export async function GET(req: Request, { params }: any) {
  const pet = await db.query.ljubimac.findFirst({
    where: eq(ljubimac.id, params.id),
  });

  if (!pet) {
    return Response.json({ error: "Pet not found" }, { status: 404 });
  }

  return Response.json(pet);
}


//DELETE ljubimac
export async function DELETE(req: Request, { params }: any) {
  await db.delete(ljubimac).where(eq(ljubimac.id, params.id));
  return Response.json({ success: true });
}