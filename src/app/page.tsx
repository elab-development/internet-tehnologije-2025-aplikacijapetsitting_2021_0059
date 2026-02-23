"use client"

import { useEffect, useMemo, useState } from "react";
import AdCard, { Korisnik, Ljubimac, TipUsluge } from "./components/AdCard";
import Button from "./components/Button";
import Link from "next/link";
import { useAuth } from "./components/AuthProvider";
import AdFilters from "./components/AdFilters";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("");

  const [opisFilter, setOpisFilter] = useState("");
  const [tipUslugeFilter, setTipUslugeFilter] = useState("");
  const [tipLjubimcaFilter, setTipLjubimcaFilter] = useState("");
  const [gradFilter, setGradFilter] = useState("");
  const [minNaknada, setMinNaknada] = useState("");
  const [maxNaknada, setMaxNaknada] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch(`/api/oglas?sort=${sort}`);

        if (!res.ok) {
          throw new Error("Greska pri ucitavanju oglasa");
        }

        const data = await res.json();
        setAds(data);
      } catch {
        setError("Ne mogu da ucitam oglase");
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [sort]);

  const tipoviUsluge = useMemo(
    () =>
      Array.from(
        new Set(ads.map((ad) => ad.tipUsluge?.ime).filter((value): value is string => Boolean(value)))
      ).sort((a, b) => a.localeCompare(b)),
    [ads]
  );

  const tipoviLjubimaca = useMemo(
    () =>
      Array.from(
        new Set(ads.map((ad) => ad.ljubimac?.tip).filter((value): value is string => Boolean(value)))
      ).sort((a, b) => a.localeCompare(b)),
    [ads]
  );

  const gradovi = useMemo(
    () =>
      Array.from(
        new Set(ads.map((ad) => ad.korisnik?.grad).filter((value): value is string => Boolean(value)))
      ).sort((a, b) => a.localeCompare(b)),
    [ads]
  );

  const filtriraniOglasi = useMemo(() => {
    return ads.filter((ad) => {
      const opisValue = ad.opis?.toLowerCase() ?? "";
      const trazeniOpis = opisFilter.toLowerCase();
      const naknadaValue = Number(ad.naknada);
      const minValue = minNaknada === "" ? null : Number(minNaknada);
      const maxValue = maxNaknada === "" ? null : Number(maxNaknada);

      const prolaziOpis = !opisFilter || opisValue.includes(trazeniOpis);
      const prolaziTipUsluge = !tipUslugeFilter || ad.tipUsluge?.ime === tipUslugeFilter;
      const prolaziTipLjubimca = !tipLjubimcaFilter || ad.ljubimac?.tip === tipLjubimcaFilter;
      const prolaziGrad = !gradFilter || ad.korisnik?.grad === gradFilter;
      const prolaziMin = minValue === null || naknadaValue >= minValue;
      const prolaziMax = maxValue === null || naknadaValue <= maxValue;

      return prolaziOpis && prolaziTipUsluge && prolaziTipLjubimca && prolaziGrad && prolaziMin && prolaziMax;
    });
  }, [ads, opisFilter, tipUslugeFilter, tipLjubimcaFilter, gradFilter, minNaknada, maxNaknada]);

  async function handlePrijava(id: string) {
    const res = await fetch("/api/prijava", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idOglas: id }),
    });

    const data = await res.json();
    alert(data.message);
  }

  function resetujFiltere() {
    setOpisFilter("");
    setTipUslugeFilter("");
    setTipLjubimcaFilter("");
    setGradFilter("");
    setMinNaknada("");
    setMaxNaknada("");
    setSort("");
  }

  if (error) return <p>{error}</p>;
  if (loading) return <p>Ucitavanje...</p>;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 84,
          left: "max(12px, calc((100vw - 900px) / 2 - 276px))",
          width: 260,
          zIndex: 20,
        }}
      >
        <AdFilters
          opis={opisFilter}
          onOpisChange={setOpisFilter}
          tipUsluge={tipUslugeFilter}
          onTipUslugeChange={setTipUslugeFilter}
          tipLjubimca={tipLjubimcaFilter}
          onTipLjubimcaChange={setTipLjubimcaFilter}
          grad={gradFilter}
          onGradChange={setGradFilter}
          minNaknada={minNaknada}
          onMinNaknadaChange={setMinNaknada}
          maxNaknada={maxNaknada}
          onMaxNaknadaChange={setMaxNaknada}
          tipoviUsluge={tipoviUsluge}
          tipoviLjubimaca={tipoviLjubimaca}
          gradovi={gradovi}
          onReset={resetujFiltere}
        />
      </div>

      <main style={{ padding: "20px" }}>
        <section style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
            {user?.uloga === "Vlasnik" && (
              <Link href="/oglas">
                <Button text={"Dodaj oglas"} />
              </Link>
            )}

            <div style={{display: "flex", flexDirection: "column" as const, gap: 4, marginBottom: 10, maxWidth: 260,}}>
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={{width: "100%", padding: "7px 10px", borderRadius: 7, border: "1px solid #d1d5db", backgroundColor: "#fff", fontSize: 13, outline: "none",}}>
                <option value="novo">Najnoviji</option>
                <option value="staro">Najstariji</option>
                <option value="cena_desc">Najveca naknada</option>
                <option value="cena_asc">Najmanja naknada</option>
                <option value="datum_asc">Najskoriji datum</option>
                <option value="datum_desc">Najdalji datum</option>
              </select>
            </div>
          </div>

          {filtriraniOglasi.length === 0 && <p style={{ marginTop: 10 }}>Nema oglasa za izabrane filtere.</p>}

          {filtriraniOglasi.map((ad) => (
            <div
              key={ad.id}
              style={{
                backgroundColor: "#fafafa",
                border: "1px solid #ccc",
                borderRadius: 12,
                padding: "12px",
                marginBottom: "10px",
                marginTop: "10px",
              }}
            >
              <AdCard
                key={ad.id}
                korisnik={ad.korisnik}
                opis={ad.opis}
                ljubimac={ad.ljubimac}
                tipUsluge={ad.tipUsluge}
                terminCuvanja={ad.terminCuvanja}
                naknada={ad.naknada}
              />
              {user?.uloga === "Sitter" && <Button onClick={() => handlePrijava(ad.id)} text={"Prijavi se"} />}
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
