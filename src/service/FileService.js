import axios from 'axios';
import { getToken } from '../security/Keycloak';

// eslint-disable-next-line no-undef
const FilePath = process.env.REACT_APP_API_URL + 'file';

export function importHarvestsFromFile(file, setError) {
  const formData = new FormData();
  formData.append('file', file);

  return axios
    .post(FilePath + '/harvests', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: getToken()
      }
    })
    .then((result) => result.data)
    .catch((error) => {
      setError(error.response.data.message);
    });
}

export function importSaleInvoicesFromFile(file, setError) {
  const formData = new FormData();
  formData.append('file', file);

  return axios
    .post(FilePath + '/sale-invoices', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: getToken()
      }
    })
    .then((result) => result.data)
    .catch((error) => {
      setError(error.response.data.message);
    });
}

export function exportExampleHarvestsFile(setError) {
  return axios
    .get(FilePath + '/harvests/example', {
      responseType: 'blob',
      headers: {
        Authorization: getToken()
      }
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'import-harvests-example.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      setError(error.response.data.message);
    });
}

export function exportExampleSaleInvoicesFile(setError) {
  return axios
    .get(FilePath + '/sale-invoices/example', {
      responseType: 'blob',
      headers: {
        Authorization: getToken()
      }
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'import-sale-invoices-example.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      setError(error.response.data.message);
    });
}

export function exportCropsInYearFile(setError, year) {
  return axios
    .get(FilePath + '/crops?year=' + year, {
      responseType: 'blob',
      headers: {
        Authorization: getToken()
      }
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'crops-' + year + '.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      setError(error.response.data.message);
    });
}

export function exportTransactionsToFile(setError, actionType, startDate, endDate) {
  return axios
    .get(
      FilePath +
        '/transactions?actionType=' +
        actionType +
        '&startDate=' +
        startDate +
        '&endDate=' +
        endDate,
      {
        responseType: 'blob',
        headers: {
          Authorization: getToken()
        },
        params: {}
      }
    )
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      setError(error.response.data.message);
    });
}
