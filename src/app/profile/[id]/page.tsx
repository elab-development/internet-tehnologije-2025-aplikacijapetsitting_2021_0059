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
  const [applications, setApplications] = useState<any[]>([]);
  const [filter, setFilter] = useState("Sve");
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [prikaz, setPrikaz] = useState<"svi" | "odobreni" | "neodobreni">("svi");

  const prikazaniOglasi = Array.isArray(ads)
  ? ads.filter(ad => {
      if (prikaz === "odobreni") return ad.imaOdobrenog;
      if (prikaz === "neodobreni") return !ad.imaOdobrenog;
      return true;
    })
  : [];

  function getApplicationStatusStyle(status: string) {
    if (status === "Odobreno") {
      return {
        color: "#166534",
        backgroundColor: "#dcfce7",
        borderColor: "#86efac",
      };
    }

    if (status === "Odbijeno") {
      return {
        color: "#991b1b",
        backgroundColor: "#fee2e2",
        borderColor: "#fca5a5",
      };
    }

    return {
      color: "#92400e",
      backgroundColor: "#fef3c7",
      borderColor: "#fcd34d",
    };
  }

  function getActiveFilterButtonStyle(isActive: boolean) {
    return {
      backgroundColor: isActive ? "#e5e7eb" : "#fafafa",
      border: isActive ? "1px solid #9ca3af" : "1px solid #ccc",
      color: "#111827",
      fontWeight: isActive ? 600 : 400,
    };
  }


  useEffect(() => {
    async function fetchUser() {
      const { id } = await params;

      const res = await fetch(`/api/korisnik/${id}`);
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

        const adsRes = await fetch(`/api/oglas/korisnik/${data.id}?korisnikId=${data.id}`);
        const adsData = await adsRes.json();
        setOglasi(adsData);

        const pendingRes = await fetch(`/api/prijava/cekanje/${data.id}`);
        const pendingData = await pendingRes.json();
        setPendingApplications(pendingData);

      }
      if (data.uloga === "Sitter") {
        const appRes = await fetch(`/api/prijava?korisnikId=${data.id}`);
        const appData = await appRes.json();
        setApplications(appData);
      }
    }



    fetchUser();
  }, [params]);
  

  
async function handleDeletePet(id: string) {
  const potvrda = window.confirm(
    "Da li ste sigurni da želite da obrišete ljubimca?"
  );

  if (!potvrda) return; 

  await fetch(`/api/ljubimac/${id}`, { method: "DELETE" });
  setLjubimci(prev => prev.filter(p => p.id !== id));
  
}

async function handleDeleteAd(id: string) {
  const potvrda = window.confirm(
    "Da li ste sigurni da želite da obrišete oglas?"
  );

  if (!potvrda) return; 
  await fetch(`/api/oglas/${id}`, { method: "DELETE" });
  setOglasi(prev => prev.filter(o => o.id !== id));
}

