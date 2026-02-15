"use client";

import { useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";

export default function DodajLjubimcaPage() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    tip: "",
    ime: "",
    datumRodjenja: "",
    alergije: "",
    lekovi: "",
    ishrana: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/ljubimac", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Ljubimac uspešno dodat");
      window.location.href = `/profile/${user?.id}`;
    } else {
      alert(data.message);
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
        <h2>Dodavanje ljubimca</h2>

        <form onSubmit={handleSubmit}>
            <select
            value={form.tip}
            onChange={(e) =>
                setForm({ ...form, tip: e.target.value })
            }
            >
            <option value="">Izaberi vrstu</option>
            <option value="Pas">Pas</option>
            <option value="Mačka">Mačka</option>
            <option value="Ptica">Ptica</option>
            <option value="Hrčak">Hrčak</option>
            <option value="Zec">Zec</option>
            </select>

          <Input
            label="Ime"
            value={form.ime}
            onChange={(e) =>
              setForm({ ...form, ime: e.target.value })
            }
          />

          <label>Datum rođenja</label>
          <input
            type="date"
            value={form.datumRodjenja}
            onChange={(e) =>
              setForm({
                ...form,
                datumRodjenja: e.target.value,
              })
            }
          />

          <Input
            label="Alergije"
            value={form.alergije}
            onChange={(e) =>
              setForm({
                ...form,
                alergije: e.target.value,
              })
            }
          />

          <Input
            label="Lekovi"
            value={form.lekovi}
            onChange={(e) =>
              setForm({
                ...form,
                lekovi: e.target.value,
              })
            }
          />

          <Input
            label="Ishrana"
            value={form.ishrana}
            onChange={(e) =>
              setForm({
                ...form,
                ishrana: e.target.value,
              })
            }
          />

          <Button text="Dodaj ljubimca" type="submit" />
        </form>
      </div>
    </main>
  );
}
