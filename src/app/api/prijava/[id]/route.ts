import { db } from "@/db";
import { prijava } from "@/db/schema";
import { eq } from "drizzle-orm";

//GET prijava
export async function GET(req: Request, { params }: any) {
  const app = await db.query.prijava.findFirst({
    where: eq(prijava.id, params.id),
  });

  if (!app) {
    return Response.json({ error: "Application not found" }, { status: 404 });
  }

  return Response.json(app);
}

//DELETE prijava
export async function DELETE(req: Request, { params }: any) {
  await db.delete(prijava).where(eq(prijava.id, params.id));
  return Response.json({ success: true });
}