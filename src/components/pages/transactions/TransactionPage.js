import React, { useContext, useEffect, useState } from 'react';
import MaterialTable from '@material-table/core';
import { Alert, AlertTitle, Collapse } from '@mui/material';
import Title from '../../../assets/styles/constants/Title';
import ErrorContext from '../../error/ErrorContext';
import { search_box, useStyles } from '../styles/Styles';
import { getAllTransactions } from '../../../service/TransactionService';
import { TransactionTypes } from '../../../models/ActionTypes';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import SalesIcon from '@material-ui/icons/MonetizationOn';
import ExportTransactionsDialog from './ExportTransactions/ExportTransactionsDialog';
import { getRole } from '../../../security/Keycloak';
import { UserRoles } from '../../../models/UserRoles';
import ExportBtn from '../../Buttons/Export/ExportBtn';

const TransactionPage = () => {
  const classes = useStyles();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useContext(ErrorContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const handleOpenExportDialog = () => {
    setIsExportDialogOpen(true);
  };

  useEffect(() => {
    getTransactions();
    let timeout = setTimeout(() => {
      setError('');
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const columns = [
    {
      field: 'Id',
      defaultSort: 'id',
      hidden: true,
      sorting: true,
      customSort: (a, b) => b.id - a.id
    },
    {
      title: 'Action type',
      field: 'actionType',
      editable: 'never',
      render: (rowData) => {
        let icon;
        switch (rowData.actionType) {
          case TransactionTypes.ADD:
            icon = <AddCircleOutlineIcon style={{ color: 'green' }} />;
            break;
          case TransactionTypes.WRITE_OFF:
            icon = <RemoveCircleOutlineIcon style={{ color: 'red' }} />;
            break;
          case TransactionTypes.SALE:
            icon = <SalesIcon style={{ color: 'blue' }} />;
            break;
        }
        return <span>{icon}</span>;
      }
    },
    {
      title: 'Crop name',
      field: 'cropName',
      type: 'date',
      editable: 'never'
    },
    {
      title: 'Month and year of Collection',
      field: 'monthAndYearOfCollection',
      editable: 'never'
    },
    {
      title: 'User info',
      field: 'userInfo',
      editable: 'never'
    },
    {
      title: 'Amount in transaction, centners',
      field: 'amountInOperation',
      editable: 'never'
    },
    {
      title: 'Amount after transaction, centners',
      field: 'amountAfterAction',
      editable: 'never'
    },
    {
      title: 'Date of transaction',
      field: 'dateOfTransaction',
      editable: 'never',
      render: (rowData) =>
        rowData.dateOfTransaction
          ? new Date(rowData.dateOfTransaction).toLocaleDateString()
          : undefined
    },
    {
      title: 'Price per centner (UAH)',
      field: 'transactionPrice',
      editable: 'never',
      render: (rowData) =>
        rowData.transactionPrice !== null ? rowData.transactionPrice : undefined
    },
    {
      title: 'Explanation',
      field: 'explanation',
      editable: 'never',
      render: (rowData) => (rowData.explanation !== null ? rowData.explanation : undefined)
    }
  ];

  const getTransactions = () => {
    getAllTransactions(setError).then((result) => {
      setTransactions(result);
      setIsLoading(false);
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
      <ExportTransactionsDialog
        isDialogOpened={isExportDialogOpen}
        handleClose={() => setIsExportDialogOpen(false)}></ExportTransactionsDialog>
      <div className={classes.root}>
        <MaterialTable
          title={<Title text="Transactions" />}
          columns={columns}
          isLoading={isLoading}
          data={transactions}
          options={{
            draggable: false,
            exportAllData: true,
            addRowPosition: 'first',
            actionsColumnIndex: -1,
            exportFileName: 'TableData',
            search: true,
            searchFieldVariant: 'outlined',
            searchAutoFocus: false,
            paging: true,
            pageSize: 20,
            paginationAlignment: 'left',
            showFirstLastPageButtons: false,
            emptyRowsWhenPaging: false,
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
          }}
          actions={[
            {
              hidden: getRole() !== UserRoles.ACCOUNTANT,
              icon: () => <ExportBtn />,
              onClick: () => handleOpenExportDialog(),
              tooltip: 'Export transaction to an .xlsx file',
              isFreeAction: true
            }
          ]}></MaterialTable>
      </div>
    </>
  );
};
export default TransactionPage;
