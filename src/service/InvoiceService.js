import axios from 'axios';
import { getToken } from '../security/Keycloak';

const InvoicePath = process.env.REACT_APP_API_URL + 'sale-invoices';

export function getAllInvoices(setError) {
  return axios
    .get(InvoicePath, {
      headers: {
        authorization: getToken()
      }
    })
    .then((result) => result.data)
    .catch((error) => {
      setError(error.response.data.message);
    });
}

export function createInvoice(harvestId, amount, unitPrice, description, setError) {
  const invoiceData = { harvestId, amount, unitPrice, description };
  return axios
    .post(InvoicePath + '/create', invoiceData, {
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

export function deleteInvoice(invoiceId, setError) {
  return axios
    .delete(InvoicePath + '/delete/' + invoiceId, {
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

export function updateInvoice(id, harvestId, amount, unitPrice, description, setError) {
  const updateInvoiceData = { harvestId, amount, unitPrice, description };
  return axios
    .patch(InvoicePath + '/update/' + id, updateInvoiceData, {
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

export function executeInvoice(id, setError) {
  return axios
    .patch(
      InvoicePath + '/execute/' + id,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getToken()
        }
      }
    )
    .then((result) => result.data)
    .catch((error) => {
      setError(error.response.data.message);
    });
}
