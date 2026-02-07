"use client";

import { useEffect, useState } from "react";

  type User = {
    id: string;
    ime: string;
    prezime: string;
    email: string;
   // datumRodjenja: string;
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
    }

    fetchUser();
  }, [params]);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Učitavanje...</p>;


  return (
    <main style={{ padding: "20px" }}>
      <h1>Profil korisnika</h1>

      <p><strong>Ime:</strong> {user.ime}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <p><strong>Grad i opština:</strong> {user.grad} {"(" + user.opstina + ")"}</p>
      <p><strong>Broj telefona:</strong> {user.brojTelefona}</p>
    </main>
  );
}