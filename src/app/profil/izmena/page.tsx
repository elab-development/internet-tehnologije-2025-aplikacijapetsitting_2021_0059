"use client";
import { useAuth } from "@/app/components/AuthProvider";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { korisnik } from "@/db/schema";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EditProfilPage() {
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [brojTelefona, setBrojTelefona] = useState("");
  const [grad, setGrad] = useState("");
  const [opstina, setOpstina] = useState("");
  const [datumRodjenja, setDatumRodjenja] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`/api/korisnik/${user?.id}`);
      const data = await res.json();

      if (data) {
        setIme(data.ime || "");
        setPrezime(data.prezime || "");
        setBrojTelefona(data.brojTelefona || "");
        setGrad(data.grad || "");
        setOpstina(data.opstina || "");
        setDatumRodjenja(data.datumRodjenja?.slice(0, 10) || "");
      }
    }

    if (user?.id) {
      fetchUser();
    }
  }, [user]);


  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    

    const res = await fetch(`/api/korisnik/${user?.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ime,
        prezime,
        brojTelefona,
        datumRodjenja,
        grad,
        opstina,
      }),
    });

    if (res.ok) {
      alert("Profil uspešno ažuriran");
      window.location.href = `/profile/${user?.id}`;
    } else {
      alert("Greška pri izmeni profila");
    }
  }

  return (
    <main style={{ maxWidth: 400 }}>
      <div style={{ padding: 20, backgroundColor: "#fafafa",maxWidth: 400, border: "1px solid #ccc",borderRadius:"8px" }}>
      <h1>Izmena profila</h1>

      <form onSubmit={handleSubmit}>
        <Input label={"Ime"} value={ime} onChange={e => setIme(e.target.value)}/>
        <Input label={"Prezime"} value={prezime} onChange={e => setPrezime(e.target.value)}/>
        <Input label={"Broj telefona"} value={brojTelefona} onChange={e => setBrojTelefona(e.target.value)}/>
         <Input label={"Grad"} value={grad} onChange={e => setGrad(e.target.value)}/>
          <Input label={"Opstina"} value={opstina} onChange={e => setOpstina(e.target.value)}/>

        <label >Datum rođenja</label>
        <input
          type="date"
          value={datumRodjenja}
          onChange={e => setDatumRodjenja(e.target.value)}
        />
        
          <Button text="Sačuvaj izmene"/>
        
      </form>
      </div>
    </main>
  );
}