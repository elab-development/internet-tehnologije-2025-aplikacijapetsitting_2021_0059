import { db } from "@/db";
import { ljubimac } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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

//Update ljubimca pomocu PUT 
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
      const token = (await cookies()).get(AUTH_COOKIE)?.value;
  
      if (!token) {
        return NextResponse.json({ message: "Niste ulogovani" }, { status: 401 });
      }
      
      const claims = verifyAuthToken(token);
    const body = await req.json();
    
    const {
        tip,
        ime,
        datumRodjenja,
        alergije,
        lekovi,
        ishrana
    } = body;

    await db
      .update(ljubimac)
      .set({
        tip,
        ime,
        datumRodjenja,
        alergije,
        lekovi,
        ishrana
      })
      .where(eq(ljubimac.id, params.id));
     
    return NextResponse.json({ message: "Ljubimac ažuriran" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Greška na serveru" }, { status: 500 });
  }
}