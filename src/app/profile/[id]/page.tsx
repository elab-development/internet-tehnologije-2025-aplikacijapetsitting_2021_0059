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


export default function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/korisnik/${params.id}`);

        if (!res.ok) {
          throw new Error("Korisnik nije pronađen");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError("Greška pri učitavanju profila");
      }
    }

    fetchUser();
  }, [params.id]);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Učitavanje...</p>;

  return (
    <main style={{ padding: "20px" }}>
      <h1>Profil korisnika</h1>

      <p><strong>Ime:</strong> {user.ime}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <p><strong>Grad i opština:</strong> {user.grad} {user.opstina}</p>
      <p><strong>Broj telefona:</strong> {user.brojTelefona}</p>
    </main>
  );
}