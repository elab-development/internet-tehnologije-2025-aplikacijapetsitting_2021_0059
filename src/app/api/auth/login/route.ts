import { korisnik } from "@/db/schema";
import { db } from "@/db";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Body = {
 email: string;
 password: string;
};

export async function POST(req: Request) {
 const { email, password } = (await req.json()) as Body;

 // 2. Validate input – proveravamo da li su oba polja prisutna
 // Ako neki podatak nedostaje, vraćamo 401
 if (!email || !password) {
     return NextResponse.json(
        { error: "Unesite email i lozinku" },
         { status: 401 }
    );
 }

 // 3. Look up user by email – tražimo korisnika u bazi po email-u
 // Ako korisnik ne postoji, vraćamo 401
 const [u] = await db.select().from(korisnik).where(eq(korisnik.email, email));

 if (!u) {
     return NextResponse.json(
         { error: "Pogresan email ili lozinka" },
         { status: 401 }
     );
 }

 // 4. Compare password – upoređujemo unetu lozinku sa heširanom lozinkom iz baze
 // Ako se ne poklapaju, vraćamo 401
 const ok = await bcrypt.compare(password, u.lozinka);
 if (!ok) {
     return NextResponse.json(
         { error: "Pogresan email ili lozinka" },
         { status: 401 }
     );
 }

 // 5. Sign JWT – generišemo JWT token koji sadrži:
 // sub (id korisnika), email i ime
 const token = signAuthToken({
     sub: u.id,
     email: u.email,
     name: u.ime,
 });

 // 6. Set cookie with JWT – postavljamo token u cookie
 // Cookie je httpOnly i secure (definisano u cookieOpts)
 const res = NextResponse.json({
     id: u.id,
     name: u.ime,
     email: u.email,
 });
 res.cookies.set(AUTH_COOKIE, token, cookieOpts());

// 7. Return JSON user data – frontend dobija osnovne podatke o korisniku
 return res;
}
