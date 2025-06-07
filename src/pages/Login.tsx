import { useState } from "react";
import { login } from "../api/fetchApi";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(name, email);
    onLogin();
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}