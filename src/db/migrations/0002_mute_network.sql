ALTER TABLE "prijava" ALTER COLUMN "ocena" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "korisnik" ADD COLUMN "uloga" varchar(100) DEFAULT 'Vlasnik' NOT NULL;