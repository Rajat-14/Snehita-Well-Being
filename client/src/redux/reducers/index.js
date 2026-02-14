import { combineReducers } from 'redux';
import counselorReducer from './counselorReducer';
import appointmentReducer from './appointmentReducer';

const rootReducer = combineReducers({
  counselorName: counselorReducer,
  appointmentSubmitted: appointmentReducer,
});

export default rootReducer;
