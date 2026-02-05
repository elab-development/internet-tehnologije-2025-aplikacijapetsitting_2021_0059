"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
    // kasnije: poziv backend API-ja
  };

  return (
    <main style={{ padding: "20px" }}>
      <h1>Prijava</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Lozinka</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Prijavi se</button>
      </form>
    </main>
  );
}