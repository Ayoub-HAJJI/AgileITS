const initialState = null;

export const salesforceConnectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SALESFORCE_CONNECTION':
      return action.payload;
    default:
      return state;
  }
};