async function handleDeletePrijava(id: string) {
  const potvrda = window.confirm(
    "Da li ste sigurni da želite da opozovete prijavu?"
  );

  if (!potvrda) return;

  await fetch(`/api/prijava?id=${id}`, {
    method: "DELETE",
  });

  setApplications(prev => prev.filter(p => p.id !== id));
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
      {user.uloga == "Vlasnik" && pendingApplications.length > 0 &&(
      <div style={{
          padding: 20,
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeeba",
          borderRadius: 10,
          marginBottom: 20
        }}>
          <h2>🔔 Nove prijave ({pendingApplications.length})</h2>

          {pendingApplications.map((app) => (
            <div key={app.id} style={{ marginBottom: 10 }}>
              <p>
                <strong>{app.sitter.ime} {app.sitter.prezime}</strong> se prijavio na oglas za {app.ljubimac.ime}
              </p>

                  <Link href={`/oglas/${app.oglas.id}/prijave`}>
                    <Button text="Pregledaj i odluči" />
                  </Link>
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
    <div style={{ marginBottom: 20 }}>

  <button onClick={() => setPrikaz("svi")} style={{marginTop:10, marginLeft: 10, marginRight:"10px", paddingInline:10, paddingBlock:3, borderRadius:"8px", ...getActiveFilterButtonStyle(prikaz === "svi")}}>
    Svi oglasi
  </button>

{loggedUser?.id === user.id &&(
  <button onClick={() => setPrikaz("odobreni")} style={{ marginLeft: 10, marginRight:"10px", paddingInline:10, paddingBlock:3, borderRadius:"8px", ...getActiveFilterButtonStyle(prikaz === "odobreni")}}>
    Samo odobreni
  </button>
)}
{loggedUser?.id === user.id &&(
  <button onClick={() => setPrikaz("neodobreni")} style={{ marginLeft: 10, marginRight:"10px", paddingInline:10, paddingBlock:3, borderRadius:"8px", ...getActiveFilterButtonStyle(prikaz === "neodobreni")}}>
    Neodobreni
  </button>
)}

</div>
    {ads.length === 0 && <p>Nema oglasa.</p>}
    {prikazaniOglasi.map((ad) => (
      <div key={ad.id} style={{padding:20, marginTop:10, border: "1px solid #ddd", borderRadius: "10px"}}>
        {loggedUser?.id === user.id && ad.imaOdobrenog && ad.odobreniSitter && (
          <div style={{
            marginTop: 15,
            padding: 10,
            backgroundColor: "#e6f7ec",
            borderRadius: 8
          }}>
            <b style={{ color: "green" }}>Odobren sitter:</b>{" "}

            <Link href={`/profile/${ad.odobreniSitter.id}`}>
              <span style={{
                fontWeight: 600,
                cursor: "pointer"
              }}>
                {ad.odobreniSitter.ime} {ad.odobreniSitter.prezime}
              </span>
            </Link>
          </div>
        )}
        <AdCard key={ad.id}  korisnik={user} opis={ad.opis} ljubimac={ad.ljubimac} tipUsluge={ad.tipUsluge} terminCuvanja={ad.terminCuvanja} naknada={ad.naknada}/> 

        {loggedUser?.id === user.id &&  !ad.imaOdobrenog &&(
          <>
            <Link href={`/oglas/izmena/${ad.id}`}>
              <Button text="Izmeni"/>
            </Link>
          </>
          )}
          
          {loggedUser?.id === user.id && (
          <>
            <Button
              text="Obriši"
              onClick={() => handleDeleteAd(ad.id)}
            />
            
            <b><p style={{paddingTop:20}}>Broj prijava: {ad.brojPrijava}</p></b>
            {!ad.imaOdobrenog && ad.brojPrijava > 0 && (
            <Link href={`/oglas/${ad.id}/prijave`}>
              <Button text={`Vidi prijave`} />
            </Link>
          )}
          </>
          )}
        
      </div>
    ))}
    </div>
  )}
    {loggedUser && loggedUser.id === user.id && user.uloga === "Sitter" && (
      <div
        style={{
          padding: 20,
          backgroundColor: "#fafafa",
          border: "1px solid #ddd",
          borderRadius: "10px",
          marginTop: 20
        }}
      >
        <h2>Moje prijave</h2>

        {applications.length === 0 && <p>Niste se prijavili ni na jedan oglas.</p>}
        <div style={{ marginBottom: 15 }}>
          <button onClick={() => setFilter("Sve")} style={{marginTop: "10px", marginRight:"10px", paddingInline:10, paddingBlock:3, borderRadius:"8px", ...getActiveFilterButtonStyle(filter === "Sve")}}>Sve</button>
          <button onClick={() => setFilter("Na čekanju")} style={{marginTop: "10px", marginRight:"10px", paddingInline:10, paddingBlock:3, borderRadius:"8px", ...getActiveFilterButtonStyle(filter === "Na čekanju")}}>Na čekanju</button>
          <button onClick={() => setFilter("Odobreno")} style={{marginTop: "10px", marginRight:"10px", paddingInline:10, paddingBlock:3, borderRadius:"8px", ...getActiveFilterButtonStyle(filter === "Odobreno")}}>Odobreno</button>
          <button onClick={() => setFilter("Odbijeno")} style={{marginTop: "10px", marginRight:"10px", paddingInline:10, paddingBlock:3, borderRadius:"8px", ...getActiveFilterButtonStyle(filter === "Odbijeno")}}>Odbijeno</button>
        </div>
        {applications.filter((app) => {
          if (filter === "Sve") return true;
          return app.status === filter;
        })
          .map((app) => {
            const statusStyle = getApplicationStatusStyle(app.status);
            return (
              <div key={app.id} style={{
                  backgroundColor:"#fafafa" ,
                  border: `1px solid ${statusStyle.borderColor}`,
                  borderRadius:12,
                  padding: "12px",
                  marginBottom: "10px",
                  marginTop: "10px"
                }}>
                <AdCard key={app.oglas.id}  korisnik={app.oglas.vlasnik} opis={app.oglas.opis} ljubimac={app.oglas.ljubimac} tipUsluge={app.oglas.tipUsluge} terminCuvanja={app.oglas.terminCuvanja} naknada={app.oglas.naknada}/>
                <p
                  style={{
                    marginTop: 12,
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${statusStyle.borderColor}`,
                    backgroundColor: statusStyle.backgroundColor,
                    color: statusStyle.color,
                    fontWeight: 600,
                  }}
                >
                  Status: {app.status}
                </p>
                {app.status === "Na čekanju" && (
                <Button
                  text="Opozovi prijavu"
                  onClick={() => handleDeletePrijava(app.id)}
                />
              )}
              </div>
            );
          })}
      </div>
    )}


    </main>
    
  );
}
