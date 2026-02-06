import AdCard from "./components/AdCard";
import Button from "./components/Button";



type Ad = {
  id: number;
  korisnik: string;
  opis: string;
  ljubimac: string;
  tipUsluge: string;
  terminCuvanja: string;
  naknada: string;
};

const ads: Ad[] = [
  { id: 1, korisnik: "Sara", opis: "Čuvanje psa", ljubimac: "Pas", tipUsluge: "Čuvanje", terminCuvanja: "12.02.2026 od 17h", naknada: "500 din po satu" },
  { id: 2, korisnik: "Mario", opis: "Šetnja psa", ljubimac: "Pas", tipUsluge: "Šetnja", terminCuvanja: "12.02.2026 od 20h", naknada: "500 din" },
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
              marginTop: "10px"
            }}
          >
             <AdCard key={ad.id} korisnik={ad.korisnik} opis={ad.opis} ljubimac={ad.ljubimac} tipUsluge={ad.tipUsluge} terminCuvanja={ad.terminCuvanja} naknada={ad.naknada}/>
             <Button text="Prijavi se" type="submit" />
          </div>
        ))}
      </div>
    </main>
  );
}

