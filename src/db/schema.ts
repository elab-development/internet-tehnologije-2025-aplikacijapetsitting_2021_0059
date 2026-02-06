
import { dateDuration } from "drizzle-orm/gel-core";
import {pgTable, serial, varchar, integer, timestamp, uuid, doublePrecision, date, pgEnum} from "drizzle-orm/pg-core";

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

//Oglas
export const oglas = pgTable("oglas", {
  id: uuid("id").primaryKey().defaultRandom(),
  opis : varchar("opis", { length: 255 }).notNull(),
  terminCuvanja: date("terminCuvanja").notNull(),
  naknada: doublePrecision("naknada").notNull(),

  idKorisnik: uuid("idKorisnik").notNull().references(() => korisnik.id),
  idLjubimac: uuid("idLjubimac").notNull().references(() => ljubimac.id),
  idTipUsluge: uuid("idTipUsluge").notNull().references(() => tipUsluge.id),
});
//tip usluge
export const tipUsluge = pgTable("tipUsluge", {
  id: uuid("id").primaryKey().defaultRandom(),
  ime : varchar("ime", { length: 255 }).notNull(),
});


//Ljubimac
export const ljubimac = pgTable("ljubimac", {
  id: uuid("id").primaryKey().defaultRandom(),
  tip : varchar("tip", { length: 255 }).notNull(),
  ime : varchar("ime", { length: 255 }).notNull(),
  datumRodjenja: date("datumRodjenja"),
  alergije: varchar("alergije", { length: 255 }).notNull().default("/"),
  lekovi: varchar("lekovi", { length: 255 }).notNull().default("/"),
  ishrana: varchar("ishrana", { length: 255 }).notNull().default("/"),

  idKorisnik: uuid("idKorisnik").notNull().references(() => korisnik.id),
});


//Prijava na oglas
export const prijava = pgTable("prijava", {
  id: uuid("id").primaryKey().defaultRandom(),
  status : varchar("status", { length: 255 }).notNull().default("U obradi"),
  ocena : doublePrecision("ocena").default(0),
 

  idKorisnik: uuid("idKorisnik").notNull().references(() => korisnik.id),
  idOglas: uuid("idOglas").notNull().references(() => oglas.id),
});