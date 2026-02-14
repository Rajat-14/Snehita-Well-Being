export const APPOINTMENT_SUBMITTED = 'APPOINTMENT_SUBMITTED';
export const RESET_APPOINTMENT = 'RESET_APPOINTMENT';

export const appointmentSubmitted = () => ({
  type: APPOINTMENT_SUBMITTED,
});

export const resetAppointment = () => ({
  type: RESET_APPOINTMENT,
});
