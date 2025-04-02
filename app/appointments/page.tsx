'use client';

import FullCalendarComponent from '../components/FullCalendarComponent';

export default function AppointmentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-dental-dark">Reserva tu Cita</h1>
        <p className="mt-2 text-dental-gray-600">
          Selecciona una fecha y hora para tu consulta dental
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <FullCalendarComponent />
      </div>
    </div>
  );
} 