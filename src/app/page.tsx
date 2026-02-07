"use client"

import { useEffect, useState } from "react";
import AdCard, { Korisnik, Ljubimac, TipUsluge } from "./components/AdCard";
import Button from "./components/Button";



type Ad = {
  id: string;
  korisnik: Korisnik;
  opis: string;
  ljubimac: Ljubimac;
  tipUsluge: TipUsluge;
  terminCuvanja: string;
  naknada: string;
};


export default function Home() {

  const [ads, setAds] = useState<Ad[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch("/api/oglas");

        if (!res.ok) {
          throw new Error("Greška pri učitavanju oglasa");
        }

        const data = await res.json();
        setAds(data);
      } catch (err) {
        setError("Ne mogu da učitam oglase");
      }
    };

    fetchAds();
  }, []);

  if (error) return <p>{error}</p>;
  if (ads.length === 0) return <p>Učitavanje...</p>;

  
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

