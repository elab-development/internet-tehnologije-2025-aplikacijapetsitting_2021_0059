import Image from "next/image";



type Ad = {
  id: number;
  opis: string;
  ljubimac: string;
  tipUsluge: string;
  terminCuvanja: string;
  naknada: string;
};

const ads: Ad[] = [
  { id: 1, opis: "Čuvanje psa", ljubimac: "Pas", tipUsluge: "Čuvanje", terminCuvanja: "12.02.2026 od 17h", naknada: "500 din po satu" },
  { id: 2, opis: "Šetnja psa", ljubimac: "Pas", tipUsluge: "Šetnja", terminCuvanja: "12.02.2026 od 20h", naknada: "500 din" },
];

export default function Home() {
   return (
    <main style={{ padding: "20px" }}>
      <h1>Oglasi</h1>

      <div style={{ marginTop: "20px" }}>
        {ads.map((ad) => (
          <div
            key={ad.id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "10px",
            }}
          >
            <h3>{ad.opis}</h3>
            <p>Ljubimac: {ad.ljubimac}</p>
            <p>Termin čuvanja: {ad.terminCuvanja}</p>
            <p>Tip usluge: {ad.tipUsluge}</p>
            <p>Novčana naknada: {ad.naknada}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

