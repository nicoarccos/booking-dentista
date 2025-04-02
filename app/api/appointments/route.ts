import { supabase } from '@/app/utils/supabaseClient';
import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from '@/app/utils/sendEmail';

// GET /api/appointments
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    console.log('GET /api/appointments - Received request with date:', date);

    if (!date) {
      return NextResponse.json(
        { error: 'Se requiere una fecha' },
        { status: 400 }
      );
    }

    // Validar formato de fecha (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Formato de fecha inválido. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Obtener horarios disponibles de la tabla bookingdentis
    const { data: appointments, error } = await supabase
      .from('bookingdentis')
      .select('*')
      .eq('date', date)
      .eq('booked', false)
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching appointments from Supabase:', error);
      // Si hay un error al obtener los horarios, generamos horarios de ejemplo
      const exampleSlots = generateExampleSlots(date);
      return NextResponse.json({ schedules: exampleSlots });
    }

    // Si no hay horarios disponibles, generar algunos de ejemplo
    if (!appointments || appointments.length === 0) {
      console.log('No appointments found, generating example slots');
      const exampleSlots = generateExampleSlots(date);
      return NextResponse.json({ schedules: exampleSlots });
    }

    // Transformar los appointments en el formato esperado por el frontend
    const schedules = appointments.map((appointment: any) => {
      const appointmentDate = appointment.date || date;
      return {
        id: appointment.id,
        date: appointmentDate,
        time_slot: appointment.time || '',
        booked: appointment.booked || false,
        day: new Date(appointmentDate).toLocaleDateString('es-ES', { weekday: 'long' })
      };
    });

    return NextResponse.json({ schedules });
  } catch (error) {
    console.error('Error al obtener los horarios:', error);
    // En caso de error, generamos horarios de ejemplo
    const date = new URL(request.url).searchParams.get('date');
    if (date) {
      const exampleSlots = generateExampleSlots(date);
      return NextResponse.json({ schedules: exampleSlots });
    }
    return NextResponse.json(
      { error: 'Error al obtener los horarios disponibles' },
      { status: 500 }
    );
  }
}

// Función para generar horarios de ejemplo
function generateExampleSlots(date: string) {
  const slots = [];
  const startTime = 9; // 9 AM
  const endTime = 18; // 6 PM
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  
  // Crear slots de 1 hora
  for (let hour = startTime; hour < endTime; hour++) {
    slots.push({
      id: hour * 100, // Formato: 900, 1000, etc.
      date: date,
      day: days[new Date(date).getDay()],
      time: `${hour.toString().padStart(2, '0')}:00`,
      booked: false
    });
  }
  
  return slots;
}

