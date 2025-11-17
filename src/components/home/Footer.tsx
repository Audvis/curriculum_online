'use client';

export function Footer({ fullName }: { fullName: string }) {
  return (
    <footer className="py-8 border-t border-white/10 relative z-10">
      <div className="container mx-auto px-6 text-center text-gray-400">
        <p>&copy; 2024 {fullName}. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}