"use client";

import { useEffect, useState } from "react";
import Button from "../components/Button";
import { view } from "drizzle-orm/sqlite-core";
import { useAuth } from "../components/AuthProvider";



export default function NoviOglasPage() {
  const [ljubimci, setLjubimci] = useState<any[]>([]);
  const [tipovi, setTipovi] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
  if (!user?.id) return;

  fetch(`/api/ljubimac/korisnik/${user.id}`)
    .then((res) => res.json())
    .then((data) => setLjubimci(data));
}, [user]);

  useEffect(() => {
    fetch("/api/tipUsluge")
        .then((res) => res.json())
        .then((data) => setTipovi(data));
    }, []);


  const [form, setForm] = useState({
    opis: "",
    terminCuvanja: "",
    naknada: "",
    idLjubimac: "",
    idTipUsluge: "",
  });

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    console.log("FORMA KOJA SE ŠALJE:", form);
    const res = await fetch("/api/oglas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Oglas dodat");
      window.location.href = "/";
    } else {
      alert("Greška");
    }
   }

  return (
    <main style={{ padding: 20, maxWidth: 400 }}>
    <div style={{
              backgroundColor:"#fafafa" ,
              border: "1px solid #ccc",
              borderRadius:12,
              padding: "12px",
              marginBottom: "10px",
              marginTop: "10px"
            }}>
    <form onSubmit={handleSubmit} >
      <h2>Dodavanje oglasa</h2>
      <label>Opis</label>
      <textarea
        value={form.opis}
        rows={6}
        placeholder="Unesite opis oglasa..."
        style={{
          width: "100%",
          height: 80,
          resize: "vertical",
          padding: 8,
          marginTop: 4,
          marginBottom: 12,
          border: "1px solid #ccc",
          borderRadius: 4,
          overflowY: "auto",
        }}
        onChange={(e) => setForm({ ...form, opis: e.target.value })}
      />
<label htmlFor="">Datum</label>
<input
  type="date"
  value={form.terminCuvanja}
  onChange={(e) =>
    setForm({ ...form, terminCuvanja: e.target.value })
  }
/>      
      <label>Novčana naknada</label>
      <input
        type="number"
        placeholder="Naknada"
        value={form.naknada}
        onChange={(e) => setForm({ ...form, naknada: e.target.value })}
      />

      <select
      value={form.idLjubimac}
      onChange={(e) => setForm({ ...form, idLjubimac: e.target.value })}
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
        onChange={(e) => setForm({ ...form, idTipUsluge: e.target.value })}
      >
      <option value="">Izaberi uslugu</option>
      {tipovi.map((t) => (
        <option key={t.id} value={t.id}>
          {t.ime}
        </option>
      ))}
      </select>
        <Button text="Dodaj oglas" type="submit"/>
      </form>
      </div>
      </main>
       );
       
}
