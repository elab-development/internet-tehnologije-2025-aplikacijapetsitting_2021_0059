CREATE TABLE "korisnik" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ime" varchar(100) NOT NULL,
	"prezime" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"lozinka" varchar(255) NOT NULL,
	"brojTelefona" varchar(100) NOT NULL,
	"datumRodjenja" date NOT NULL,
	"grad" varchar(100) NOT NULL,
	"opstina" varchar(100) NOT NULL,
	"prosecna_ocena" double precision NOT NULL,
	CONSTRAINT "korisnik_email_unique" UNIQUE("email")
);
