'use client';

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/app/context/AuthContext'; // Import the AuthContext

interface Appointment {
  id: number;
  schedule_id: string;
  customer_name: string;
  customer_email: string;
  service: string;
  notes: string;
  date: string;
  time_slot: string;
}

const AppointmentsTable = () => {
  const { isLoggedIn } = useContext(AuthContext); // Access login status from context
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10; // Show 10 rows per page

  useEffect(() => {
    if (!isLoggedIn) {
      return; // Don't fetch appointments if not logged in
    }

    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/appointmentstable');
        const data = await response.json();
        setAppointments(data.reverse()); // Show latest appointments first
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [isLoggedIn]); // Fetch appointments if login status changes

  // If the user is not logged in, show a message
  if (!isLoggedIn) {
    return <p className="text-center text-red-500">Please log in to view your appointments.</p>;
  }

  // Calculate the current appointments to display
  const startIndex = currentPage * rowsPerPage;
  const currentAppointments = appointments.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-center">📅 Appointments</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-center text-red-500">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Schedule ID</th>
                <th className="py-2 px-4 text-left">Customer</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Service</th>
                <th className="py-2 px-4 text-left">Notes</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {currentAppointments.map((appt) => (
                <tr key={appt.id} className="border-b hover:bg-gray-100 transition">
                  <td className="py-2 px-4">{appt.id}</td>
                  <td className="py-2 px-4">{appt.schedule_id}</td>
                  <td className="py-2 px-4">{appt.customer_name}</td>
                  <td className="py-2 px-4">{appt.customer_email}</td>
                  <td className="py-2 px-4">{appt.service}</td>
                  <td className="py-2 px-4">{appt.notes || 'N/A'}</td>
                  <td className="py-2 px-4">{appt.date}</td>
                  <td className="py-2 px-4">{appt.time_slot}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              ◀ Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={startIndex + rowsPerPage >= appointments.length}
              className={`px-4 py-2 rounded-lg ${
                startIndex + rowsPerPage >= appointments.length
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Next ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsTable;
