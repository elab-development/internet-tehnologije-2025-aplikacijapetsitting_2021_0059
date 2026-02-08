import AuthForm from "../components/AuthForm";

export default function LoginPage() {
   return <AuthForm mode="login" />;
}

/*"use client";

import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";

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
       <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
       <Input label="Lozinka" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        
       <Button text="Prijavi se" type="submit" />
      </form>
    </main>
  );
}*/