"use client";

import { use, useEffect, useState } from "react";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { useAuth } from "@/app/components/AuthProvider";

type Props = {
  params: Promise<{ id: string }>;
};

export default function IzmenaOglasaPage({ params }: Props) {
  const { id } = use(params);

  const [ljubimci, setLjubimci] = useState<any[]>([]);
  const [tipovi, setTipovi] = useState<any[]>([]);
  const [error, setError] = useState("");
  const { user } = useAuth();
  

  const [form, setForm] = useState({
    opis: "",
    terminCuvanja: "",
    naknada: "",
    idLjubimac: "",
    idTipUsluge: "",
  });

  // Učitavanje postojećeg oglasa
  useEffect(() => {
    async function fetchOglas() {
      const res = await fetch(`/api/oglas/${id}`);
      const data = await res.json();

      if (res.ok) {
        setForm({
          opis: data.opis || "",
          terminCuvanja: data.terminCuvanja?.slice(0, 10) || "",
          naknada: data.naknada?.toString() || "",
          idLjubimac: data.idLjubimac || "",
          idTipUsluge: data.idTipUsluge || "",
        });
      }
    }

    fetchOglas();
  }, [id]);

  // Učitavanje ljubimaca i tipova
  useEffect(() => {
  if (!user?.id) return;

  fetch(`/api/ljubimac/korisnik/${user.id}`)
    .then((res) => res.json())
    .then((data) => setLjubimci(data));
}, [user]);

    useEffect(() => {
    fetch("/api/tipUsluge")
      .then(res => res.json())
      .then(data => setTipovi(data));
  }, []);

  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/api/oglas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        naknada: Number(form.naknada),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Uspesno izmenjen oglas!");
      window.location.href = `/profile/${user?.id}`;
    } else {
      setError("Greska pri izmeni oglasa!");
    }
  }

  return (
    <main style={{ maxWidth: 400, padding: 20 }}>
      <div
        style={{
          backgroundColor: "#fafafa",
          border: "1px solid #ccc",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h2>Izmena oglasa</h2>

        <form onSubmit={handleSubmit}>
          <Input
            label="Opis"
            value={form.opis}
            onChange={(e) =>
              setForm({ ...form, opis: e.target.value })
            }
          />

          <label>Datum</label>
          <input
            type="date"
            value={form.terminCuvanja}
            onChange={(e) =>
              setForm({
                ...form,
                terminCuvanja: e.target.value,
              })
            }
          />

          <label>Novčana naknada</label>
          <input
            type="number"
            value={form.naknada}
            onChange={(e) =>
              setForm({
                ...form,
                naknada: e.target.value,
              })
            }
          />

          <select
            value={form.idLjubimac}
            onChange={(e) =>
              setForm({
                ...form,
                idLjubimac: e.target.value,
              })
            }
          >
            <option value="">Izaberi ljubimca</option>
            {ljubimci.map((l) => (
              <option key={l.id} value={l.id}>
                {l.ime}
              </option>
            ))}
          </select>

          <select
            value={form.idTipUsluge}
            onChange={(e) =>
              setForm({
                ...form,
                idTipUsluge: e.target.value,
              })
            }
          >
            <option value="">Izaberi uslugu</option>
            {tipovi.map((t) => (
              <option key={t.id} value={t.id}>
                {t.ime}
              </option>
            ))}
          </select>

          {error && (
            <p style={{ color: "red" }}>{error}</p>
          )}

          <Button text="Sačuvaj izmene" type="submit" />
        </form>
      </div>
    </main>
  );
}
