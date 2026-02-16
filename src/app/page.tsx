"use client"

import { useEffect, useState } from "react";
import AdCard, { Korisnik, Ljubimac, TipUsluge } from "./components/AdCard";
import Button from "./components/Button";
import Link from "next/link";
import { useAuth } from "./components/AuthProvider";


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
  const [sort, setSort] = useState("");
  const { user, } = useAuth();


  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch(`/api/oglas?sort=${sort}`);

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
  }, [sort]);

  if (error) return <p>{error}</p>;
  if (ads.length === 0) return <p>Učitavanje...</p>;

  
   return (
    <main style={{ padding: "20px" }}>
        {user?.uloga === "Vlasnik" && (
          <Link href="/oglas">
            <Button text={"Dodaj oglas"}/>
          </Link>
          )}
          
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{marginTop:10}}
          >
          <option value="novo">Najnoviji</option>
          <option value="staro">Najstariji</option>
          <option value="cena_desc">Najveća naknada</option>
          <option value="cena_asc">Najmanja naknada</option>
          <option value="datum_asc">Najskoriji datum</option>
          <option value="datum_desc">Najdalji datum</option>
        </select>
      
     
        {ads.map((ad) => (
          <div
            key={ad.id}
            style={{
              backgroundColor:"#fafafa" ,
              border: "1px solid #ccc",
              borderRadius:12,
              padding: "12px",
              marginBottom: "10px",
              marginTop: "10px"
            }}
          >
            
             <AdCard  key={ad.id} korisnik={ad.korisnik} opis={ad.opis} ljubimac={ad.ljubimac} tipUsluge={ad.tipUsluge} terminCuvanja={ad.terminCuvanja} naknada={ad.naknada}/>
             {user?.uloga === "Sitter" && (
              <Link href="">
                <Button text={"Prijavi se"}/>
              </Link>
              )}
          </div>
        ))}
     
    </main>
  );
}

