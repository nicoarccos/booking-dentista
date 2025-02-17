"use client";
import { useState, useEffect } from 'react';
import SlotGrid from './SlotGrid'; // Adjust the path based on your project structure

interface AvailableSlot {
  id: number;
  date: string;
  day: string;
  time_slot: string;
  booked: boolean;
}

interface AddAppointmentProps {
  selectedDate: string; // Receive the selected date from the calendar component
}

const AddAppointment: React.FC<AddAppointmentProps> = ({ selectedDate }) => {
  const [customer_email, setCustomerEmail] = useState('');
  const [customer_name, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [service, setService] = useState('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);

  // Fetch available slots for the selected date
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate) return; // Don't fetch if there's no selected date

      try {
        const response = await fetch(`/api/appointments?date=${selectedDate}`);
        const result = await response.json();

        if (response.ok) {
          setAvailableSlots(result.schedules || []);
        } else {
          console.error('Error fetching available slots:', result.error);
          setAvailableSlots([]);
        }
      } catch (error) {
        console.error('Unexpected error fetching available slots:', error);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate]);

  const handleSubmit = async () => {
    if (!selectedSlot) {
      alert('Please select a time slot!');
      return;
    }

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_email,
          customer_name,
          notes,
          service,
          schedule_id: selectedSlot.id, // Include the selected slot ID
        }),
      });

      const result = await response.json();
      setResponseMessage(result.message);

      if (response.ok) {
        console.log('Appointment added successfully:', result.data);
        alert('Appointment added successfully');
        setAvailableSlots((prev) =>
          prev.map((slot) =>
            slot.id === selectedSlot.id ? { ...slot, booked: true } : slot
          )
        );
      } else {
        console.error('Error adding appointment:', result.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setResponseMessage('Unexpected error occurred.');
    }
  };

  return (
    <div>
      <h1>Complete the following information to make an appointment</h1>
      <div>
        <label>
          Customer Email:
          <input
            type="email"
            value={customer_email}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="Enter customer email"
          />
        </label>
      </div>
      <div>
        <label>
          Customer Name:
          <input
            type="text"
            value={customer_name}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
          />
        </label>
      </div>
      <div>
        <label>
          Notes:
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter any notes (optional)"
          />
        </label>
      </div>
      <div>
        <label>
          Service:
          <input
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="Enter service"
          />
        </label>
      </div>

      <div>
        <h2>Available Slots for {selectedDate}</h2>
        <SlotGrid
          slots={availableSlots} // Pass available slots to SlotGrid
          selectedSlot={selectedSlot}
          onSelectSlot={(slot) => setSelectedSlot(slot)}
        />
      </div>

      <button onClick={handleSubmit}>Add Appointment</button>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default AddAppointment;
