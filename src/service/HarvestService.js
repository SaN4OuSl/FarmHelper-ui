import axios from 'axios';
import { getToken } from '../security/Keycloak';

const HarvestPath = process.env.REACT_APP_API_URL + 'harvests';

export function getAllHarvestsOfCrop(cropId, search, setError) {
  return axios
    .get(HarvestPath + '/' + cropId + '?search=' + search, {
      headers: {
        authorization: getToken()
      }
    })
    .then((result) => result.data)
    .catch((error) => {
      setError(error.response.data.message);
    });
}

export function getAllHarvests(setError) {
  return axios
    .get(HarvestPath, {
      headers: {
        authorization: getToken()
      }
    })
    .then((result) => result.data)
    .catch((error) => {
      setError(error.response.data.message);
    });
}

export function createHarvest(cropId, amount, monthAndYearOfCollection, fieldIds, setError) {
  const harvestData = { cropId, amount, monthAndYearOfCollection, fieldIds };
  return axios
    .post(HarvestPath + '/create', harvestData, {
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

export function writeOffAmountOfHarvest(id, amount, explanation, setError) {
  const harvestData = { id, amount, explanation };
  return axios
    .patch(HarvestPath + '/write-off-amount', harvestData, {
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

export function addAmountToExistedHarvest(id, amount, fieldIds, setError) {
  const harvestData = { id, amount, fieldIds };
  return axios
    .patch(HarvestPath + '/add-amount', harvestData, {
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
