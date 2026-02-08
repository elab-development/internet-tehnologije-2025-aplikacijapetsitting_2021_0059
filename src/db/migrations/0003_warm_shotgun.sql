ALTER TABLE "korisnik" ALTER COLUMN "prezime" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "korisnik" ALTER COLUMN "prezime" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "korisnik" ALTER COLUMN "brojTelefona" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "korisnik" ALTER COLUMN "brojTelefona" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "korisnik" ALTER COLUMN "datumRodjenja" SET DEFAULT '1900-01-01';--> statement-breakpoint
ALTER TABLE "korisnik" ALTER COLUMN "datumRodjenja" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "korisnik" ALTER COLUMN "grad" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "korisnik" ALTER COLUMN "grad" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "korisnik" ALTER COLUMN "opstina" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "korisnik" ALTER COLUMN "opstina" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "korisnik" ALTER COLUMN "prosecna_ocena" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "korisnik" ALTER COLUMN "prosecna_ocena" DROP NOT NULL;