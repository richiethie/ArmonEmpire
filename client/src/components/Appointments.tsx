import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const Appointments = () => {
  // All appointments are stored here
  const [appointments, setAppointments] = useState<any[]>([]);
  // Controlled Calendar date state
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  // Filter date; when null, no filtering is applied and all appointments are shown
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  useEffect(() => {
    // Fetch upcoming appointments from API
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/appointments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        // 1. Compute start of today (midnight)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        console.log("Fetched appointments:", response.data);
  
        // 2. Keep only appointments >= today
        const futureAppointments = response.data.filter((appointment: any) => {
          return new Date(appointment.datetime) >= today && appointment.status !== 'Canceled';
        });
  
        setAppointments(futureAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
  
    fetchAppointments();
  }, []);  

  // Helper to check if a given date (from Calendar) has one or more appointments
  const hasAppointment = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    return appointments.some((appointment) => {
      const appointmentDate = new Date(appointment.datetime);
      return appointmentDate.toISOString().split('T')[0] === dateStr;
    });
  };

  // Determine which appointments to display:
  // When filterDate is set, filter appointments by that date. When null, show all.
  const appointmentsToDisplay = filterDate
    ? appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.datetime);
        return appointmentDate.toISOString().split('T')[0] === filterDate.toISOString().split('T')[0];
      })
    : appointments;

  return (
    <div className="rounded-lg bg-[#1b1f23] text-white p-6 flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
        <Calendar
            className="rounded-lg text-black bg-gray-800 p-1"
            value={calendarDate}
            onChange={(value, event) => {
                const selectedDate = Array.isArray(value) ? value[0] : value;
                if (selectedDate) {
                setCalendarDate(selectedDate);
                setFilterDate(selectedDate);
                }
            }}
            tileClassName={({ date, view }) => {
                let classes = "";
                // If the tile has an appointment, add our custom appointment tile class
                if (view === "month" && hasAppointment(date)) {
                classes += " appointment-tile";
                }
                // Check if the tile represents today's date
                const today = new Date();
                if (
                view === "month" &&
                date.toISOString().split("T")[0] === today.toISOString().split("T")[0]
                ) {
                classes += " today-tile";
                }
                return classes;
            }}
            tileDisabled={({ date, view }) => view === "month" && !hasAppointment(date)}
        />

      {/* Show a Clear Filter button when a filter date is applied */}
      {filterDate && (
        <button 
          className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          onClick={() => setFilterDate(null)}
        >
          Clear Date Filter
        </button>
      )}
      
      <div className="mt-6 text-gray-400 text-center">
        <h4 className="font-semibold text-lg border-b border-gray-400 mb-2">
          {filterDate ? `Selected appointment` : `Booked appointments`}
        </h4>
        <ul>
          {appointmentsToDisplay.length > 0 ? (
            appointmentsToDisplay.map((appointment, index) => {
                const apptDate = new Date(appointment.datetime);
                return (
                    <li key={index} className="my-3">
                        <p className="mr-4">
                            • {apptDate.toLocaleDateString('en-US', {
                                month: 'numeric',
                                day: 'numeric',
                                year: '2-digit',
                            })}{" @ "}
                            {apptDate.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                            })}
                        </p>
                        <p className=""> {appointment.service}</p>
                    </li>
                )
            })
          ) : (
            <p className="text-sm">No appointments are booked.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Appointments;
