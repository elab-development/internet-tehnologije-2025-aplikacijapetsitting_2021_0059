"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "./Button";
import Input from "./Input";


type Mode = "login" | "register";

export default function AuthForm({ mode }: { mode: Mode }) {

    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [role, setRole] = useState("");

    const [err, setErr] = useState("");
     const [loading, setLoading] = useState(false);
     const title = mode === "login" ? "Prijavi se na svoj nalog" : "Napravi novi nalog";
     const btnLabel = mode === "login" ? "Prijavi se" : "Napravi nalog";
    const switchLine =
         mode === "login"
             ? (["Niste registrovani?", "Registruj se", "/register"] as const)
             : (["Već imate nalog?", "Prijavi se", "/login"] as const);

    //SUBMIT
     const handleSubmit = async (e: FormEvent) => {
         e.preventDefault();
         setErr("");
         setLoading(true);

        

         try {
             const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register"

            const body = mode === "login" ? { email, password: pwd } : {ime: name, email, password: pwd, uloga: role,
      };

             const res = await fetch(endpoint, {
                 method: "POST",
                 credentials: "include", 
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify(body), 
             })

             if (!res.ok) {
                 let message = "Greska pri autentifikaciji";
                 let data;
                 try {
                     data = await res.json();
                     message = data?.error ?? message;
                 } catch {
                     message = (data as string) || message;
                 }
                 setErr(message);
                 return;
             }

             router.refresh();
             router.push("/");
         } finally {
             setLoading(false); 
         }
         }

     return (
  <div className="auth-page" id="reg">
    <div className="auth-container">
      <div className="auth-header">
        <img src="/logo.png" alt="Šapa logo" width="120px" height="120px"/>
        <h2>{title}</h2>
      </div>

      <div className="auth-box">
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "register" && (
            <div>
              <Input label={"Ime i prezime"} value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
          )}

          <div>
              <Input label={"Email"} value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>

          <div>
            <label>Lozinka</label>
            <input
              type="password"
              required
               value={pwd}  onChange={(e) => setPwd(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {mode === "register" && (
            <div>
              <label>Izaberi ulogu</label>
              <div className="role-group">
                <label>
                  <input type="radio" name="uloga" value="Vlasnik"  checked={role === "Vlasnik"} onChange={(e) => setRole(e.target.value)} required />
                  Vlasnik ljubimca
                </label>


                <label>
                    
                  <input type="radio" name="uloga" value="Sitter" checked={role === "Sitter"} onChange={(e) => setRole(e.target.value)}/>
                  Pet sitter
                </label>
              </div>
            </div>
          )}

          {err && <p className="error-text">{err}</p>}

          <Button text={loading ? "Obrada..." : btnLabel}/>
            
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
