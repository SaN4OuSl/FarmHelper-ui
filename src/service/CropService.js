import { getToken } from '../security/Keycloak';
import axios from 'axios';

// eslint-disable-next-line no-undef
const CropPath = process.env.REACT_APP_API_URL + 'crops';

export function getAllCrops(search, setError) {
  return axios
    .get(CropPath + '?search=' + search, {
      headers: {
        'Content-Type': 'application/json',
        authorization: getToken()
      }
    })
    .then((result) => result.data)
    .catch((error) => {
      setError(error.response.data.message);
    });
}

export function deleteCrop(cropId, setError) {
  return axios
    .delete(CropPath + '/delete/' + cropId, {
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

export function createCrop(name, description, setError) {
  const addCropData = { name, description };
  return axios
    .post(CropPath + '/create', addCropData, {
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

export function updateCrop(id, name, description, setError) {
  const updateCropData = { name, description };
  return axios
    .patch(CropPath + '/update/' + id, updateCropData, {
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
