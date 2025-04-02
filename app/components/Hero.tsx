'use client';

import Link from 'next/link';
import { Calendar, Phone, Clock } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-dental-light">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-dental-dark sm:text-5xl md:text-6xl">
                <span className="block">Tu sonrisa en</span>
                <span className="block text-dental-primary">las mejores manos</span>
              </h1>
              <p className="mt-3 text-base text-dental-gray-700 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Cuidamos tu salud dental con profesionalismo y tecnología de vanguardia. 
                Agenda tu cita hoy y descubre la diferencia de un servicio dental de calidad.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    href="/appointments"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-dental-primary hover:bg-dental-primary/90 md:py-4 md:text-lg md:px-10"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Reservar Cita
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    href="/contactUs"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-dental-primary bg-white hover:bg-dental-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Contactar
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full bg-dental-primary/10">
          <div className="absolute inset-0 flex items-center justify-center">
            <Clock className="w-64 h-64 text-dental-primary/20" />
          </div>
        </div>
      </div>
    </div>
  );
} 