"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import styled from "styled-components";

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  background-color: transparent;
`;

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callBackURL = searchParams.get("callbackUrl");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error || "Invalid email or password");
      setLoading(false);
    } else {
      router.push(callBackURL || "/");
      router.refresh();
    }
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="sm:w-[450px] w-full flex flex-col items-center justify-center bg-white shadow p-5 rounded-lg">
        <h2 className="text-2xl text-primary font-medium mb-3">Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col gap-3 w-full">
          <Input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-primary p-2.5 rounded text-white w-full hover:bg-primary/90 disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <Link href="/forgot-password" className="text-primary mt-2">
          Forgot Password?
        </Link>
        <div className="flex items-center justify-center gap-2 mt-3">
          <p>{`Don't have an account ?`}</p>
          <Link href="/register" className="text-primary">
            Register Now
          </Link>
        </div>
      </div>
    </Suspense>
  );
}
