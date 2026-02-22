ALTER TABLE "oglas" ALTER COLUMN "opis" SET DATA TYPE varchar(1000);--> statement-breakpoint
ALTER TABLE "ljubimac" ADD COLUMN "slika" varchar(2048) DEFAULT '';