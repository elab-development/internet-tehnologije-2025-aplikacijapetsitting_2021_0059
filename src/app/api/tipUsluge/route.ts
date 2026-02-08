import { db } from "@/db";
import { tipUsluge } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const tipovi = await db.select().from(tipUsluge);
  return NextResponse.json(tipovi);
}