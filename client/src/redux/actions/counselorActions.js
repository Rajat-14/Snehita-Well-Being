export const SELECT_COUNSELOR = 'SELECT_COUNSELOR';

export const selectCounselor = (counselorName) => ({
  type: SELECT_COUNSELOR,
  payload: counselorName,
});
