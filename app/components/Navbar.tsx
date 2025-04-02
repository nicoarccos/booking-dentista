'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Phone, Calendar, User, Home, Info, Mail } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-dental-primary">DentalCare</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-dental-dark hover:text-dental-primary flex items-center">
              <Home className="w-5 h-5 mr-1" />
              Inicio
            </Link>
            <Link href="/services" className="text-dental-dark hover:text-dental-primary flex items-center">
              <Calendar className="w-5 h-5 mr-1" />
              Servicios
            </Link>
            <Link href="/aboutUs" className="text-dental-dark hover:text-dental-primary flex items-center">
              <Info className="w-5 h-5 mr-1" />
              Sobre Nosotros
            </Link>
            <Link href="/contactUs" className="text-dental-dark hover:text-dental-primary flex items-center">
              <Mail className="w-5 h-5 mr-1" />
              Contacto
            </Link>
            <Link href="/appointments" className="bg-dental-primary text-white px-4 py-2 rounded-md hover:bg-dental-primary/90 flex items-center">
              <Calendar className="w-5 h-5 mr-1" />
              Reservar Cita
            </Link>
            <Link href="/profile" className="text-dental-dark hover:text-dental-primary flex items-center">
              <User className="w-5 h-5 mr-1" />
              Mi Cuenta
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-dental-dark hover:text-dental-primary focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 text-dental-dark hover:text-dental-primary">
              Inicio
            </Link>
            <Link href="/services" className="block px-3 py-2 text-dental-dark hover:text-dental-primary">
              Servicios
            </Link>
            <Link href="/aboutUs" className="block px-3 py-2 text-dental-dark hover:text-dental-primary">
              Sobre Nosotros
            </Link>
            <Link href="/contactUs" className="block px-3 py-2 text-dental-dark hover:text-dental-primary">
              Contacto
            </Link>
            <Link href="/appointments" className="block px-3 py-2 text-dental-primary hover:text-dental-primary/90">
              Reservar Cita
            </Link>
            <Link href="/profile" className="block px-3 py-2 text-dental-dark hover:text-dental-primary">
              Mi Cuenta
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 