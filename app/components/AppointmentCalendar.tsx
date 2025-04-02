'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

interface AppointmentCalendarProps {
  onDateSelect: (date: Date) => void;
}

export default function AppointmentCalendar({ onDateSelect }: AppointmentCalendarProps) {
  const handleDateSelect = (selectInfo: any) => {
    onDateSelect(selectInfo.start);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        locale={esLocale}
        select={handleDateSelect}
        height="auto"
        selectConstraint={{
          start: new Date().toISOString().split('T')[0], // Desde hoy
          end: new Date(new Date().setMonth(new Date().getMonth() + 3)) // Hasta 3 meses después
        }}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5, 6], // Lunes a Sábado
          startTime: '09:00',
          endTime: '18:00',
        }}
        selectConstraint="businessHours"
      />
    </div>
  );
} 