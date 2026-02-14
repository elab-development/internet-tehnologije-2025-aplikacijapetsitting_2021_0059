"use client";

import AdCard from "@/app/components/AdCard";
import { useAuth } from "@/app/components/AuthProvider";
import Button from "@/app/components/Button";
import Link from "next/link";
import { useEffect, useState } from "react";

  type User = {
    id: string;
    ime: string;
    prezime: string;
    email: string;
    datumRodjenja: string;
    grad: string;
    opstina: string;
    brojTelefona: string;
  }

type Props = {
  params: Promise<{ id: string }>;
};

export default function ProfilePage({ params }: Props) {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { user: loggedUser } = useAuth();
  const [pets, setLjubimci] = useState<any[]>([]);
  const [ads, setOglasi] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUser() {
      const { id } = await params;

      const res = await fetch("/api/korisnik/" + id);
      if (!res.ok) {
        setError("Greška pri učitavanju profila");
        return;
      }

      const data = await res.json();
      setUser(data);
      if (data.uloga === "Vlasnik") {
        const petsRes = await fetch(`/api/ljubimac/korisnik/${data.id}`);
        const petsData = await petsRes.json();
        setLjubimci(petsData);

        const adsRes = await fetch(`/api/oglas/korisnik/${data.id}`);
        const adsData = await adsRes.json();
        setOglasi(adsData);
      }
    }

    fetchUser();
  }, [params]);
  
async function handleDeletePet(id: string) {
  await fetch(`/api/ljubimac/${id}`, { method: "DELETE" });
  setLjubimci(prev => prev.filter(p => p.id !== id));
}

async function handleDeleteAd(id: string) {
  await fetch(`/api/oglas/${id}`, { method: "DELETE" });
  setOglasi(prev => prev.filter(o => o.id !== id));
}


  if (error) return <p>{error}</p>;
  if (!user) return <p>Učitavanje...</p>;


  return (
    <main style={{  padding: "20px" }}> 
      <div style={{ padding: 20, marginBottom:30, backgroundColor: "#fafafa", border: "1px solid #ccc", borderRadius:"8px"}}>
      {loggedUser && loggedUser.id === user.id && (
        <h1>Moj profil</h1>
      )}
      {loggedUser && loggedUser.id != user.id && (
        <h1>Profil korisnika</h1>
      )}

      <p><strong>Ime:</strong> {user.ime} {user.prezime}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Datum rođenja:</strong> {user.datumRodjenja}</p>
      <p><strong>Grad:</strong> {user.grad} {"(" + user.opstina + ")"}</p>
      <p><strong>Broj telefona:</strong> {user.brojTelefona}</p>

      {loggedUser && loggedUser.id === user.id && (
        <Link href="/profil/izmena">
          <Button text="Izmeni profil" />
        </Link>
      )}
      {user.uloga === "Vlasnik" && (
        <>
        {loggedUser?.id === user.id && (
          <Link href="/ljubimac/dodaj">
            <Button text="Dodaj ljubimca"/>
          </Link>
        )}
        {loggedUser?.id === user.id && (
          <Link href="/oglas">
            <Button text="Dodaj oglas" />
          </Link>
         )}
        </>
      )}

      </div>
      {user.uloga === "Vlasnik" && (
        <div
          style={{
            padding: 20,
            backgroundColor: "#fafafa",
            border: "1px solid #ddd",
            borderRadius: "10px",
            marginBottom: "30px"
          }}
        >
        <h2>Ljubimci</h2>

        {pets.length === 0 && <p>Nema dodatih ljubimaca.</p>}
        {pets?.map((pet) => (
          <div key={pet.id} style={{ padding: 20, marginTop:10, backgroundColor: "#fafafa", border: "1px solid #ccc", borderRadius:"8px"}}>
            <p>Ime: {pet.ime}</p>
            <p>Vrsta: {pet.tip}</p>
            <p>Datum rođenja: {pet.datumRodjenja}</p>
            <p>Alergije: {pet.alergije}</p>
            <p>Lekovi: {pet.lekovi}</p>
            <p>Ishrana: {pet.ishrana}</p>

            {loggedUser?.id === user.id && (
             <>
              <Link href={`/ljubimac/izmena/${pet.id}`}>
                <Button text="Izmeni" />
              </Link>

              <Button
                text="Obriši"
                onClick={() => handleDeletePet(pet.id)}
              />
            </>
          )}
          </div>
        ))}
       </div>
      )}

{user.uloga === "Vlasnik" && (
      <div
        style={{
          padding: 20,
          backgroundColor: "#fafafa",
          border: "1px solid #ddd",
          borderRadius: "10px"
        }}
      >
    <h2>Istorija oglasa</h2>
    {ads.length === 0 && <p>Nema oglasa.</p>}
    {ads.map((ad) => (
      <div key={ad.id} style={{padding:20, marginTop:10, border: "1px solid #ddd", borderRadius: "10px"}}>
        <AdCard key={ad.id}  korisnik={user} opis={ad.opis} ljubimac={ad.ljubimac} tipUsluge={ad.tipUsluge} terminCuvanja={ad.terminCuvanja} naknada={ad.naknada}/> 

        {loggedUser?.id === user.id && (
          <>
            <Link href={`/oglas/izmena/${ad.id}`}>
              <Button text="Izmeni"/>
            </Link>

            <Button
              text="Obriši"
              onClick={() => handleDeleteAd(ad.id)}
            />
          </>
        )}
      </div>
    ))}
    </div>
)}


    </main>
    
  );
}