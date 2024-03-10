import React, { useContext, useEffect, useState } from 'react';
import MaterialTable from '@material-table/core';
import { Alert, AlertTitle, Collapse } from '@mui/material';
import Title from '../../../assets/styles/constants/Title';
import ErrorContext from '../../error/ErrorContext';
import { search_box, useStyles } from '../styles/Styles';
import {
  createInvoice,
  deleteInvoice,
  executeInvoice,
  getAllInvoices,
  updateInvoice
} from '../../../service/InvoiceService';
import { getAllHarvests } from '../../../service/HarvestService';
import { MenuItem, Select } from '@material-ui/core';
import Add from '../../Buttons/AddBtn/Add';
import CloseBtn from '../../Buttons/Close/CloseBtn';
import SaveBtn from '../../Buttons/Save/SaveBtn';
import { getRole } from '../../../security/Keycloak';
import { UserRoles } from '../../../models/UserRoles';
import { InvoiceStatuses } from '../../../models/InvoiceStatuses';
import EditBtn from '../../Buttons/Edit/EditBtn';
import DeleteBtn from '../../Buttons/Delete/DeleteBtn';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import InputIcon from '@material-ui/icons/Input';
import ApproveBtn from '../../Buttons/Approve/ApproveBtn';
import InvoicesFileUploader from './FileUploader/InvoicesFileUploader';
import ImportBtn from '../../Buttons/Import/ImportBtn';

