import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const Appointments = () => {
    //Change to Array of Appointment
    const [appointments, setAppointments] = useState<any[]>([]);
    const [date, setDate] = useState<Date>(new Date());

    useEffect(() => {
        // Fetch upcoming appointments from API
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/appointments`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setAppointments(response.data);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };

        fetchAppointments();
    }, []);

    // Helper function to check if a date has an appointment
    const hasAppointment = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
        return appointments.some((appointment) => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate.toISOString().split('T')[0] === dateStr;
        });
    };

    return (
        <div className="rounded-lg border border-white p-6 flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
            <Calendar
                className="rounded-lg text-black bg-gray-800 p-1"
                value={date}
                tileClassName={({ date, view }) => {
                    if (view === "month" && hasAppointment(date)) {
                        return "bg-green-500 text-white"; // Highlight appointments with green and white text
                    }
                    return "";
                }}
                tileDisabled={({ date, view }) => view === "month" && !hasAppointment(date)} // Disable tiles with no appointments
            />
            <div className="mt-6 text-gray-400">
                <h4 className="font-semibold text-lg">Appointments for {date.toLocaleDateString()}</h4>
                <ul>
                    {appointments
                        .filter((appointment) => {
                            const appointmentDate = new Date(appointment.date);
                            return appointmentDate.toISOString().split('T')[0] === date.toISOString().split('T')[0];
                        })
                        .map((appointment, index) => (
                            <li key={index} className="my-2">
                                <p>{appointment.time} - {appointment.service}</p>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default Appointments;
