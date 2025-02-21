"use client";

import { useState } from "react";

const UpdateAppointment = () => {
  const [appointmentId, setAppointmentId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    setLoading(true);
    setMessage("");

    if (!appointmentId || !customerEmail || !date || !time || !description) {
      setMessage("❌ All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/update-appointment?id=${appointmentId}&customer_email=${customerEmail}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date, time, description }),
        }
      );

      const result = await response.json();
      if (result.success) {
        setMessage("✅ Appointment updated successfully!");
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`❌ ${error.message}`);
      } else {
        setMessage("❌ An unexpected error occurred.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center text-primary mb-4">
        Update Appointment
      </h2>

      <div className="space-y-4">
        {/* Appointment ID */}
        <input
          type="text"
          placeholder="Appointment ID"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-primary"
        />

        {/* Customer Email */}
        <input
          type="email"
          placeholder="Customer Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-primary"
        />

        {/* Date Picker */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-primary"
        />

        {/* Time Picker */}
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-primary"
        />

        {/* Description */}
        <textarea
          placeholder="Describe the service required..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-primary h-24"
        />

        {/* Submit Button */}
        <button
          onClick={handleUpdate}
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Appointment"}
        </button>

        {/* Status Message */}
        {message && (
          <p className={`text-center mt-2 ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default UpdateAppointment;
