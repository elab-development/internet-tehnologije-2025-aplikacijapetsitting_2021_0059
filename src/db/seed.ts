import "dotenv/config";
import bcrypt from "bcrypt";
import { db } from "./index";
import { korisnik, ljubimac, oglas, prijava, tipUsluge } from "./schema";

const ownerId = "7a0a1e00-9651-4071-86b8-ed32dba35bf2";
const sitterId = "7a0a1e00-9651-4071-86b8-ed32dba35bf3";
const petOwnerId = "7a0a1e00-9651-4071-86b8-ed32dba35bf4";
const petId = "7a0a1e00-9651-4071-86b8-ed32dba35bf5";
const serviceCareId = "7a0a1e00-9651-4071-86b8-ed32dba35bf6";
const serviceWalkId = "7a0a1e00-9651-4071-86b8-ed32dba35bf7";
const adId = "7a0a1e00-9651-4071-86b8-ed32dba35bf8";
const applicationId = "7a0a1e00-9651-4071-86b8-ed32dba35bf9";

const hash = await bcrypt.hash("1233", 10);

await db.transaction(async (tx) => {
  await tx.delete(prijava);
  await tx.delete(oglas);
  await tx.delete(ljubimac);
  await tx.delete(tipUsluge);
  await tx.delete(korisnik);

  await tx.insert(korisnik).values([
    {
      id: ownerId,
      ime: "Tamara",
      prezime: "Vlasnik",
      email: "vlasnik@test.com",
      lozinka: hash,
      grad: "Beograd",
      opstina: "Novi Beograd",
      uloga: "Vlasnik",
    },
    {
      id: sitterId,
      ime: "Ana",
      prezime: "Sitter",
      email: "sitter@test.com",
      lozinka: hash,
      grad: "Beograd",
      opstina: "Vracar",
      uloga: "Sitter",
    },
    {
      id: petOwnerId,
      ime: "Marko",
      prezime: "PetOwner",
      email: "petowner@test.com",
      lozinka: hash,
      grad: "Beograd",
      opstina: "Zemun",
      uloga: "Vlasnik",
    },
  ]);

  await tx.insert(tipUsluge).values([
    {
      id: serviceCareId,
      ime: "Cuvanje",
    },
    {
      id: serviceWalkId,
      ime: "Setnja",
    },
  ]);

  await tx.insert(ljubimac).values([
    {
      id: petId,
      tip: "Macka",
      ime: "Prle",
      datumRodjenja: "2020-05-01",
      alergije: "/",
      lekovi: "/",
      ishrana: "/",
      idKorisnik: petOwnerId,
    },
  ]);

  await tx.insert(oglas).values([
    {
      id: adId,
      opis: "Cuvanje macke vikendom",
      terminCuvanja: "2026-04-01",
      naknada: 600,
      idKorisnik: ownerId,
      idLjubimac: petId,
      idTipUsluge: serviceWalkId,
    },
  ]);

  await tx.insert(prijava).values([
    {
      id: applicationId,
      status: "Na cekanju",
      ocena: 0,
      idKorisnik: sitterId,
      idOglas: adId,
    },
  ]);
});

process.exit(0);
