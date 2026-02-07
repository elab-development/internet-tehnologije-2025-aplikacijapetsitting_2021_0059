import { db } from "@/db";
import { oglas } from "@/db/schema";
import { NextResponse } from "next/server";


//GET svi oglasi
export async function GET() {
 const allAds = await db.query.oglas.findMany({
    with: {
      korisnik: {
        columns: {
          id: true,
          ime: true,
          prezime: true,
        },
      },
      ljubimac: {
        columns: {
          id: true,
          ime: true,
          tip: true,
        },
      },
       tipUsluge: {
        columns: {
          id: true,
          ime: true
        },
     
    },
  }});

  return NextResponse.json(allAds);
}

//POST novi oglas
export async function POST(req: Request) {
  const body = await req.json();

  const newAd = await db.insert(oglas).values(body).returning();
  return Response.json(newAd[0], { status: 201 });
}