export default function ProfilePage() {
  const user = {
    ime: "Ana Anić",
    email: "ana@email.com",
    datumRodjenja: "1.1.2001.",
    grad: "Beograd",
    brojTelefona: "060123456789"
  };

  return (
    <main style={{ padding: "20px" }}>
      <h1>Profil korisnika</h1>

      <p><strong>Ime:</strong> {user.ime}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Datum rođenja:</strong> {user.datumRodjenja}</p>
      <p><strong>Grad i opština:</strong> {user.grad}</p>
      <p><strong>Broj telefona:</strong> {user.brojTelefona}</p>
    </main>
  );
}