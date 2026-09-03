import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-slate-900 tracking-tight">
          TEMU<span className="text-blue-600">GURU</span>
        </Link>
        <div className="space-x-4">
          <Link href="/login">
            <Button variant="outline">Masuk</Button>
          </Link>
          <Link href="/register">
            <Button>Daftar</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}