"use client";
import { useState } from "react";

export default function EditProfilPage() {
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [brojTelefona, setBrojTelefona] = useState("");
  const [grad, setGrad] = useState("");
  const [opstina, setOpstina] = useState("");
  const [datumRodjenja, setDatumRodjenja] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/profil", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ime,
        prezime,
        brojTelefona,
        grad,
        opstina,
        datumRodjenja,
      }),
    });

    if (res.ok) {
      alert("Profil uspešno ažuriran");
    } else {
      alert("Greška pri izmeni profila");
    }
  }

  return (
    <main style={{ padding: 20, maxWidth: 400 }}>
      <h1>Izmena profila</h1>

      <form onSubmit={handleSubmit}>
        <input placeholder="Ime" value={ime} onChange={e => setIme(e.target.value)} />
        <input placeholder="Prezime" value={prezime} onChange={e => setPrezime(e.target.value)} />
        <input placeholder="Broj telefona" value={brojTelefona} onChange={e => setBrojTelefona(e.target.value)} />
        <input placeholder="Grad" value={grad} onChange={e => setGrad(e.target.value)} />
        <input placeholder="Opština" value={opstina} onChange={e => setOpstina(e.target.value)} />

        <input
          type="date"
          value={datumRodjenja}
          onChange={e => setDatumRodjenja(e.target.value)}
        />

        <button type="submit">Sačuvaj izmene</button>
      </form>
    </main>
  );
}