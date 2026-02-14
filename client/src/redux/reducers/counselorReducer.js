import { SELECT_COUNSELOR } from '../actions/counselorActions';

const initialState = '';

const counselorReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_COUNSELOR:
      return action.payload;
    default:
      return state;
  }
};

export default counselorReducer;
