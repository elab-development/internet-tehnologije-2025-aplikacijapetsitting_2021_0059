import Link from "next/link";

export type Korisnik = {
  id: string;
  ime: string;
  prezime: string;
};

export type Ljubimac = {
  id: string;
  ime: string;
  tip: string;
};

export type TipUsluge = {
  id: string;
  ime: string;
};

export type Ad = {
  id: string;
  opis: string;
  tipUsluge: TipUsluge;
  terminCuvanja: string;
  naknada: string;
  korisnik: Korisnik;
  ljubimac: Ljubimac;
};

type AdCardProps = {
  korisnik: Korisnik;
  opis: string;
  ljubimac: Ljubimac;
  tipUsluge: TipUsluge;
  terminCuvanja: string;
  naknada: string;
};


export default function AdCard({ korisnik, opis, ljubimac, tipUsluge, terminCuvanja, naknada }: AdCardProps) {
  return (
    
    <div className="card">
        
          <Link href={`/profile/${korisnik.id}`} 
          style={{ textDecoration: "none", color: "inherit" }}>
           <h4>{korisnik.ime}</h4>
        </Link>


        
        <h3>{opis}</h3>
        <p>Ljubimac: {ljubimac.ime } ,  {ljubimac.tip}</p>
        <p>Termin čuvanja: {terminCuvanja}</p>
        <p>Tip usluge: {tipUsluge.ime}</p>
        <p>Novčana naknada: {naknada}</p>
    </div>
  );
  
}