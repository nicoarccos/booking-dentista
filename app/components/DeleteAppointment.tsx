"use client";

"use client";

import { useState } from "react";

const DeleteAppointment = () => {
  const [appointmentId, setAppointmentId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!appointmentId || !customerEmail) {
      setResponseMessage("Please provide both appointment ID and customer email.");
      return;
    }

    setIsLoading(true);
    setResponseMessage("");

    try {
      // First, PATCH the 'booked' field to false
      const patchResponse = await fetch(`/api/appointments?id=${appointmentId}&customer_email=${customerEmail}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ booked: false }),
      });

      const patchResult = await patchResponse.json();

      if (!patchResponse.ok) {
        setResponseMessage(`Error updating appointment: ${patchResult.message}`);
        setIsLoading(false);
        return;
      }

      // Now DELETE the appointment from the table
      const deleteResponse = await fetch(`/api/appointments?id=${appointmentId}&customer_email=${customerEmail}`, {
        method: "DELETE",
      });

      const deleteResult = await deleteResponse.json();

      if (!deleteResponse.ok) {
        setResponseMessage(`Error deleting appointment: ${deleteResult.message}`);
        setIsLoading(false);
        return;
      }

      setResponseMessage("Appointment deleted successfully!");

      // Clear form fields and remove the message after 4 seconds
      setTimeout(() => {
        setResponseMessage("");
        setAppointmentId("");
        setCustomerEmail("");
      }, 4000); // 4 seconds
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while deleting the appointment.";
      setResponseMessage(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-fuchsia-600">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full">
        <h2 className="text-2xl font-semibold text-center text-purple-700 mb-6">Delete Appointment</h2>

        <div className="mb-4">
          <label htmlFor="appointmentId" className="block text-sm font-medium text-gray-700">
            Appointment ID
          </label>
          <input
            id="appointmentId"
            type="text"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
            className="w-full p-3 mt-1 border rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter Appointment ID"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">
            Customer Email
          </label>
          <input
            id="customerEmail"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full p-3 mt-1 border rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter Customer Email"
          />
        </div>

        <button
          onClick={handleDelete}
          disabled={isLoading}
          className={`w-full py-3 text-white font-semibold rounded-md shadow-lg ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
          } transition duration-200`}
        >
          {isLoading ? "Deleting..." : "Delete Appointment"}
        </button>

        {responseMessage && (
          <div className="mt-4 text-center text-sm">
            <div
              className={`p-2 rounded-lg text-sm ${
                responseMessage.includes("Error") ? "bg-red-500" : "bg-green-500"
              } text-white shadow-md`}
            >
              {responseMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAppointment;
