import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-center text-white">
      <div className="max-w-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-red-300">404</p>
        <h1 className="mt-4 text-4xl font-black sm:text-5xl">Page not found</h1>
        <p className="mt-4 text-zinc-300">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-400"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

