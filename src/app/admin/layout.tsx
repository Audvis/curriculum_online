'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LogOut, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleViewPortfolio = () => {
    window.open('/', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center"
              >
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-xs sm:text-sm text-gray-300 hidden sm:block">Portfolio Management</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-end">
              <Button
                onClick={handleViewPortfolio}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Ver Portfolio</span>
                <span className="sm:hidden">Ver</span>
              </Button>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
}