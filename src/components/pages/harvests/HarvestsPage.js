import React, { useContext, useEffect, useState } from 'react';
import MaterialTable from '@material-table/core';
import { Alert, AlertTitle, Collapse } from '@mui/material';
import Add from '../../Buttons/AddBtn/Add';
import SaveBtn from '../../Buttons/Save/SaveBtn';
import CloseBtn from '../../Buttons/Close/CloseBtn';
import Title from '../../../assets/styles/constants/Title';
import ErrorContext from '../../error/ErrorContext';
import { search_box, useStyles } from '../styles/Styles';
import AsyncSelect from 'react-select/async';
import { getAllCrops } from '../../../service/CropService';
import { createHarvest, getAllHarvests } from '../../../service/HarvestService';
import { getCurrentFields } from '../../../service/FieldService';
import { TextField } from '@material-ui/core';
import WriteOffBtn from '../../Buttons/WriteOffBtn/WriteOffBtn';
import WriteOffHarvest from './WriteOff/WriteOffHarvest';
import AddHarvest from './Add/AddHarvest';
import { getRole } from '../../../security/Keycloak';
import { UserRoles } from '../../../models/UserRoles';
import ImportBtn from '../../Buttons/Import/ImportBtn';
import HarvestsFileUploader from './FileUploader/HarvestsFileUploader';

