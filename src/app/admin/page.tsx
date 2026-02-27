"use client";

import Button from "@/app/components/Button";
import { useAuth } from "@/app/components/AuthProvider";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type Stats = {
  users: number;
  ads: number;
  applications: number;
  sitters: number;
  owners: number;
};

type AdminUser = {
  id: string;
  ime: string;
  prezime: string;
  email: string;
  grad: string;
  opstina: string;
  uloga: string;
};

type AdminAd = {
  id: string;
  opis: string;
  terminCuvanja: string;
  naknada: number;
  korisnik?: { id: string; ime: string; prezime: string } | null;
  ljubimac?: { ime: string; tip: string } | null;
  tipUsluge?: { ime: string } | null;
};

type AdminApplication = {
  id: string;
  status: string;
  createdAt: string;
  sitter: { id: string; ime: string; prezime: string; email: string } | null;
  oglas: {
    id: string;
    opis: string;
    terminCuvanja: string;
    naknada: number;
    ljubimac: { id: string; ime: string; tip: string } | null;
  } | null;
};

const ROLE_OPTIONS = ["Vlasnik", "Sitter"];

export default function AdminPage() {
  const { status, user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [ads, setAds] = useState<AdminAd[]>([]);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const roleMap = useMemo(() => {
    return Object.fromEntries(users.map((u) => [u.id, u.uloga])) as Record<string, string>;
  }, [users]);

  async function loadAll() {
    try {
      setLoading(true);
      setError("");

      const [statsRes, usersRes, adsRes, applicationsRes] = await Promise.all([
        fetch("/api/admin/stats", { credentials: "include" }),
        fetch("/api/admin/users", { credentials: "include" }),
        fetch("/api/admin/ads", { credentials: "include" }),
        fetch("/api/admin/applications", { credentials: "include" }),
      ]);

      if (!statsRes.ok || !usersRes.ok || !adsRes.ok || !applicationsRes.ok) {
        throw new Error("Nemate dozvolu za admin dashboard.");
      }

      const [statsData, usersData, adsData, applicationsData] = await Promise.all([
        statsRes.json(),
        usersRes.json(),
        adsRes.json(),
        applicationsRes.json(),
      ]);

      setStats(statsData);
      setUsers(usersData);
      setAds(adsData);
      setApplications(applicationsData);
    } catch (e: any) {
      setError(e?.message ?? "Greska pri ucitavanju admin podataka.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated" && user?.uloga === "Admin") {
      loadAll();
      return;
    }
    if (status !== "loading") {
      setLoading(false);
    }
  }, [status, user?.uloga]);

  async function handleDeleteUser(id: string) {
    if (!confirm("Da li ste sigurni da zelite da obrisete korisnika?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE", credentials: "include" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.message ?? "Brisanje korisnika nije uspelo.");
      return;
    }
    await loadAll();
  }

  async function handleRoleChange(id: string, uloga: string) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uloga }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.message ?? "Promena uloge nije uspela.");
      return;
    }
    await loadAll();
  }

  async function handleDeleteAd(id: string) {
    if (!confirm("Da li ste sigurni da zelite da obrisete oglas?")) return;
    const res = await fetch(`/api/admin/ads/${id}`, { method: "DELETE", credentials: "include" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.message ?? "Brisanje oglasa nije uspelo.");
      return;
    }
    await loadAll();
  }

  async function handleDeleteApplication(id: string) {
    if (!confirm("Da li ste sigurni da zelite da obrisete prijavu?")) return;
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.message ?? "Brisanje prijave nije uspelo.");
      return;
    }
    await loadAll();
  }

  if (loading || status === "loading") return <main style={{ padding: 20 }}><p>Ucitavanje...</p></main>;
  if (status !== "authenticated" || user?.uloga !== "Admin") {
    return (
      <main style={{ padding: 20 }}>
        <h1>Admin Dashboard</h1>
        <p>Nemate pristup ovoj stranici.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <section style={{ marginTop: 16, marginBottom: 24 }}>
        <h2>Pregled statistike</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <StatCard label="Ukupno korisnika" value={stats?.users ?? 0} />
          <StatCard label="Broj oglasa" value={stats?.ads ?? 0} />
          <StatCard label="Broj prijava" value={stats?.applications ?? 0} />
          <StatCard label="Broj sittera" value={stats?.sitters ?? 0} />
          <StatCard label="Broj vlasnika" value={stats?.owners ?? 0} />
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>Upravljanje korisnicima</h2>
        <div style={{ overflowX: "auto", border: "1px solid #ddd", borderRadius: 8, backgroundColor: "#fff" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>Korisnik</Th>
                <Th>Email</Th>
                <Th>Lokacija</Th>
                <Th>Uloga</Th>
                <Th>Akcije</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <Td><Link href={`/profile/${u.id}`}>{u.ime} {u.prezime}</Link></Td>
                  <Td>{u.email}</Td>
                  <Td>{u.grad || "-"} {u.opstina ? `(${u.opstina})` : ""}</Td>
                  <Td>
                    <select
                      value={roleMap[u.id] ?? u.uloga}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </Td>
                  <Td>
                    <Button text="Obrisi" onClick={() => handleDeleteUser(u.id)} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>Upravljanje oglasima</h2>
        <div style={{ overflowX: "auto", border: "1px solid #ddd", borderRadius: 8, backgroundColor: "#fff" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>Opis</Th>
                <Th>Vlasnik</Th>
                <Th>Ljubimac</Th>
                <Th>Tip usluge</Th>
                <Th>Datum</Th>
                <Th>Akcije</Th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id}>
                  <Td>{ad.opis}</Td>
                  <Td>{ad.korisnik?.ime} {ad.korisnik?.prezime}</Td>
                  <Td>{ad.ljubimac?.ime} {ad.ljubimac?.tip ? `(${ad.ljubimac.tip})` : ""}</Td>
                  <Td>{ad.tipUsluge?.ime ?? "-"}</Td>
                  <Td>{ad.terminCuvanja}</Td>
                  <Td><Button text="Obrisi" onClick={() => handleDeleteAd(ad.id)} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>Upravljanje prijavama</h2>
        <div style={{ overflowX: "auto", border: "1px solid #ddd", borderRadius: 8, backgroundColor: "#fff" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>Sitter</Th>
                <Th>Oglas</Th>
                <Th>Ljubimac</Th>
                <Th>Status</Th>
                <Th>Datum prijave</Th>
                <Th>Akcije</Th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <Td>{app.sitter?.ime} {app.sitter?.prezime}</Td>
                  <Td>{app.oglas?.opis ?? "-"}</Td>
                  <Td>{app.oglas?.ljubimac?.ime ?? "-"}</Td>
                  <Td>{app.status}</Td>
                  <Td>{app.createdAt?.slice(0, 10)}</Td>
                  <Td>
                    <Button text="Obrisi" onClick={() => handleDeleteApplication(app.id)} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        padding: 14,
        border: "1px solid #ddd",
        borderRadius: 10,
        backgroundColor: "#fafafa",
      }}
    >
      <p style={{ margin: 0, color: "#4b5563", fontSize: 13 }}>{label}</p>
      <p style={{ margin: "6px 0 0 0", fontWeight: 700, fontSize: 24 }}>{value}</p>
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 10, backgroundColor: "#f3f4f6" }}>
      {children}
    </th>
  );
}

function Td({ children }: { children: ReactNode }) {
  return <td style={{ borderBottom: "1px solid #eee", padding: 10, verticalAlign: "top" }}>{children}</td>;
}
