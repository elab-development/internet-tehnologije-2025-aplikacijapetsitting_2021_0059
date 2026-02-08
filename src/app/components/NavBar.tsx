"use client";

import { RiUser3Line } from "@remixicon/react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
     const { status, user, logout } = useAuth();
    const isLoggedIn = status === "authenticated";

    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        setOpen(false);
     };
     return (
    <header style={{ height: "64px", borderBottom: "1px solid #ccc" }}>
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
            alt="Šapa"
            className="mx-auto h-10 w-auto"
            />
        </Link>

    {isLoggedIn ? (
        <div style={{ position: "relative" }}>
            <button
            onClick={() => setOpen((prev) => !prev)}
            style={{
                height: 40,
                width: 40,
                borderRadius: "50%",
                background: "#e0e7ff",
                border: "none",
                cursor: "pointer",
            }}
            >
            <RiUser3Line />
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
            <Link href={`/profile/${user.id}`} 
          style={{ marginBottom: "8px", fontWeight: 500,textAlign: "center", }}>
           <p>{user.ime}</p>
        </Link>

          {/*   <div style={{ marginBottom: "8px", fontWeight: 500,textAlign: "center", }}>
            {user?.ime}
            </div> */}

            <button
            onClick={handleLogout}
            style={{
                width: "100%",
                padding: "10px",
                background: "#fee2e2",
                color: "#b91c1c",
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
        ) : (
        <Link href="/login">Prijavi se</Link>
        )}

      </div>
    </header>
  );
}