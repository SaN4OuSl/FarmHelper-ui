import axios from 'axios';
import { getToken } from '../security/Keycloak';

const TransactionPath = process.env.REACT_APP_API_URL + 'transactions';

export function getAllTransactions(setError) {
  return axios
    .get(TransactionPath + '?search=', {
      headers: {
        authorization: getToken()
      }
    })
    .then((result) => result.data)
    .catch((error) => {
      setError(error.response.data.message);
    });
}
