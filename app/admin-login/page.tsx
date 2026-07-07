import { PublicShell } from "@/components/public-shell";
import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <PublicShell>
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
        <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-panel p-8 shadow-glow">
          <p className="text-sm uppercase tracking-[0.35em] text-red-300">Private Access</p>
          <h1 className="mt-3 text-4xl font-black">Admin Portal Login</h1>
          <p className="mt-4 text-zinc-300">
            This entry is reserved for the club administrator and is not shown in the public navigation.
          </p>
          <AdminLoginForm />
        </div>
      </main>
    </PublicShell>
  );
}
