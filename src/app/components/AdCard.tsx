import Link from "next/link";

export type Korisnik = {
  id: string;
  ime: string;
  prezime: string;
  grad?: string;
  opstina?: string;
};

export type Ljubimac = {
  id: string;
  ime: string;
  tip: string;
  slika?: string;
};

export type TipUsluge = {
  id: string;
  ime: string;
};

export type Ad = {
  id: string;
  opis: string;
  tipUsluge: TipUsluge;
  terminCuvanja: string;
  naknada: string;
  korisnik: Korisnik;
  ljubimac: Ljubimac;
};

type AdCardProps = {
  korisnik: Korisnik;
  opis: string;
  ljubimac: Ljubimac;
  tipUsluge: TipUsluge;
  terminCuvanja: string;
  naknada: string;
};

export default function AdCard({ korisnik, opis, ljubimac, tipUsluge, terminCuvanja, naknada }: AdCardProps) {

  return (
    <Link
      href={`/profile/${korisnik.id}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <div
        className="card"
        style={{
          padding: 0,
          backgroundColor: "#efeeee",
          border: "1px solid #e4e4e4",
          borderRadius: 0,
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "stretch", flexWrap: "nowrap" }}>
          <div style={{ flex: "0 0 300px", width: 300 }}>
            {ljubimac.slika ? (
              <img
                src={ljubimac.slika}
                alt={`Ljubimac ${ljubimac.ime}`}
                style={{
                  width: "100%",
                  height: 300,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                  fontWeight: 700,
                }}
              >
                Bez slike
              </div>
            )}
          </div>

          <div style={{ flex: "1 1 auto", minWidth: 0, padding: "18px 22px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  color: "#6b7280",
                  fontWeight: 600,
                }}
              >
                Vlasnik: {korisnik.ime} {korisnik.prezime}
              </p>
              <p style={{ margin: 0, color: "#e4972e", fontWeight: 700, fontSize: 35 / 2 }}>
                RSD {naknada}
              </p>
            </div>
            <h2 style={{ margin: "0 0 8px 0", color: "#4f4f93", fontSize: 36 / 2 }}>{tipUsluge.ime}</h2>
            <p style={{ margin: "0 0 10px 0", color: "#7c7bb0", fontSize: 30 / 2, fontWeight: 700 }}>
              {korisnik.grad}, {korisnik.opstina}
            </p>
            <p style={{ margin: "0 0 14px 0", color: "#5b616f", fontSize: 16, lineHeight: 1.45 }}>{opis}</p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", color: "#2f7d2f", fontWeight: 700 }}>
              <p style={{ margin: 0 }}>{ljubimac.ime}, {ljubimac.tip}</p>
              <p style={{ margin: 0 }}>{terminCuvanja}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
