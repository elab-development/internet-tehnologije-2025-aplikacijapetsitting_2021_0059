"use client";

import { useState } from "react";
import Link from "next/link";


type Mode = "login" | "register";

export default function AuthForm({ mode }: { mode: Mode }) {

    const [err, setErr] = useState("");
     const [loading, setLoading] = useState(false);
     const title = mode === "login" ? "Prijavi se na svoj nalog" : "Napravi novi nalog";
     const btnLabel = mode === "login" ? "Prijavi se" : "Napravi nalog";
    const switchLine =
         mode === "login"
             ? (["Niste registrovani?", "Registruj se", "/register"] as const)
             : (["Već imate nalog?", "Prijavi se", "/login"] as const);

     return (
  <div className="auth-page">
    <div className="auth-container">
      <div className="auth-header">
        <img src="/logo.png" alt="Šapa logo" width="120px" height="120px"/>
        <h2>{title}</h2>
      </div>

      <div className="auth-box">
        <form className="auth-form">
          {mode === "register" && (
            <div>
              <label>Ime i prezime</label>
              <input type="text" required />
            </div>
          )}

          <div>
            <label>Email adresa</label>
            <input type="email" required />
          </div>

          <div>
            <label>Lozinka</label>
            <input
              type="password"
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {mode === "register" && (
            <div>
              <label>Izaberi ulogu</label>
              <div className="role-group">
                <label>
                  <input type="radio" name="uloga" value="OWNER" required />
                  Vlasnik ljubimca
                </label>

                <label>
                    
                  <input type="radio" name="uloga" value="SITTER" />
                  Pet sitter
                </label>
              </div>
            </div>
          )}

          {err && <p className="error-text">{err}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Obrada..." : btnLabel}
          </button>
        </form>

        <div className="auth-switch">
          {switchLine[0]}{" "}
          <Link href={switchLine[2]}>{switchLine[1]}</Link>
        </div>
      </div>
    </div>
  </div>
);
}
