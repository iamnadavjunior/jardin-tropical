import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[80vh] grid place-items-center container-x">
      <div className="text-center">
        <p className="eyebrow">404</p>
        <h1 className="display-1 mt-6 text-ink">Lost in the garden.</h1>
        <p className="mt-6 text-ink-muted max-w-md mx-auto">
          The page you're looking for doesn't exist — but the path back home is just one step away.
        </p>
        <Link href="/" className="btn-primary mt-10">Return home</Link>
      </div>
    </section>
  );
}
