import { fetchSalesforceConnection, setSalesforceConnection } from '../services/salesforceConnection';

export const fetchSalesforceConnectionAction = () => {
  return (dispatch) => {
    dispatch(fetchSalesforceConnection());
  };
};

export const setSalesforceConnectionAction = (instanceUrl, accessToken) => {
  return (dispatch) => {
    dispatch(setSalesforceConnection(instanceUrl, accessToken));
  };
};
