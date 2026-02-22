"use client";

import { useAuth } from "@/app/components/AuthProvider";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { use, useEffect, useState } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditLjubimacPage({ params }: Props) {
  const [tip, setTip] = useState("");
  const [ime, setIme] = useState("");
  const [slika, setSlika] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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

      if (data) {
        setTip(data.tip || "");
        setIme(data.ime || "");
        setSlika(data.slika || "");
        setDatumRodjenja(data.datumRodjenja?.slice(0, 10) || "");
        setAlergije(data.alergije || "");
        setLekovi(data.lekovi || "");
        setIshrana(data.ishrana || "");
      }
    }

    fetchPet();
  }, [id]);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Upload slike nije uspeo.");
    }

    return data.url as string;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let slikaZaCuvanje = slika;
    try {
      if (imageFile) {
        setIsUploading(true);
        slikaZaCuvanje = await uploadImage(imageFile);
      }
    } catch (error: any) {
      alert(error?.message || "Greska pri upload-u slike.");
      setIsUploading(false);
      return;
    } finally {
      setIsUploading(false);
    }

    const res = await fetch(`/api/ljubimac/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tip,
        ime,
        slika: slikaZaCuvanje,
        datumRodjenja,
        alergije,
        lekovi,
        ishrana,
      }),
    });

    if (res.ok) {
      alert("Ljubimac uspesno azuriran");
      window.location.href = `/profile/${user?.id}`;
    } else {
      alert("Greska pri izmeni ljubimca");
    }
  }

  return (
    <main style={{ maxWidth: 400 }}>
      <div
        style={{
          padding: 20,
          backgroundColor: "#fafafa",
          maxWidth: 400,
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h1>Izmena ljubimca</h1>
        <form onSubmit={handleSubmit}>
          <select style={{ marginBottom: 15 }} value={tip} onChange={(e) => setTip(e.target.value)}>
            <option value="">Izaberi vrstu</option>
            <option value="Pas">Pas</option>
            <option value="Macka">Macka</option>
            <option value="Ptica">Ptica</option>
            <option value="Hrcak">Hrcak</option>
            <option value="Zec">Zec</option>
            <option value="Ostalo">Ostalo</option>
          </select>

          <Input label={"Ime"} value={ime} onChange={(e) => setIme(e.target.value)} />

          <div
            style={{
              border: "1px dashed #9ca3af",
              borderRadius: 10,
              padding: 12,
              marginBottom: 12,
              backgroundColor: "#f9fafb",
            }}
          >
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Slika ljubimca</label>
            <input
              id="pet-image-edit"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
            <label
              htmlFor="pet-image-edit"
              style={{
                display: "inline-block",
                backgroundColor: "#4f46e5",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
                marginBottom: 8,
              }}
            >
              Izaberi novu sliku
            </label>
            <p style={{ margin: 0, fontSize: 14, color: "#4b5563" }}>
              {imageFile
                ? `Izabrana slika: ${imageFile.name}`
                : slika
                  ? "Trenutna slika je postavljena"
                  : "Nijedna slika nije izabrana"}
            </p>
            {(previewUrl || slika) && (
              <img
                src={previewUrl || slika}
                alt={`Ljubimac ${ime}`}
                style={{
                  marginTop: 10,
                  width: "100%",
                  maxHeight: 220,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  display: "block",
                }}
              />
            )}
          </div>

          <label>Datum rodjenja</label>
          <input
            type="date"
            value={datumRodjenja}
            onChange={(e) => setDatumRodjenja(e.target.value)}
          />

          <Input label={"Alergije"} value={alergije} onChange={(e) => setAlergije(e.target.value)} />
          <Input label={"Lekovi"} value={lekovi} onChange={(e) => setLekovi(e.target.value)} />
          <Input label={"Ishrana"} value={ishrana} onChange={(e) => setIshrana(e.target.value)} />

          <Button text={isUploading ? "Upload slike..." : "Sacuvaj izmene"} />
        </form>
      </div>
    </main>
  );
}
