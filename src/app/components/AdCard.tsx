type AdCardProps = {
  korisnik: string;
  opis: string;
  ljubimac: string;
  tipUsluge: string;
  terminCuvanja: string;
  naknada: string;
};

export default function AdCard({ korisnik, opis, ljubimac, tipUsluge, terminCuvanja, naknada }: AdCardProps) {
  return (
    <div className="card">
        <h4>{korisnik}</h4>
        <h3>{opis}</h3>
        <p>Ljubimac: {ljubimac}</p>
        <p>Termin čuvanja: {terminCuvanja}</p>
        <p>Tip usluge: {tipUsluge}</p>
        <p>Novčana naknada: {naknada}</p>
    </div>
  );
}