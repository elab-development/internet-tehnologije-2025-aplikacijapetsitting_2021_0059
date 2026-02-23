"use client";

import { use, useEffect, useState } from "react";
import Button from "@/app/components/Button";
import AdCard from "@/app/components/AdCard";
import Link from "next/link";

export default function PrijavePage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = use(params);
  const [prijave, setPrijave] = useState<any[]>([]);
  const [oglas, setOglas] = useState<any | null>(null);

    const naCekanju = prijave.filter(p => p.status === "Na čekanju");
    const odbijene = prijave.filter(p => p.status === "Odbijeno");
    const odobrene = prijave.filter(p => p.status === "Odobreno");

  useEffect(() => {
    fetch(`/api/prijava?oglasId=${id}`)
      .then(res => res.json())
      .then(data => setPrijave(data));

    fetch(`/api/oglas/${id}`)
      .then(res => res.json())
      .then(data => setOglas(data));
  }, [id]);

  async function updateStatus(prijavaId: string, status: string) {
    await fetch("/api/prijava", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prijavaId, status }),
    });

    const res = await fetch(`/api/prijava?oglasId=${id}`);
    const data = await res.json();
    setPrijave(data);
  }


  return (
    <main style={{ padding: 20 }}>
      <h1>Prijave za oglas</h1>
      {oglas?.korisnik && oglas?.ljubimac && oglas?.tipUsluge && (
        <div style={{ marginTop: 10, marginBottom: 20 }}>
          <AdCard
            korisnik={oglas.korisnik}
            opis={oglas.opis}
            ljubimac={oglas.ljubimac}
            tipUsluge={oglas.tipUsluge}
            terminCuvanja={oglas.terminCuvanja}
            naknada={oglas.naknada}
          />
        </div>
      )}

      {prijave.length === 0 && <p>Nema prijava.</p>}

      {naCekanju.length > 0 && (
        <>
          <h2 style={{marginTop:30}}>Na čekanju</h2>

          {naCekanju.map(p => (
            <div key={p.id} style={{padding: 20, marginTop: 15, border: "1px solid #ddd", borderRadius: 10, backgroundColor: "#fafafa"}}>
              {p.sitter?.id ? (
                <Link href={`/profile/${p.sitter.id}`}>
                  <b>{p.sitter?.ime} {p.sitter?.prezime}</b>
                </Link>
              ) : (
                <b>{p.sitter?.ime} {p.sitter?.prezime}</b>
              )}

              <div style={{marginTop:10}}>
                <Button
                  text="Odobri"
                  onClick={() => updateStatus(p.id, "Odobreno")}
                />
                <Button
                  text="Odbij"
                  onClick={() => updateStatus(p.id, "Odbijeno")}
                />
              </div>
            </div>
          ))}
        </>
      )}

      {odbijene.length > 0 && (
        <>
          <h2 style={{marginTop:30}}>Odbijene</h2>

          {odbijene.map(p => (
            <div key={p.id} style={{padding: 20, marginTop: 15, border: "1px solid #ddd", borderRadius: 10, backgroundColor: "#fafafa"}}>
              {p.sitter?.id ? (
                <Link href={`/profile/${p.sitter.id}`}>
                  <b>{p.sitter?.ime} {p.sitter?.prezime}</b>
                </Link>
              ) : (
                <b>{p.sitter?.ime} {p.sitter?.prezime}</b>
              )}

              <div style={{marginTop:10}}>
                <Button
                  text="Vrati na čekanje"
                  onClick={() => updateStatus(p.id, "Na čekanju")}
                />
              </div>
            </div>
          ))}
        </>
      )}

      {odobrene.length > 0 && (
        <>
          <h2 style={{marginTop:30, color:"green"}}>Odobreno</h2>

          {odobrene.map(p => (
            <div key={p.id} style={{padding: 20, marginTop: 15,  borderRadius: 10, backgroundColor: "#fafafa",border:"2px solid green"}}>
              {p.sitter?.id ? (
                <Link href={`/profile/${p.sitter.id}`}>
                  <b>{p.sitter?.ime} {p.sitter?.prezime}</b>
                </Link>
              ) : (
                <b>{p.sitter?.ime} {p.sitter?.prezime}</b>
              )}
              <p style={{color:"green", marginTop:10}}>✔ Sitter je prihvaćen</p>
            </div>
          ))}
        </>
      )}
    </main>
  );
}
