"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";

export default function DodajLjubimcaPage() {
  const { user } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({
    tip: "",
    ime: "",
    slika: "",
    datumRodjenja: "",
    alergije: "",
    lekovi: "",
    ishrana: "",
  });

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

    let slika = form.slika;
    try {
      if (imageFile) {
        setIsUploading(true);
        slika = await uploadImage(imageFile);
      }
    } catch (error: any) {
      alert(error?.message || "Greška pri upload-u slike.");
      setIsUploading(false);
      return;
    } finally {
      setIsUploading(false);
    }

    const res = await fetch("/api/ljubimac", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...form, slika }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Ljubimac uspešno dodat");
      window.location.href = `/profile/${user?.id}`;
    } else {
      alert(data.message);
    }
  }

  return (
    <main style={{ maxWidth: 400, padding: 20 }}>
      <div
        style={{
          backgroundColor: "#fafafa",
          border: "1px solid #ccc",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h2>Dodavanje ljubimca</h2>

        <form onSubmit={handleSubmit}>
            <select
            value={form.tip}
            onChange={(e) =>
                setForm({ ...form, tip: e.target.value })
            }
            >
            <option value="">Izaberi vrstu</option>
            <option value="Pas">Pas</option>
            <option value="Mačka">Mačka</option>
            <option value="Ptica">Ptica</option>
            <option value="Hrčak">Hrčak</option>
            <option value="Zec">Zec</option>
            </select>

          <Input
            label="Ime"
            value={form.ime}
            onChange={(e) =>
              setForm({ ...form, ime: e.target.value })
            }
          />

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
              id="pet-image-add"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
            <label
              htmlFor="pet-image-add"
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
              Izaberi sliku
            </label>
            <p style={{ margin: 0, fontSize: 14, color: "#4b5563" }}>
              {imageFile ? `Izabrana slika: ${imageFile.name}` : "Nijedna slika nije izabrana"}
            </p>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Pregled izabrane slike"
                style={{
                  marginTop: 10,
                  width: "100%",
                  maxHeight: 220,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                }}
              />
            )}
          </div>

          <label>Datum rođenja</label>
          <input
            type="date"
            value={form.datumRodjenja}
            onChange={(e) =>
              setForm({
                ...form,
                datumRodjenja: e.target.value,
              })
            }
          />

          <Input
            label="Alergije"
            value={form.alergije}
            onChange={(e) =>
              setForm({
                ...form,
                alergije: e.target.value,
              })
            }
          />

          <Input
            label="Lekovi"
            value={form.lekovi}
            onChange={(e) =>
              setForm({
                ...form,
                lekovi: e.target.value,
              })
            }
          />

          <Input
            label="Ishrana"
            value={form.ishrana}
            onChange={(e) =>
              setForm({
                ...form,
                ishrana: e.target.value,
              })
            }
          />

          <Button text={isUploading ? "Upload slike..." : "Dodaj ljubimca"} type="submit" />
        </form>
      </div>
    </main>
  );
}
