import { APPOINTMENT_SUBMITTED, RESET_APPOINTMENT } from '../actions/actions';

const appointmentReducer = (state = false, action) => {
  switch (action.type) {
    case APPOINTMENT_SUBMITTED:
      return true;
    case RESET_APPOINTMENT:
      return false;
    default:
      return state;
  }
};

export default appointmentReducer;
