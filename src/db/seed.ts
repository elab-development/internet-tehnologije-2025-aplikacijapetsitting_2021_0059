import "dotenv/config";
import { korisnik } from "./schema";
import { db } from "./index";
import bcrypt from "bcrypt";

const hash = await bcrypt.hash("1233", 10);

await db.transaction(async (tx) => {
    await tx.insert(korisnik).values([
        {
            id: "7a0a1e00-9651-4071-86b8-ed32dba35bf2",
            ime:  "Pera",
            prezime: "Peric"  ,
            email: "peraperic@gmail.com",
            lozinka:  "123",
            brojTelefona:  "060123456"    ,
            datumRodjenja: "01.01.2002.",
            grad: "Beograd",
            opstina: "Vozdovac"    ,
            prosecnaOcena: 10,
        },
        {
            id: "7a0a1e00-9651-4071-86b8-ed32dba35bf3",
            ime:  "Ana",
            prezime: "Anic"  ,
            email: "anaanic@gmail.com",
            lozinka:  "123",
            brojTelefona:  "0601234567"    ,
            datumRodjenja: "01.01.2001.",
            grad: "Beograd",
            opstina: "Zemun"    ,
            prosecnaOcena: 10,
        },
        {
            id: "7a0a1e00-9651-4071-86b8-ed32dba35bf4",
            ime:  "Zika",
            prezime: "Zikic"  ,
            email: "zikazikic@gmail.com",
            lozinka:  "123",
            brojTelefona:  "06012345678"    ,
            datumRodjenja: "01.01.2003.",
            grad: "Beograd",
            opstina: "Palilula"    ,
            prosecnaOcena: 10,
        },
    ]);
});

process.exit(0);
