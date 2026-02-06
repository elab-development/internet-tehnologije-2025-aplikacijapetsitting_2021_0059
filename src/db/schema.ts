
import {pgTable, serial, varchar, integer, timestamp, uuid, doublePrecision, date} from "drizzle-orm/pg-core";

// Korisnici
export const korisnik = pgTable("korisnik", {
    id:         uuid("id").primaryKey().defaultRandom(),
    ime:       varchar("ime",  { length: 100 }).notNull(),
    prezime:       varchar("prezime",  { length: 100 }).notNull(),
    email:      varchar("email", { length: 255 }).notNull().unique(),
    lozinka:   varchar("lozinka", { length: 255 }).notNull(),
    brojTelefona:       varchar("brojTelefona",  { length: 100 }).notNull(),
    datumRodjenja:       date("datumRodjenja").notNull(),
    grad:       varchar("grad",  { length: 100 }).notNull(),
    opstina:       varchar("opstina",  { length: 100 }).notNull(),
    prosecnaOcena: doublePrecision("prosecna_ocena").notNull(),
});