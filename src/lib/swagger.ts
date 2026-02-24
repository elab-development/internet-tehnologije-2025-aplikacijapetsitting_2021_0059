import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "PetSitting API",
      version: "1.0.0",
      description: "API dokumentacija za aplikaciju PetSitting.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development",
      },
    ],
    tags: [
      { name: "Auth" },
      { name: "Admin" },
      { name: "Korisnik" },
      { name: "Ljubimac" },
      { name: "Oglas" },
      { name: "Prijava" },
      { name: "TipUsluge" },
      { name: "Upload" },
      { name: "OpenAPI" },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "auth",
        },
      },
      schemas: {
        RegisterBody: {
          type: "object",
          required: ["ime", "email", "lozinka", "uloga"],
          properties: {
            ime: { type: "string", example: "Tamara" },
            email: { type: "string", format: "email", example: "tamara@mail.com" },
            lozinka: { type: "string", example: "tajna123" },
            uloga: { type: "string", enum: ["Vlasnik", "Sitter"] },
          },
        },
        LoginBody: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "tamara@mail.com" },
            password: { type: "string", example: "tajna123" },
          },
        },
        AdminRoleUpdateBody: {
          type: "object",
          required: ["uloga"],
          properties: {
            uloga: { type: "string", enum: ["Vlasnik", "Sitter", "Admin"] },
          },
        },
        UserProfileUpdateBody: {
          type: "object",
          properties: {
            ime: { type: "string" },
            prezime: { type: "string" },
            brojTelefona: { type: "string" },
            datumRodjenja: { type: "string" },
            grad: { type: "string" },
            opstina: { type: "string" },
          },
        },
        PetBody: {
          type: "object",
          properties: {
            tip: { type: "string" },
            ime: { type: "string" },
            slika: { type: "string" },
            datumRodjenja: { type: "string" },
            alergije: { type: "string" },
            lekovi: { type: "string" },
            ishrana: { type: "string" },
          },
        },
        AdBody: {
          type: "object",
          properties: {
            opis: { type: "string" },
            terminCuvanja: { type: "string" },
            naknada: { type: "number" },
            idLjubimac: { type: "string" },
            idTipUsluge: { type: "string" },
          },
        },
        ApplicationCreateBody: {
          type: "object",
          required: ["idOglas"],
          properties: {
            idOglas: { type: "string" },
          },
        },
        ApplicationPatchBody: {
          type: "object",
          required: ["prijavaId", "status"],
          properties: {
            prijavaId: { type: "string" },
            status: { type: "string", enum: ["Na cekanju", "Odobreno", "Odbijeno"] },
          },
        },
      },
    },
    paths: {
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Registracija korisnika",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterBody" },
              },
            },
          },
          responses: {
            "200": { description: "Uspesna registracija" },
            "400": { description: "Neispravan zahtev" },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Prijava korisnika",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginBody" },
              },
            },
          },
          responses: {
            "200": { description: "Uspesna prijava" },
            "401": { description: "Pogresan email ili lozinka" },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Odjava korisnika",
          responses: {
            "200": { description: "Uspesna odjava" },
          },
        },
      },
      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Trenutno ulogovani korisnik",
          responses: {
            "200": { description: "Vraca korisnika ili null" },
            "401": { description: "Nevalidan token" },
          },
        },
      },
      "/api/admin/stats": {
        get: {
          tags: ["Admin"],
          summary: "Sistemska statistika",
          security: [{ cookieAuth: [] }],
          responses: {
            "200": { description: "Uspesno" },
            "401": { description: "Nije autentifikovan" },
            "403": { description: "Nema dozvolu" },
          },
        },
      },
      "/api/admin/users": {
        get: {
          tags: ["Admin"],
          summary: "Lista svih korisnika (admin)",
          security: [{ cookieAuth: [] }],
          responses: {
            "200": { description: "Uspesno" },
            "401": { description: "Nije autentifikovan" },
            "403": { description: "Nema dozvolu" },
          },
        },
      },
      "/api/admin/users/{id}": {
        patch: {
          tags: ["Admin"],
          summary: "Promena uloge korisnika",
          security: [{ cookieAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AdminRoleUpdateBody" },
              },
            },
          },
          responses: {
            "200": { description: "Uloga azurirana" },
            "400": { description: "Neispravna uloga" },
            "401": { description: "Nije autentifikovan" },
            "403": { description: "Nema dozvolu" },
          },
        },
        delete: {
          tags: ["Admin"],
          summary: "Brisanje korisnika",
          security: [{ cookieAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Korisnik obrisan" },
            "400": { description: "Ne mozete obrisati svoj nalog" },
            "401": { description: "Nije autentifikovan" },
            "403": { description: "Nema dozvolu" },
          },
        },
      },
      "/api/admin/ads": {
        get: {
          tags: ["Admin"],
          summary: "Lista oglasa (admin)",
          security: [{ cookieAuth: [] }],
          responses: {
            "200": { description: "Uspesno" },
            "401": { description: "Nije autentifikovan" },
            "403": { description: "Nema dozvolu" },
          },
        },
      },
      "/api/admin/ads/{id}": {
        delete: {
          tags: ["Admin"],
          summary: "Brisanje oglasa (admin)",
          security: [{ cookieAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Oglas je obrisan" },
            "401": { description: "Nije autentifikovan" },
            "403": { description: "Nema dozvolu" },
          },
        },
      },
      "/api/admin/applications": {
        get: {
          tags: ["Admin"],
          summary: "Lista prijava (admin)",
          security: [{ cookieAuth: [] }],
          responses: {
            "200": { description: "Uspesno" },
            "401": { description: "Nije autentifikovan" },
            "403": { description: "Nema dozvolu" },
          },
        },
      },
      "/api/admin/applications/{id}": {
        delete: {
          tags: ["Admin"],
          summary: "Brisanje prijave (admin)",
          security: [{ cookieAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Prijava je obrisana" },
            "401": { description: "Nije autentifikovan" },
            "403": { description: "Nema dozvolu" },
          },
        },
      },
      "/api/korisnik": {
        get: {
          tags: ["Korisnik"],
          summary: "Lista korisnika",
          responses: {
            "200": { description: "Uspesno" },
          },
        },
      },
      "/api/korisnik/{id}": {
        get: {
          tags: ["Korisnik"],
          summary: "Korisnik po ID",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Uspesno" },
            "404": { description: "User not found" },
          },
        },
        delete: {
          tags: ["Korisnik"],
          summary: "Brisanje korisnika",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "User deleted" },
          },
        },
        put: {
          tags: ["Korisnik"],
          summary: "Azuriranje profila ulogovanog korisnika",
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserProfileUpdateBody" },
              },
            },
          },
          responses: {
            "200": { description: "Profil azuriran" },
            "401": { description: "Niste ulogovani" },
            "500": { description: "Greska na serveru" },
          },
        },
      },
      "/api/ljubimac": {
        get: {
          tags: ["Ljubimac"],
          summary: "Lista ljubimaca",
          responses: {
            "200": { description: "Uspesno" },
          },
        },
        post: {
          tags: ["Ljubimac"],
          summary: "Dodavanje novog ljubimca",
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PetBody" },
              },
            },
          },
          responses: {
            "200": { description: "Ljubimac uspesno dodat" },
            "400": { description: "Obavezna polja nedostaju" },
            "401": { description: "Niste ulogovani / korisnik ne postoji" },
            "403": { description: "Nemate dozvolu" },
            "500": { description: "Greska na serveru" },
          },
        },
      },
      "/api/ljubimac/{id}": {
        get: {
          tags: ["Ljubimac"],
          summary: "Ljubimac po ID",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Uspesno" },
            "404": { description: "Pet not found" },
          },
        },
        put: {
          tags: ["Ljubimac"],
          summary: "Azuriranje ljubimca",
          security: [{ cookieAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PetBody" },
              },
            },
          },
          responses: {
            "200": { description: "Ljubimac azuriran" },
            "401": { description: "Niste ulogovani" },
            "500": { description: "Greska na serveru" },
          },
        },
        delete: {
          tags: ["Ljubimac"],
          summary: "Brisanje ljubimca",
          security: [{ cookieAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Uspesno" },
            "401": { description: "Niste ulogovani" },
            "403": { description: "Nemate dozvolu" },
            "404": { description: "Ljubimac ne postoji" },
          },
        },
      },
      "/api/ljubimac/korisnik/{id}": {
        get: {
          tags: ["Ljubimac"],
          summary: "Ljubimci jednog korisnika",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Uspesno" },
            "400": { description: "Nedostaje korisnikId" },
          },
        },
      },
      "/api/oglas": {
        get: {
          tags: ["Oglas"],
          summary: "Lista oglasa",
          parameters: [
            {
              in: "query",
              name: "sort",
              required: false,
              schema: {
                type: "string",
                enum: ["staro", "cena_desc", "cena_asc", "datum_asc", "datum_desc"],
              },
            },
          ],
          responses: {
            "200": { description: "Uspesno" },
          },
        },
        post: {
          tags: ["Oglas"],
          summary: "Dodavanje oglasa",
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AdBody" },
              },
            },
          },
          responses: {
            "201": { description: "Oglas dodat" },
            "400": { description: "Nedostaju podaci" },
            "401": { description: "Niste ulogovani" },
            "403": { description: "Nemate dozvolu" },
            "500": { description: "Greska" },
          },
        },
      },
      "/api/oglas/{id}": {
        get: {
          tags: ["Oglas"],
          summary: "Jedan oglas po ID",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Uspesno" },
            "404": { description: "Oglas ne postoji" },
          },
        },
        put: {
          tags: ["Oglas"],
          summary: "Azuriranje oglasa",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AdBody" },
              },
            },
          },
          responses: {
            "200": { description: "Oglas azuriran" },
          },
        },
        delete: {
          tags: ["Oglas"],
          summary: "Brisanje oglasa",
          security: [{ cookieAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Uspesno" },
            "401": { description: "Niste ulogovani" },
            "403": { description: "Nemate dozvolu" },
            "404": { description: "Oglas ne postoji" },
            "500": { description: "Brisanje oglasa nije uspelo" },
          },
        },
      },
      "/api/oglas/korisnik/{id}": {
        get: {
          tags: ["Oglas"],
          summary: "Oglasi korisnika",
          parameters: [
            { in: "path", name: "id", required: true, schema: { type: "string" } },
            { in: "query", name: "idKorisnik", required: false, schema: { type: "string" } },
            { in: "query", name: "korisnikId", required: false, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "Uspesno" },
            "400": { description: "Nedostaje idKorisnik/korisnikId" },
          },
        },
      },
      "/api/prijava": {
        get: {
          tags: ["Prijava"],
          summary: "Lista prijava po oglasu ili korisniku",
          parameters: [
            { in: "query", name: "oglasId", required: false, schema: { type: "string" } },
            { in: "query", name: "korisnikId", required: false, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "Uspesno" },
            "400": { description: "Nedostaje parametar" },
          },
        },
        post: {
          tags: ["Prijava"],
          summary: "Kreiranje prijave",
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApplicationCreateBody" },
              },
            },
          },
          responses: {
            "200": { description: "Uspesno ste se prijavili" },
            "400": { description: "Vec ste prijavljeni na ovaj oglas" },
            "401": { description: "Niste ulogovani" },
          },
        },
        patch: {
          tags: ["Prijava"],
          summary: "Azuriranje statusa prijave",
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApplicationPatchBody" },
              },
            },
          },
          responses: {
            "200": { description: "Status azuriran" },
            "401": { description: "Niste ulogovani / token nije validan" },
            "403": { description: "Nemate dozvolu" },
            "404": { description: "Prijava ili oglas ne postoji" },
          },
        },
        delete: {
          tags: ["Prijava"],
          summary: "Opoziv/brisanje prijave",
          security: [{ cookieAuth: [] }],
          parameters: [{ in: "query", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Prijava obrisana" },
            "400": { description: "Nedostaje ID prijave" },
            "401": { description: "Niste ulogovani" },
            "403": { description: "Nemate dozvolu" },
            "404": { description: "Prijava ne postoji / nije moguce opozvati odobrenu" },
          },
        },
      },
      "/api/prijava/{id}": {
        get: {
          tags: ["Prijava"],
          summary: "Prijava po ID",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Uspesno" },
            "404": { description: "Application not found" },
          },
        },
        delete: {
          tags: ["Prijava"],
          summary: "Brisanje prijave po ID",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Uspesno" },
          },
        },
      },
      "/api/prijava/cekanje/{id}": {
        get: {
          tags: ["Prijava"],
          summary: "Prijave na cekanju za vlasnika",
          security: [{ cookieAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Uspesno" },
            "401": { description: "Niste ulogovani / token nije validan" },
            "403": { description: "Nemate dozvolu" },
          },
        },
      },
      "/api/tipUsluge": {
        get: {
          tags: ["TipUsluge"],
          summary: "Lista tipova usluge",
          responses: {
            "200": { description: "Uspesno" },
          },
        },
      },
      "/api/upload": {
        post: {
          tags: ["Upload"],
          summary: "Upload slike",
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["file"],
                  properties: {
                    file: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Upload uspesan" },
            "400": { description: "Neispravan fajl" },
            "401": { description: "Niste ulogovani" },
            "500": { description: "Greska pri upload-u slike" },
          },
        },
      },
      "/api/openapi": {
        get: {
          tags: ["OpenAPI"],
          summary: "OpenAPI specifikacija",
          responses: {
            "200": { description: "Uspesno" },
          },
        },
      },
    },
  },
  apis: ["./src/app/api/**/*.ts"],
});
