import { getToken } from '../security/Keycloak';
import axios from 'axios';

// eslint-disable-next-line no-undef
const UserPath = process.env.REACT_APP_API_URL + 'users';

export function getAllUsers(search, setError) {
  return axios
    .get(UserPath + '/' + '?search=' + search, {
      headers: {
        authorization: getToken()
      }
    })
    .then((result) => result.data)
    .catch((error) => {
      setError(error.response.data.message);
    });
}

export function getUnassignedUsers(search, setError) {
  return axios
    .get(UserPath + '/unassigned-users?search=' + search, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: getToken()
      }
    })
    .then((result) => result.data)
    .catch((error) => {
      setError(error.response.data.message);
    });
}

export function assignRoleToUser(username, role, setError) {
  const userData = { username, role };
  return axios
    .post(UserPath + '/assign-role', userData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: getToken()
      }
    })
    .then((result) => result.data)
    .catch((error) => {
      setError(error.response.data.message);
    });
}

export function deactivateUser(username, setError) {
  return axios
    .delete(UserPath + '/delete/' + username, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: getToken()
      }
    })
    .then((result) => result.data)
    .catch((error) => {
      setError(error.response.data.message);
    });
}
