export interface Appointment {
    acuityAppointmentId: string;
    datetime: Date;
    service: string;
    duration: number;
    createdAt: Date;
    status: string;
}