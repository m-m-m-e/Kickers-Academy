"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      body: formData
    });

    setLoading(false);

    if (!response.ok) {
      setError("Invalid username or password.");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <label className="space-y-2">
        <span className="text-sm text-zinc-300">Username</span>
        <input
          name="username"
          type="text"
          autoComplete="username"
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm text-zinc-300">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
        />
      </label>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Enter Portal"}
      </button>
    </form>
  );
}
