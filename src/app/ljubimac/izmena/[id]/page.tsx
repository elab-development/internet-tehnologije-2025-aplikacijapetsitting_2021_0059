"use client";
import { useAuth } from "@/app/components/AuthProvider";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { korisnik } from "@/db/schema";
import Link from "next/link";
import { use, useEffect, useState } from "react";

type Props = {
  params: Promise<{ id: string }>;
};


export default function EditLjubimacPage({ params }: Props) {
  const [tip, setTip] = useState("");
  const [ime, setIme] = useState("");
  const [datumRodjenja, setDatumRodjenja] = useState("");
  const [alergije, setAlergije] = useState("");
  const [lekovi, setLekovi] = useState("");
  const [ishrana, setIshrana] = useState("");

   const { user } = useAuth();
   const { id } = use(params);

   
  useEffect(() => {
    async function fetchPet() { 
        const res = await fetch(`/api/ljubimac/${id}`);
        const data = await res.json();

        if (data.length > 0) {
          const pet = data[0];
        }
        if (data) {
          setTip(data.tip || "");
          setIme(data.ime || "");
          setDatumRodjenja(data.datumRodjenja?.slice(0, 10) || "");
          setAlergije(data.alergije || "");
          setLekovi(data.lekovi || "");
          setIshrana(data.ishrana || "");
        }
    }

    fetchPet();
  }, [id]);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    

     const res = await fetch(`/api/ljubimac/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
            tip,
            ime,
            datumRodjenja,
            alergije,
            lekovi,
            ishrana,
        }
      ),
    });

   if (res.ok) {
      alert("Ljubimac uspešno ažuriran");
      window.location.href = `/profile/${user?.id}`;
    } else {
      alert("Greška pri izmeni ljubimca");
    }
  }
   

  return (
    <main style={{ maxWidth: 400 }}>
      <div style={{ padding: 20, backgroundColor: "#fafafa",maxWidth: 400, border: "1px solid #ccc",borderRadius:"8px" }}>
      <h1>Izmena ljubimca</h1>
      <form onSubmit={handleSubmit}>
        <select
        style={{marginBottom:15}}
          value={tip}
          onChange={(e) =>setTip(e.target.value)          }
        >
          <option value="">Izaberi vrstu</option>
          <option value="Pas">Pas</option>
          <option value="Mačka">Mačka</option>
          <option value="Ptica">Ptica</option>
          <option value="Hrčak">Hrčak</option>
          <option value="Zec">Zec</option>
           <option value="Ostalo">Ostalo</option>
        </select>
        <Input label={"Ime"} value={ime} onChange={e => setIme(e.target.value)}/>
         <label >Datum rođenja</label>
        <input
          type="date"
          value={datumRodjenja}
          onChange={e => setDatumRodjenja(e.target.value)}
        />
        <Input label={"Alergije"} value={alergije} onChange={e => setAlergije(e.target.value)}/>
         <Input label={"Lekovi"} value={lekovi} onChange={e => setLekovi(e.target.value)}/>
          <Input label={"Ishrana"} value={ishrana} onChange={e => setIshrana(e.target.value)}/>

       
          <Button text="Sačuvaj izmene"/>
        
      </form>
      </div>
    </main>
  );
}