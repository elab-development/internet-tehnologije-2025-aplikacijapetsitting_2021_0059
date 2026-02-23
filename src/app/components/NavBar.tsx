"use client";

import { RiUser3Line } from "@remixicon/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
    const HIDDEN_NOTIFICATIONS_STORAGE_KEY = "hiddenSitterNotifications";
    const { status, user, logout } = useAuth();
    const isAuthLoading = status === "loading";
    const isLoggedIn = status === "authenticated";

    const [open, setOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement | null>(null);
    const [pendingCount, setPendingCount] = useState(0);
    const [sitterNotificationsCount, setSitterNotificationsCount] = useState(0);

    const handleLogout = async () => {
        await logout();
        setOpen(false);
     };

    useEffect(() => {
      async function fetchNavbarCounts() {
        if (!isLoggedIn || !user?.id) return;

        if (user.uloga === "Vlasnik") {
          const res = await fetch(`/api/prijava/cekanje/${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setPendingCount(Array.isArray(data) ? data.length : 0);
          }
        }

        if (user.uloga === "Sitter") {
          const res = await fetch(`/api/prijava?korisnikId=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            const list = Array.isArray(data) ? data : [];
            const rawHidden = localStorage.getItem(HIDDEN_NOTIFICATIONS_STORAGE_KEY);
            let hiddenKeys: string[] = [];
            if (rawHidden) {
              try {
                const parsed = JSON.parse(rawHidden);
                if (Array.isArray(parsed)) {
                  hiddenKeys = parsed.filter((item) => typeof item === "string");
                }
              } catch {
                hiddenKeys = [];
              }
            }
            const count = list.filter(
              (app: any) =>
                (app.status === "Odobreno" || app.status === "Odbijeno") &&
                !hiddenKeys.includes(`${app.id}:${app.status}`)
            ).length;
            setSitterNotificationsCount(count);
          }
        }
      }

      fetchNavbarCounts();
      const onHiddenNotificationsUpdated = () => fetchNavbarCounts();
      window.addEventListener("hidden-notifications-updated", onHiddenNotificationsUpdated);

      return () => {
        window.removeEventListener("hidden-notifications-updated", onHiddenNotificationsUpdated);
      };
    }, [isLoggedIn, user?.id, user?.uloga]);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (!open) return;
        if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [open]);

    function Badge({ count }: { count: number }) {
      return (
        <span
          style={{
            marginLeft: 6,
            minWidth: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: "#ef4444",
            color: "white",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            padding: "0 6px",
            fontWeight: 700,
          }}
        >
          {count}
        </span>
      );
    }

    const navLinkStyle = {
      textDecoration: "none",
      color: "#6b7280",
      padding: "6px 10px",
      backgroundColor: "#ffffff",
      display: "inline-flex",
      alignItems: "center",
      fontSize: 14,
      fontWeight: 600,
      letterSpacing: 0.8,
      textTransform: "uppercase" as const,
      whiteSpace: "nowrap" as const,
    };

    const dividerStyle = {
      width: "1px",
      height: "24px",
      backgroundColor: "#d1d5db",
      margin: "0 2px",
      flexShrink: 0,
    };

    const profileLinkStyle = {
      ...navLinkStyle,
      backgroundColor: "#f3f4f6",
      border: "1px solid #d1d5db",
      fontWeight: 600,
    };

     return (
    <header style={{ height: "68px", borderBottom: "1px solid #ccc" }}>
         <div
            style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            backgroundColor: "white"
    }}
  >
        <Link
            href="/"
            className="text-xl font-semibold flex items-center gap-x-2"
        >
        <img
            src="/logo.png"
            alt="Sapa"
            className="mx-auto h-10 w-auto"
            />
            
        
        </Link>

        {status === "unauthenticated" && (
          <Link href="/" style={navLinkStyle}>Svi oglasi</Link>
        )}

        {!isAuthLoading && isLoggedIn && user?.uloga === "Vlasnik" && (
          <nav style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, overflowX: "auto", paddingBottom: 2 }}>
            <Link href="/" style={navLinkStyle}>Svi oglasi</Link>
            <div style={dividerStyle} />
            <Link href="/oglas" style={navLinkStyle}>Dodaj oglas</Link>
            <div style={dividerStyle} />
            <Link href={`/profile/${user.id}#moji-ljubimci`} style={navLinkStyle}>Moji ljubimci</Link>
            <div style={dividerStyle} />
            <Link href={`/profile/${user.id}#moji-oglasi`} style={navLinkStyle}>Moji oglasi</Link>
            {pendingCount > 0 && (
              <>
                <div style={dividerStyle} />
                <Link href={`/profile/${user.id}#prijave-na-cekanju`} style={navLinkStyle}>
                  Nove prijave
                  <Badge count={pendingCount} />
                </Link>
              </>
            )}
          </nav>
        )}

        {!isAuthLoading && isLoggedIn && user?.uloga === "Sitter" && (
          <nav style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, overflowX: "auto", paddingBottom: 2 }}>
            <Link href="/" style={navLinkStyle}>Svi oglasi</Link>
            <div style={dividerStyle} />
            <Link href={`/profile/${user.id}#moje-prijave`} style={navLinkStyle}>Moje prijave</Link>
            {sitterNotificationsCount > 0 && (
              <>
                <div style={dividerStyle} />
                <Link href={`/profile/${user.id}#obavestenja`} style={navLinkStyle}>
                  Obavestenja
                  <Badge count={sitterNotificationsCount} />
                </Link>
              </>
            )}
          </nav>
        )}

        {!isAuthLoading && isLoggedIn && user?.uloga === "Admin" && (
          <nav style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, overflowX: "auto", paddingBottom: 2 }}>
            <Link href="/" style={navLinkStyle}>Svi oglasi</Link>
            <div style={dividerStyle} />
            <Link href="/admin" style={navLinkStyle}>Admin dashboard</Link>
          </nav>
        )}


    {!isAuthLoading && isLoggedIn ? (
        <div ref={profileMenuRef} style={{ position: "relative" }}>
            <button
            onClick={() => setOpen((prev) => !prev)}
            style={{
                height: 40,
                borderRadius: "20px",
                background: "#e0e7ff",
                border: "1px solid #c7d2fe",
                cursor: "pointer",
                padding: "0 10px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
            }}
            >
                <RiUser3Line />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{user.ime}</span>
            </button>

        {open && (
        <div
            style={{
            position: "absolute",
            top: "56px",
            right: 0,
            minWidth: "220px", 
            padding: "12px",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            }}
        >
            <div style={{ marginBottom: "8px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>
              <p style={{ margin: 0, fontWeight: 700, color: "#111827" }}>{user.ime}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{user.uloga}</p>
            </div>
            <Link href={`/profile/${user.id}`} 
          style={{ display: "block", marginBottom: "8px", fontWeight: 500, textAlign: "center", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px", color: "#111827", textDecoration: "none" }}>
           Moj profil
        </Link>
            <button
            onClick={handleLogout}
            style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
                background: "indigo",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
            }}
            >
            Odjavi se
            </button>
        </div>
        )}
        </div>
        ) : !isAuthLoading ? (
        <Link href="/login">Prijavi se</Link>
        ) : null}

      </div>
    </header>
  );
}


