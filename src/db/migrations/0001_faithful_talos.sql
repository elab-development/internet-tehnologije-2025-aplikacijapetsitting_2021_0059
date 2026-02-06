CREATE TABLE "ljubimac" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tip" varchar(255) NOT NULL,
	"ime" varchar(255) NOT NULL,
	"datumRodjenja" date,
	"alergije" varchar(255) DEFAULT '/' NOT NULL,
	"lekovi" varchar(255) DEFAULT '/' NOT NULL,
	"ishrana" varchar(255) DEFAULT '/' NOT NULL,
	"idKorisnik" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "oglas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"opis" varchar(255) NOT NULL,
	"terminCuvanja" date NOT NULL,
	"naknada" double precision NOT NULL,
	"idKorisnik" uuid NOT NULL,
	"idLjubimac" uuid NOT NULL,
	"idTipUsluge" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prijava" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" varchar(255) DEFAULT 'U obradi' NOT NULL,
	"ocena" double precision,
	"idKorisnik" uuid NOT NULL,
	"idOglas" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tipUsluge" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ime" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ljubimac" ADD CONSTRAINT "ljubimac_idKorisnik_korisnik_id_fk" FOREIGN KEY ("idKorisnik") REFERENCES "public"."korisnik"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oglas" ADD CONSTRAINT "oglas_idKorisnik_korisnik_id_fk" FOREIGN KEY ("idKorisnik") REFERENCES "public"."korisnik"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oglas" ADD CONSTRAINT "oglas_idLjubimac_ljubimac_id_fk" FOREIGN KEY ("idLjubimac") REFERENCES "public"."ljubimac"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oglas" ADD CONSTRAINT "oglas_idTipUsluge_tipUsluge_id_fk" FOREIGN KEY ("idTipUsluge") REFERENCES "public"."tipUsluge"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prijava" ADD CONSTRAINT "prijava_idKorisnik_korisnik_id_fk" FOREIGN KEY ("idKorisnik") REFERENCES "public"."korisnik"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prijava" ADD CONSTRAINT "prijava_idOglas_oglas_id_fk" FOREIGN KEY ("idOglas") REFERENCES "public"."oglas"("id") ON DELETE no action ON UPDATE no action;