const InvoicesPage = () => {
  const classes = useStyles();
  const [invoices, setInvoices] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [error, setError] = useContext(ErrorContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isImportSuccessful, setIsImportSuccessful] = useState(false);

  const handleOpenImportDialog = () => {
    setIsImportDialogOpen(true);
  };

  useEffect(() => {
    getInvoices();
    loadHarvests().then((result) => setHarvests(result));
    let timeout = setTimeout(() => {
      setError('');
      setIsImportSuccessful(false);
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [error, isImportSuccessful]);

  const columns = [
    {
      field: 'Id',
      defaultSort: 'id',
      hidden: true,
      sorting: true,
      customSort: (a, b) => b.id - a.id
    },
    {
      field: 'Harvest Id',
      defaultSort: 'harvestId',
      hidden: true
    },
    {
      title: 'Status',
      field: 'invoiceStatus',
      editable: 'never',
      render: (rowData) => {
        switch (rowData.invoiceStatus) {
          case InvoiceStatuses.PROCESSED:
            return <CheckCircleOutlineIcon style={{ color: 'green' }} />;
          case InvoiceStatuses.CREATED:
            return <InputIcon style={{ color: 'blue' }} />;
          default:
            return null; // или другая иконка/значение по умолчанию
        }
      }
    },
    {
      title: 'Harvest info',
      field: 'harvestInfo',
      editable: 'onAdd',
      editComponent: ({ value, onChange }) => (
        <Select value={value} onChange={(e) => onChange(e.target.value)} style={{ width: '100%' }}>
          {harvests.map((harvest) => (
            <MenuItem key={harvest.value} value={harvest.value}>
              {harvest.label}
            </MenuItem>
          ))}
        </Select>
      )
    },
    {
      title: 'Date of creation',
      field: 'creationDate',
      type: 'date',
      editable: 'never',
      render: (rowData) =>
        rowData.creationDate ? new Date(rowData.creationDate).toLocaleDateString() : undefined
    },
    {
      title: 'Date of completion',
      field: 'completionDate',
      editable: 'never',
      render: (rowData) =>
        rowData.completionDate ? new Date(rowData.completionDate).toLocaleDateString() : undefined
    },
    {
      title: 'Amount, centners',
      field: 'amount',
      editable: 'always',
      validate: (rowData) => {
        const amount = rowData.amount ? rowData.amount.toString() : '';
        if (amount.match(/^-?\d*(\.\d+)?$/)) {
          const parsed = parseFloat(amount);
          return !isNaN(parsed) && parsed >= 0 ? true : 'Amount must be a positive number';
        }
        return 'You should use only one dot and a number after dot';
      }
    },
    {
      title: 'Price per centner (UAH)',
      field: 'unitPrice',
      editable: 'always',
      validate: (rowData) => {
        const unitPrice = rowData.unitPrice ? rowData.unitPrice.toString() : '';
        if (unitPrice.match(/^-?\d*(\.\d+)?$/)) {
          const parsed = parseFloat(unitPrice);
          return !isNaN(parsed) && parsed >= 0 ? true : 'Price must be a positive number';
        }
        return 'You should use only one dot and a number after dot';
      }
    },
    {
      title: 'Description',
      field: 'description',
      editable: 'always'
    }
  ];

  const getInvoices = () => {
    getAllInvoices(setError).then((result) => {
      setInvoices(result);
      setIsLoading(false);
    });
  };

  const loadHarvests = () => {
    return new Promise((resolve) => {
      getAllHarvests(setError).then((harvests) => {
        resolve(
          harvests.map((harvest) => ({
            value: harvest.id,
            label: `${harvest.cropName}, ${harvest.monthAndYearOfCollection}`
          }))
        );
      });
    });
  };

  return (
    <>
      <Collapse in={error !== ''}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          <span style={{ whiteSpace: 'pre-line' }}>{error}</span>
        </Alert>
      </Collapse>
      <Collapse in={isImportSuccessful === true && error === ''}>
        <Alert severity="info">
          <AlertTitle>The invoices has been imported</AlertTitle>
        </Alert>
      </Collapse>
      <InvoicesFileUploader
        isDialogOpened={isImportDialogOpen}
        handleCloseDialog={() => setIsImportDialogOpen(false)}
        refreshInvoices={getInvoices}
        setLoading={setIsLoading}
        setIsImportSuccessful={setIsImportSuccessful}
      />
      <div className={classes.root}>
        <MaterialTable
          title={<Title text="Invoices" />}
          icons={{
            Edit: () => <EditBtn />,
            Add: () => <Add />,
            Clear: () => <CloseBtn />,
            Check: () => <SaveBtn />,
            Delete: () => <DeleteBtn />
          }}
          editable={{
            isDeleteHidden: (rowData) =>
              rowData.invoiceStatus === InvoiceStatuses.PROCESSED ||
              getRole() !== UserRoles.ACCOUNTANT,
            isEditHidden: (rowData) =>
              rowData.invoiceStatus === InvoiceStatuses.PROCESSED ||
              getRole() !== UserRoles.ACCOUNTANT,
            onRowAdd:
              getRole() === UserRoles.ACCOUNTANT
                ? (data) =>
                    createInvoice(
                      data.harvestInfo,
                      data.amount,
                      data.unitPrice,
                      data.description,
                      setError
                    ).then((invoice) => {
                      if (invoice !== undefined) {
                        setInvoices([...invoices, invoice]);
                      }
                    })
                : undefined,
            onRowDelete: (data) => {
              return deleteInvoice(data.id, setError).then(() => {
                setInvoices(invoices.filter((invoice) => invoice.id !== data.id));
              });
            },
            onRowUpdate: (data) => {
              return updateInvoice(
                data.id,
                data.harvestId,
                data.amount,
                data.unitPrice,
                data.description,
                setError
              ).then((updatedItem) => {
                const newInvoices = invoices.map((invoice) =>
                  invoice.id === data.id ? { ...invoice, ...updatedItem } : invoice
                );
                setInvoices(newInvoices);
              });
            }
          }}
          actions={[
            (rowData) => {
              return {
                icon: () => <ApproveBtn />,
                tooltip: 'Approve invoice',
                hidden:
                  getRole() === UserRoles.ACCOUNTANT ||
                  rowData.invoiceStatus === InvoiceStatuses.PROCESSED,
                onClick: (event, rowData) => {
                  if (
                    window.confirm('Are you sure you shipped the correct item for this invoice?')
                  ) {
                    executeInvoice(rowData.id, setError).then((updatedItem) => {
                      const newInvoices = invoices.map((invoice) =>
                        invoice.id === rowData.id ? { ...invoice, ...updatedItem } : invoice
                      );
                      setInvoices(newInvoices);
                    });
                  }
                }
              };
            },
            {
              hidden: getRole() !== UserRoles.ACCOUNTANT,
              icon: () => <ImportBtn />,
              tooltip: 'Import invoices from .xlsx file',
              onClick: () => handleOpenImportDialog(),
              isFreeAction: true
            }
          ]}
          columns={columns}
          isLoading={isLoading}
          data={invoices}
          options={{
            draggable: false,
            search: true,
            exportAllData: true,
            addRowPosition: 'first',
            actionsColumnIndex: -1,
            exportFileName: 'TableData',
            paging: true,
            pageSize: 20,
            paginationAlignment: 'left',
            searchFieldVariant: 'outlined',
            showFirstLastPageButtons: false,
            emptyRowsWhenPaging: false,
            searchAutoFocus: false,
            searchFieldStyle: search_box,
            headerStyle: {
              backgroundColor: '#FBFCFE',
              fontWeight: '400',
              color: '#585E74',
              lineHeight: '19px',
              fontSize: '14px',
              padding: '16px 20px'
            }
          }}
          style={{
            width: '95%',
            height: 'max-content',
            boxShadow: '0px 8px 16px rgba(0, 43, 159, 0.04)',
            marginLeft: '24px',
            marginTop: '24px',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px'
          }}></MaterialTable>
      </div>
    </>
  );
};
export default InvoicesPage;
