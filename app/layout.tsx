import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DentalCare - Tu Clínica Dental de Confianza",
  description: "Sistema de reserva de citas para tu clínica dental. Cuidamos tu sonrisa con profesionalismo y tecnología de vanguardia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-dental-light">
          {children}
        </main>
        <footer className="bg-white border-t border-dental-gray-200">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-dental-dark mb-4">DentalCare</h3>
                <p className="text-dental-gray-600">
                  Tu sonrisa en las mejores manos. Servicio dental profesional y de calidad.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dental-dark mb-4">Contacto</h3>
                <p className="text-dental-gray-600">
                  Dirección: Av. Principal 123<br />
                  Teléfono: (123) 456-7890<br />
                  Email: info@dentalcare.com
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dental-dark mb-4">Horario</h3>
                <p className="text-dental-gray-600">
                  Lunes a Viernes: 9:00 - 18:00<br />
                  Sábados: 9:00 - 13:00<br />
                  Domingos: Cerrado
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-dental-gray-200 text-center text-dental-gray-600">
              <p>&copy; {new Date().getFullYear()} DentalCare. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