const HarvestsPage = () => {
  const classes = useStyles();
  const [harvests, setHarvests] = useState([]);
  const [crops, setCrops] = useState([]);
  const [fields, setFields] = useState([]);
  const [error, setError] = useContext(ErrorContext);
  const [isLoading, setIsLoading] = useState(true);
  const [openWriteOff, setOpenWriteOff] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [currentHarvestId, setCurrentHarvestId] = useState(undefined);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isImportSuccessful, setIsImportSuccessful] = useState(false);

  const handleOpenImportDialog = () => {
    setIsImportDialogOpen(true);
  };

  useEffect(() => {
    getHarvests();
    findCrops('').then((result) => setCrops(result));
    loadFieldsOptions('').then((result) => setFields(result));
    let timeout = setTimeout(() => {
      setIsImportSuccessful(false);
      setError('');
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
      field: 'cropId',
      hidden: true,
      sorting: false
    },
    {
      title: 'Crop name',
      field: 'cropName',
      width: '20%',
      editable: 'onAdd',
      validate: (rowData) =>
        rowData.cropName === undefined || rowData.cropName === ''
          ? { isValid: false, helperText: 'Crop name cannot be empty' }
          : true,
      editComponent: ({ value, onChange }) => (
        <AsyncSelect
          value={value}
          defaultInputValue={value}
          defaultOptions={crops}
          onChange={(selectedOption) => onChange(selectedOption)}
          loadOptions={findCrops}
          cacheOptions
          menuPosition={'fixed'}
        />
      )
    },
    {
      title: 'Month and year of collection',
      field: 'monthAndYearOfCollection',
      width: '15%',
      type: 'date',
      editable: 'onAdd',
      editComponent: ({ value, onChange }) => (
        <TextField
          type="month"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          variant="outlined"
          fullWidth
          InputProps={{ classes: { root: classes.inputRoot } }}
          InputLabelProps={{
            shrink: true
          }}
        />
      )
    },
    {
      title: 'Amount, centner',
      field: 'amount',
      width: '15%',
      editable: 'onAdd',
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
      title: 'Fields',
      field: 'fields',
      editable: 'onAdd',
      render: (rowData) => (
        <div style={{ width: '500px' }}>
          {rowData.fields.map((field, index) => (
            <div
              key={index}
              style={{
                padding: '5px',
                width: '500px'
              }}>
              <span
                style={{
                  fontWeight: 'bold',
                  backgroundColor: '#e9ecef',
                  display: 'inline-block',
                  padding: '2px 5px',
                  borderRadius: '4px'
                }}>
                {field.fieldName}
              </span>
              <span
                style={{
                  marginLeft: '5px',
                  backgroundColor: '#e9ecef',
                  display: 'inline-block',
                  padding: '2px 5px',
                  borderRadius: '4px'
                }}>
                {`${field.fieldSize.toFixed(2)} ha`}
              </span>
              <span
                style={{
                  marginLeft: '5px',
                  backgroundColor: '#e9ecef',
                  display: 'inline-block',
                  padding: '2px 5px',
                  borderRadius: '4px'
                }}>
                {field.soilType}
              </span>
            </div>
          ))}
        </div>
      ),
      editComponent: ({ value, onChange }) => (
        <AsyncSelect
          value={value}
          defaultInputValue={value}
          defaultOptions={fields}
          onChange={(selectedOption) => onChange(selectedOption)}
          loadOptions={loadFieldsOptions}
          cacheOptions
          isMulti
          menuPosition={'fixed'}
        />
      )
    }
  ];

  const loadFieldsOptions = (inputValue) => {
    return new Promise((resolve) => {
      getCurrentFields(inputValue, setError).then((fields) => {
        resolve(
          fields.map((field) => ({
            value: field.id,
            label: `${field.fieldName} - ${field.fieldSize.toFixed(2)} ha - ${field.soilType}`
          }))
        );
      });
    });
  };

  const getHarvests = () => {
    getAllHarvests(setError).then((result) => {
      setHarvests(result);
      setIsLoading(false);
    });
  };

  const findCrops = (inputValue) => {
    return new Promise((resolve) => {
      getAllCrops(inputValue, setError).then((result) => {
        resolve(
          // eslint-disable-next-line no-unused-vars
          Object.entries(result).map(([id, crop]) => ({
            value: crop.id,
            label: crop.name
          }))
        );
      });
    });
  };

  const handleOpenWriteOff = (rowData) => {
    setOpenWriteOff(true);
    setCurrentHarvestId(rowData.id);
  };

  const handleOpenAdd = (rowData) => {
    setOpenAdd(true);
    setCurrentHarvestId(rowData.id);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    getHarvests();
  };

  const handleCloseWriteOff = () => {
    setOpenWriteOff(false);
    getHarvests();
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
          <AlertTitle>The harvests has been imported</AlertTitle>
        </Alert>
      </Collapse>
      <WriteOffHarvest
        isDialogOpened={openWriteOff}
        harvestId={currentHarvestId}
        handleClose={handleCloseWriteOff}></WriteOffHarvest>
      <AddHarvest
        isDialogOpened={openAdd}
        harvestId={currentHarvestId}
        handleClose={handleCloseAdd}
        loadFieldsOptions={loadFieldsOptions}></AddHarvest>
      <HarvestsFileUploader
        isDialogOpened={isImportDialogOpen}
        handleCloseDialog={() => setIsImportDialogOpen(false)}
        refreshHarvests={getHarvests}
        setLoading={setIsLoading}
        setIsImportSuccessful={setIsImportSuccessful}
      />
      <div className={`tech ${classes.root} plus`}>
        <MaterialTable
          title={<Title text="Harvests" />}
          icons={{
            Add: () => <Add />,
            Clear: () => <CloseBtn />,
            Check: () => <SaveBtn />
          }}
          isLoading={isLoading}
          columns={columns}
          data={harvests}
          style={{
            width: '95%',
            height: 'max-content',
            boxShadow: '0px 8px 16px rgba(0, 43, 159, 0.04)',
            marginLeft: '24px',
            marginTop: '24px',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px'
          }}
          editable={{
            onRowAdd:
              getRole() === UserRoles.STOREKEEPER
                ? (data) =>
                    createHarvest(
                      data.cropName.value,
                      data.amount,
                      data.monthAndYearOfCollection,
                      data.fields.map((field) => field.value),
                      setError
                    ).then((harvest) => {
                      if (harvest !== undefined) {
                        setHarvests([...harvests, harvest]);
                      }
                    })
                : undefined
          }}
          actions={[
            (rowData) => {
              return {
                icon: () => <Add />,
                tooltip: 'Add amount to harvest',
                onClick: () => handleOpenAdd(rowData),
                hidden: getRole() === UserRoles.ACCOUNTANT
              };
            },
            (rowData) => {
              return {
                icon: () => <WriteOffBtn />,
                tooltip: 'Write off amount from harvest',
                onClick: () => handleOpenWriteOff(rowData),
                hidden: getRole() === UserRoles.ACCOUNTANT
              };
            },
            {
              hidden: getRole() !== UserRoles.STOREKEEPER,
              icon: () => <ImportBtn />,
              tooltip: 'Import harvests from .xlsx file',
              onClick: () => handleOpenImportDialog(),
              isFreeAction: true
            }
          ]}
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
        />
      </div>
    </>
  );
};
export default HarvestsPage;