// POST /api/appointments
export async function POST(request: Request) {
  try {
    console.log('POST /api/appointments - Starting request processing');
    const body = await request.json();
    console.log('POST /api/appointments - Request body:', body);
    
    const {
      customer_email,
      customer_name,
      notes,
      service,
      doctor,
      schedule_id,
      date
    } = body;

    // Validar campos requeridos
    if (!customer_email || !customer_name || !service || !doctor || !schedule_id || !date) {
      console.log('POST /api/appointments - Missing required fields:', {
        customer_email: !!customer_email,
        customer_name: !!customer_name,
        service: !!service,
        doctor: !!doctor,
        schedule_id: !!schedule_id,
        date: !!date
      });
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de fecha
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      console.log('POST /api/appointments - Invalid date format:', date);
      return NextResponse.json(
        { error: 'Formato de fecha inválido. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Validar que schedule_id sea un número válido
    const numericScheduleId = Number(schedule_id);
    if (isNaN(numericScheduleId)) {
      console.log('POST /api/appointments - Invalid schedule_id:', schedule_id);
      return NextResponse.json(
        { error: 'El ID del horario debe ser un número válido' },
        { status: 400 }
      );
    }

    // Generar los horarios disponibles para la fecha
    const availableSlots = generateExampleSlots(date);
    const selectedSlot = availableSlots.find(slot => slot.id === numericScheduleId);

    if (!selectedSlot) {
      console.log('POST /api/appointments - Selected slot not found:', {
        schedule_id: numericScheduleId,
        availableSlots: availableSlots.map(s => s.id)
      });
      return NextResponse.json(
        { error: 'El horario seleccionado no existe' },
        { status: 400 }
      );
    }

    // Verificar si ya existe una reserva para este horario
    console.log('POST /api/appointments - Checking for existing booking:', {
      schedule_id: numericScheduleId,
      date
    });

    const { data: existingBooking, error: bookingError } = await supabase
      .from('bookingdentis')
      .select('*')
      .eq('schedule_id', numericScheduleId)
      .eq('date', date)
      .single();

    if (bookingError && bookingError.code !== 'PGRST116') {
      console.error('POST /api/appointments - Error checking existing booking:', bookingError);
      return NextResponse.json(
        { error: 'Error al verificar disponibilidad del horario' },
        { status: 500 }
      );
    }

    if (existingBooking) {
      console.log('POST /api/appointments - Slot is already booked:', existingBooking);
      return NextResponse.json(
        { error: 'El horario seleccionado ya está reservado' },
        { status: 400 }
      );
    }

    // Crear la nueva reserva
    const bookingData = {
      schedule_id: numericScheduleId,
      date,
      time: selectedSlot.time,
      customer_email,
      customer_name,
      notes: notes || '',
      service,
      doctor,
      booked: true,
      guests: '1'
    };

    console.log('POST /api/appointments - Creating new booking with data:', bookingData);

    // Primero intentamos insertar sin select
    const { error: insertError } = await supabase
      .from('bookingdentis')
      .insert(bookingData);

    if (insertError) {
      console.error('POST /api/appointments - Error creating booking:', insertError);
      return NextResponse.json(
        { 
          error: 'Error al crear la reserva',
          details: insertError.message,
          code: insertError.code,
          hint: insertError.hint
        },
        { status: 500 }
      );
    }

    // Si la inserción fue exitosa, obtenemos el registro creado
    const { data: newBooking, error: selectError } = await supabase
      .from('bookingdentis')
      .select('*')
      .eq('schedule_id', numericScheduleId)
      .eq('date', date)
      .single();

    if (selectError) {
      console.error('POST /api/appointments - Error selecting new booking:', selectError);
      return NextResponse.json(
        { 
          error: 'Error al obtener los datos de la reserva',
          details: selectError.message
        },
        { status: 500 }
      );
    }

    if (!newBooking) {
      console.error('POST /api/appointments - No booking data returned after insert');
      return NextResponse.json(
        { error: 'Error al crear la reserva: No se recibieron datos de confirmación' },
        { status: 500 }
      );
    }

    console.log('POST /api/appointments - Successfully created booking:', newBooking);

    // Enviar email de confirmación
    try {
      const emailResult = await sendEmail({
        to: customer_email,
        subject: 'Confirmación de Cita Dental',
        text: `Estimado/a ${customer_name},\n\nSu cita dental ha sido reservada exitosamente.\n\nDetalles de la cita:\nFecha: ${date}\nHora: ${selectedSlot.time}\nServicio: ${service}\nDoctor: ${doctor}\n\n${notes ? `Notas: ${notes}\n\n` : ''}¡Esperamos su visita!`,
        html: `
          <h2>Confirmación de Cita Dental</h2>
          <p>Estimado/a ${customer_name},</p>
          <p>Su cita dental ha sido reservada exitosamente.</p>
          <h3>Detalles de la cita:</h3>
          <ul>
            <li><strong>Fecha:</strong> ${date}</li>
            <li><strong>Hora:</strong> ${selectedSlot.time}</li>
            <li><strong>Servicio:</strong> ${service}</li>
            <li><strong>Doctor:</strong> ${doctor}</li>
            ${notes ? `<li><strong>Notas:</strong> ${notes}</li>` : ''}
          </ul>
          <p>¡Esperamos su visita!</p>
        `
      });

      if (!emailResult.success) {
        console.error('Error sending confirmation email:', emailResult.error);
        // No retornamos error al cliente si falla el email
      } else {
        console.log('POST /api/appointments - Confirmation email sent successfully');
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // No retornamos error al cliente si falla el email
    }

    return NextResponse.json(
      { 
        message: 'Cita reservada exitosamente',
        appointment: {
          id: newBooking.id,
          customer_email,
          customer_name,
          notes,
          service,
          doctor,
          date,
          time: selectedSlot.time,
          booked: true
        }
      },
      { 
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error al crear la cita:', error);
    return NextResponse.json(
      { 
        error: 'Error al crear la cita',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Delete appointment request
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get("id");
    const customerEmail = searchParams.get("customer_email");

    if (!appointmentId || !customerEmail) {
      return NextResponse.json(
        { success: false, message: "Appointment ID and Customer Email are required." },
        { status: 400 }
      );
    }

    // Delete appointment
    const { data, error } = await supabase
      .from("bookingsrestorant")
      .delete()
      .eq("id", appointmentId)
      .eq("customer_email", customerEmail)
      .select("*");

    const count = data ? data.length : 0;

    if (error) {
      console.error("Error deleting appointment:", error.message);
      return NextResponse.json(
        { success: false, message: "Error deleting appointment.", error: error.message },
        { status: 400 }
      );
    }

    if (count === 0) {
      return NextResponse.json(
        { success: false, message: "No appointment found with the provided ID and email." },
        { status: 404 }
      );
    }

    // Send email notification
    const emailResponse = await sendEmail({
      to: customerEmail,
      subject: "Your Appointment Has Been Cancelled",
      text: `Hello,\n\nYour appointment (ID: ${appointmentId}) has been successfully cancelled. If this was a mistake, please contact us to reschedule.\n\nBest regards,\nYour Company Name`
    });

    if (!emailResponse.success) {
      console.error("Error sending cancellation email:", emailResponse.error);
    }

    return NextResponse.json(
      { success: true, message: "Appointment deleted successfully. Email sent.", deletedAppointment: data },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error deleting appointment:", err);
    return NextResponse.json(
      { success: false, message: "Unexpected error occurred.", error: err },
      { status: 500 }
    );
  }
}

// Updating appointment
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get("id");
    const customerEmail = searchParams.get("customer_email");

    if (!appointmentId || !customerEmail) {
      return NextResponse.json(
        { success: false, message: "Appointment ID and Customer Email are required." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updateFields: Partial<Record<"service" | "notes", string>> = {};
    if (body.service) updateFields.service = body.service;
    if (body.notes) updateFields.notes = body.notes;

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { success: false, message: "Only 'service' or 'notes' can be updated." },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("bookingsrestorant")
      .update(updateFields)
      .eq("id", appointmentId)
      .eq("customer_email", customerEmail);

    if (updateError) {
      return NextResponse.json(
        { success: false, message: "Error updating appointment.", error: updateError.message },
        { status: 400 }
      );
    }

    const emailSubject = "Your Appointment Has Been Updated";
    const emailText = `
      Hello, your appointment has been successfully updated.\n
      ${body.service ? `Service: ${body.service}` : ""}
      ${body.notes ? `Notes: ${body.notes}` : ""}
      \nThank you!
    `;

    const emailResponse = await sendEmail({
      to: customerEmail,
      subject: emailSubject,
      text: emailText
    });

    if (!emailResponse.success) {
      console.error("Email sending failed:", emailResponse.error);
    }

    return NextResponse.json(
      { success: true, message: "Appointment updated successfully. Notification sent!" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Unexpected error occurred.", error: String(err) },
      { status: 500 }
    );
  }
}