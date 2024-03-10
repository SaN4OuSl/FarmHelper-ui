import axios from 'axios';
import { getToken } from '../security/Keycloak';

const FieldPath = process.env.REACT_APP_API_URL + 'fields';

export function createField(fieldName, coordinates, fieldSize, soilType, setError) {
  const addFieldData = { fieldName, coordinates, fieldSize, soilType };
  return axios
    .post(FieldPath + '/create', addFieldData, {
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

export function updateField(id, fieldName, coordinates, fieldSize, soilType, setError) {
  const updateFieldData = { id, fieldName, coordinates, fieldSize, soilType };
  return axios
    .patch(FieldPath + '/update', updateFieldData, {
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

export function getFieldById(fieldId, setError) {
  return axios
    .get(FieldPath + '/' + fieldId, {
      headers: {
        authorization: getToken()
      }
    })
    .then((result) => result.data)
    .catch((error) => {
      setError(error.response.data.message);
    });
}

export function getCurrentFields(search, setError) {
  return axios
    .get(FieldPath + '/get-current-fields?search=' + search, {
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

export function deactivateFarm(id, setError) {
  return axios
    .delete(FieldPath + '/delete/' + id, {
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
