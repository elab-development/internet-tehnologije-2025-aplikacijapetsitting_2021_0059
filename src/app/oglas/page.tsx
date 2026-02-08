"use client";

import { useEffect, useState } from "react";

export default function NoviOglasPage() {
    const [ljubimci, setLjubimci] = useState<any[]>([]);
const [tipovi, setTipovi] = useState<any[]>([]);

useEffect(() => {
    fetch("/api/ljubimac")
      .then((res) => res.json())
      .then((data) => setLjubimci(data));
  }, []);

useEffect(() => {
  fetch("/api/tipUsluge")
      .then((res) => res.json())
      .then((data) => setTipovi(data));
  }, []);


  const [form, setForm] = useState({
    opis: "",
    terminCuvanja: "",
    naknada: 0,
 
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
    } else {
      alert("Greška");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Opis"
        value={form.opis}
        onChange={(e) => setForm({ ...form, opis: e.target.value })}
      />

      <input
        type="date"
        value={form.terminCuvanja}
        onChange={(e) =>
          setForm({ ...form, terminCuvanja: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Naknada"
        value={form.naknada}
        onChange={(e) => setForm({ ...form, naknada: Number(e.target.value)  })}
      />


      <select
  value={form.idLjubimac}
  onChange={(e) =>
    setForm({ ...form, idLjubimac: e.target.value })
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
    setForm({ ...form, idTipUsluge: e.target.value })
  }
>
  <option value="">Izaberi uslugu</option>
  {tipovi.map((t) => (
    <option key={t.id} value={t.id}>
      {t.ime}
    </option>
  ))}
</select>

      <button type="submit">Dodaj oglas</button>
    </form>
  );
}
