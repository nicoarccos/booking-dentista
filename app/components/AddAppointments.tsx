"use client";
import { useState, useEffect } from "react";
import { AvailableSlot, TimeSlot } from "./types";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
}

interface Service {
  id: number;
  name: string;
  duration: number;
  price: string;
  description: string;
}

interface AddAppointmentProps {
  selectedDate: string;
}

const AddAppointment: React.FC<AddAppointmentProps> = ({ selectedDate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customer_email, setCustomerEmail] = useState("");
  const [customer_name, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [responseMessage, setResponseMessage] = useState<{ type: string; text: string } | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Servicios dentales disponibles
  const dentalServices: Service[] = [
    {
      id: 1,
      name: "Limpieza Dental",
      duration: 60,
      price: "$50",
      description: "Limpieza dental profesional y eliminación de sarro"
    },
    {
      id: 2,
      name: "Consulta General",
      duration: 30,
      price: "$30",
      description: "Evaluación general de la salud dental"
    },
    {
      id: 3,
      name: "Blanqueamiento",
      duration: 90,
      price: "$200",
      description: "Tratamiento de blanqueamiento dental profesional"
    },
    {
      id: 4,
      name: "Ortodoncia",
      duration: 45,
      price: "Consultar",
      description: "Consulta y tratamiento de ortodoncia"
    },
    {
      id: 5,
      name: "Endodoncia",
      duration: 120,
      price: "Consultar",
      description: "Tratamiento de conducto"
    }
  ];

  // Doctores disponibles
  const doctors: Doctor[] = [
    { id: 1, name: "Dr. Juan Pérez", specialty: "Odontología General" },
    { id: 2, name: "Dra. María García", specialty: "Ortodoncista" },
    { id: 3, name: "Dr. Carlos Rodríguez", specialty: "Endodoncista" },
    { id: 4, name: "Dra. Ana Martínez", specialty: "Odontopediatra" }
  ];

  const timeSlots: TimeSlot[] = [
    { time: '09:00', id: 900 },
    { time: '10:00', id: 1000 },
    { time: '11:00', id: 1100 },
    { time: '12:00', id: 1200 },
    { time: '13:00', id: 1300 },
    { time: '14:00', id: 1400 },
    { time: '15:00', id: 1500 },
    { time: '16:00', id: 1600 },
    { time: '17:00', id: 1700 }
  ];

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate) return;

      try {
        console.log('Fetching available slots for date:', selectedDate);
        const response = await fetch(`/api/appointments?date=${selectedDate}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Error response:', response.status, response.statusText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Received slots:', result);
        
        if (!result.schedules || !Array.isArray(result.schedules)) {
          console.log('No schedules found in response');
          setAvailableSlots([]);
          return;
        }

        // Convertir los IDs a números para asegurar la comparación correcta
        const processedSlots = result.schedules.map((slot: any) => ({
          ...slot,
          id: Number(slot.id)
        }));

        // Ordenar los slots por hora
        const sortedSlots = processedSlots.sort((a: AvailableSlot, b: AvailableSlot) => {
          if (!a.time_slot || !b.time_slot) return 0;
          
          const timeA = a.time_slot.split(':').map(Number);
          const timeB = b.time_slot.split(':').map(Number);
          
          if (timeA.length !== 2 || timeB.length !== 2) return 0;
          
          return timeA[0] - timeB[0] || timeA[1] - timeB[1];
        });
        
        console.log('Processed and sorted slots:', sortedSlots);
        setAvailableSlots(sortedSlots);
      } catch (error) {
        console.error("Error al obtener los horarios disponibles:", error);
        setAvailableSlots([]);
        setResponseMessage({
          type: 'error',
          text: error instanceof Error ? error.message : "Error al obtener los horarios disponibles"
        });
      }
    };

    fetchAvailableSlots();
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage({ type: '', text: '' });

    try {
      // Validar que todos los campos requeridos estén presentes
      if (!customer_email || !customer_name || !selectedService || !selectedDoctor || !selectedSlot || !selectedDate) {
        setResponseMessage({
          type: 'error',
          text: 'Por favor, complete todos los campos requeridos'
        });
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customer_email)) {
        setResponseMessage({
          type: 'error',
          text: 'Por favor, ingrese un email válido'
        });
        return;
      }

      // Validar que la fecha seleccionada no sea anterior a hoy
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDateObj = new Date(selectedDate);
      if (selectedDateObj < today) {
        setResponseMessage({
          type: 'error',
          text: 'No se pueden hacer reservas para fechas pasadas'
        });
        return;
      }

      // Validar que el horario seleccionado no sea anterior a la hora actual si es hoy
      if (selectedDateObj.getTime() === today.getTime()) {
        const now = new Date();
        const [hours, minutes] = selectedSlot.time_slot.split(':').map(Number);
        const selectedTime = new Date(selectedDateObj);
        selectedTime.setHours(hours, minutes, 0, 0);
        
        if (selectedTime < now) {
          setResponseMessage({
            type: 'error',
            text: 'No se pueden hacer reservas para horarios pasados'
          });
          return;
        }
      }

      // Formatear la fecha para el backend (YYYY-MM-DD)
      const formattedDate = selectedDateObj.toISOString().split('T')[0];
      console.log('Submitting appointment with data:', {
        customer_email,
        customer_name,
        service: selectedService,
        doctor: selectedDoctor,
        schedule_id: selectedSlot.id,
        date: formattedDate,
        notes
      });

      const appointmentData = {
        customer_email,
        customer_name,
        service: selectedService,
        doctor: selectedDoctor,
        schedule_id: selectedSlot.id,
        date: formattedDate,
        notes: notes || ''
      };

      console.log('Sending request to /api/appointments');
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('Error response from server:', data);
        throw new Error(data.error || 'Error al crear la reserva');
      }

      setResponseMessage({
        type: 'success',
        text: '¡Cita reservada exitosamente! Revisa tu email para más detalles.'
      });

      // Resetear el formulario
      setCustomerEmail('');
      setCustomerName('');
      setSelectedService('');
      setSelectedDoctor('');
      setNotes('');
      setSelectedSlot(null);
      setCurrentStep(1);
    } catch (error) {
      console.error('Error al crear la cita:', error);
      setResponseMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error al crear la reserva'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: "Información Personal" },
    { number: 2, title: "Servicio" },
    { number: 3, title: "Especialista" },
    { number: 4, title: "Horario" },
    { number: 5, title: "Confirmación" }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dental-gray-700 mb-2">Nombre completo</label>
                <input
                  type="text"
                  value={customer_name}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-4 bg-white border border-dental-gray-200 rounded-xl focus:ring-2 focus:ring-dental-primary/20 focus:border-dental-primary transition-all"
                  placeholder="Ingresa tu nombre"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dental-gray-700 mb-2">Correo electrónico</label>
                <input
                  type="email"
                  value={customer_email}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full p-4 bg-white border border-dental-gray-200 rounded-xl focus:ring-2 focus:ring-dental-primary/20 focus:border-dental-primary transition-all"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!customer_name || !customer_email}
                className="px-6 py-3 bg-dental-primary text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dental-primary/90 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              {dentalServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service.name)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedService === service.name
                      ? "border-dental-primary bg-dental-primary/5"
                      : "border-dental-gray-100 hover:border-dental-primary/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      selectedService === service.name
                        ? "bg-dental-primary text-white"
                        : "bg-dental-gray-100 text-dental-primary"
                    }`}>
                      {service.id === 1 && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {service.id === 2 && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      )}
                      {service.id === 3 && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      )}
                      {service.id === 4 && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {service.id === 5 && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2M7 7h10" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-dental-dark mb-1">{service.name}</h3>
                          <p className="text-dental-gray-600 text-sm mb-2">{service.description}</p>
                          <div className="flex items-center text-dental-gray-500 text-sm">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{service.duration} minutos</span>
                          </div>
                        </div>
                        <span className={`text-lg font-bold whitespace-nowrap ${
                          service.price === "Consultar" 
                            ? "text-dental-gray-500" 
                            : "text-dental-primary"
                        }`}>
                          {service.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 text-dental-gray-600 hover:text-dental-primary transition-colors"
              >
                Atrás
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!selectedService}
                className="px-6 py-3 bg-dental-primary text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dental-primary/90 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4">
              {doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => setSelectedDoctor(doctor.name)}
                  className={`p-6 rounded-xl border-2 transition-all w-full ${
                    selectedDoctor === doctor.name
                      ? "border-dental-primary bg-dental-primary/5"
                      : "border-dental-gray-100 hover:border-dental-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      selectedDoctor === doctor.name
                        ? "bg-dental-primary text-white"
                        : "bg-dental-primary/5 text-dental-primary"
                    }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="space-y-1">
                        <span className={`text-base font-medium block ${
                          selectedDoctor === doctor.name
                            ? "text-dental-primary"
                            : "text-dental-dark"
                        }`}>
                          {doctor.name}
                        </span>
                        <span className="text-sm text-dental-gray-500 block">
                          {doctor.specialty}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-dental-gray-500 flex-shrink-0">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Disponible</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 text-dental-gray-600 hover:text-dental-primary transition-colors"
              >
                Atrás
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                disabled={!selectedDoctor}
                className="px-6 py-3 bg-dental-primary text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dental-primary/90 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-body text-text-primary mb-2">Horarios Disponibles</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {timeSlots.map((slot) => {
                  // Convertir el ID a número para la comparación
                  const slotId = Number(slot.id);
                  const isAvailable = availableSlots.some(availableSlot => 
                    Number(availableSlot.id) === slotId && !availableSlot.booked
                  );
                  const isSelected = selectedSlot?.id === slotId;

                  return (
                    <button
                      key={slot.id}
                      onClick={() => isAvailable && setSelectedSlot({
                        id: slotId,
                        date: selectedDate,
                        day: new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long' }),
                        time_slot: slot.time,
                        booked: false
                      })}
                      disabled={!isAvailable}
                      className={`p-4 rounded-default border transition-all text-center ${
                        !isAvailable
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : isSelected
                            ? 'border-primary bg-background text-primary shadow-highlight'
                            : 'border-gray-200 hover:border-accent hover:bg-background/50'
                      }`}
                    >
                      {slot.time}
                      {!isAvailable && (
                        <span className="block text-xs text-gray-500 mt-1">Reservado</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 text-dental-gray-600 hover:text-dental-primary transition-colors"
              >
                Atrás
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                disabled={!selectedSlot}
                className="px-6 py-3 bg-dental-primary text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dental-primary/90 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-dental-gray-100 p-6">
              <h3 className="text-lg font-semibold text-dental-dark mb-4">Resumen de la Reserva</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-dental-gray-600">Fecha</p>
                  <p className="font-medium">{selectedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-dental-gray-600">Horario</p>
                  <p className="font-medium">{selectedSlot?.time_slot}</p>
                </div>
                <div>
                  <p className="text-sm text-dental-gray-600">Servicio</p>
                  <p className="font-medium">{selectedService}</p>
                </div>
                <div>
                  <p className="text-sm text-dental-gray-600">Especialista</p>
                  <p className="font-medium">{selectedDoctor}</p>
                </div>
                <div>
                  <p className="text-sm text-dental-gray-600">Nombre</p>
                  <p className="font-medium">{customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-dental-gray-600">Email</p>
                  <p className="font-medium">{customer_email}</p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dental-gray-700 mb-2">Notas adicionales</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="¿Alguna consideración especial que debamos tener en cuenta?"
                className="w-full p-4 bg-white border border-dental-gray-200 rounded-xl focus:ring-2 focus:ring-dental-primary/20 focus:border-dental-primary transition-all text-base"
                rows={3}
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 text-dental-gray-600 hover:text-dental-primary transition-colors"
              >
                Atrás
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-dental-primary text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dental-primary/90 transition-colors"
              >
                {isSubmitting ? "Confirmando..." : "Confirmar Reserva"}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const validateForm = () => {
    // Implementa la lógica para validar el formulario
    return true; // Cambia esto por la lógica real de validación
  };

  return (
    <div className="min-h-screen bg-dental-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Encabezado */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-dental-dark mb-3">
              Reserva tu Cita
            </h1>
            <p className="text-dental-gray-600 text-lg">
              Completa los pasos para agendar tu cita dental
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-16">
            <div className="flex justify-center relative">
              <div className="flex items-center">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                        currentStep >= step.number
                          ? "bg-dental-primary text-white shadow-md"
                          : "bg-dental-gray-100 text-dental-gray-400"
                      }`}>
                        {step.number}
                      </div>
                      <span className={`text-sm font-medium text-center whitespace-nowrap ${
                        currentStep >= step.number
                          ? "text-dental-primary"
                          : "text-dental-gray-400"
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 ${
                        currentStep > step.number
                          ? "bg-dental-primary"
                          : "bg-dental-gray-100"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contenido del paso actual */}
          <div className="mt-12">
            {renderStepContent()}
          </div>

          {/* Mensaje de respuesta */}
          {responseMessage && (
            <div className={`mt-8 p-4 rounded-xl text-center ${
              responseMessage.type === 'success'
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {responseMessage.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAppointment;
