import "dotenv/config";
import { korisnik, ljubimac, oglas, prijava, tipUsluge } from "./schema";
import { db } from "./index";
import bcrypt from "bcrypt";

const hash = await bcrypt.hash("1233", 10);

await db.transaction(async (tx) => {
    
    await tx.insert(ljubimac).values([
        {
            id: "7a0a1e00-9651-4071-86b8-ed32dba35bf5",
            tip : "Macka",
            ime : "Prle",
            datumRodjenja: "1.5.2020.",
            alergije:"/",
            lekovi: "/",
            ishrana: "/",
            idKorisnik: "7a0a1e00-9651-4071-86b8-ed32dba35bf4"
        },
    ]);

    await tx.insert(tipUsluge).values([
        {
            id: "7a0a1e00-9651-4071-86b8-ed32dba35bf6",
            ime : "Čuvanje"
        },
         {
            id: "7a0a1e00-9651-4071-86b8-ed32dba35bf7",
            ime : "{Šetnja}"
        },
    ]);

await tx.insert(oglas).values([
        {
            id: "7a0a1e00-9651-4071-86b8-ed32dba35bf8",
            opis : "Čuvanje",
            terminCuvanja : "1.2.2026.",
            naknada : 600,
            idKorisnik : "7a0a1e00-9651-4071-86b8-ed32dba35bf2",
            idLjubimac : "7a0a1e00-9651-4071-86b8-ed32dba35bf5",
            idTipUsluge : "7a0a1e00-9651-4071-86b8-ed32dba35bf7"
        },
    ]);

await tx.insert(prijava).values([
        {
            id: "7a0a1e00-9651-4071-86b8-ed32dba35bf9",
            status : "U obradi",
            ocena : 0,
            idKorisnik : "7a0a1e00-9651-4071-86b8-ed32dba35bf3",
            idOglas : "7a0a1e00-9651-4071-86b8-ed32dba35bf8",
        },
    ]);



});



process.exit(0);
