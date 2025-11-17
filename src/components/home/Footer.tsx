'use client';

export function Footer({ fullName }: { fullName: string }) {
  return (
    <footer className="py-6 sm:py-8 border-t border-white/10 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 text-center text-gray-400">
        <p className="text-sm sm:text-base">&copy; {new Date().getFullYear()} {fullName}. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}