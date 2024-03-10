import { search_box, useStyles } from '../styles/Styles';
import React, { useContext, useEffect, useState } from 'react';
import ErrorContext from '../../error/ErrorContext';
import { Alert, AlertTitle, Collapse } from '@mui/material';
import MaterialTable from '@material-table/core';
import Title from '../../../assets/styles/constants/Title';
import EditBtn from '../../Buttons/Edit/EditBtn';
import Add from '../../Buttons/AddBtn/Add';
import CloseBtn from '../../Buttons/Close/CloseBtn';
import SaveBtn from '../../Buttons/Save/SaveBtn';
import DeleteBtn from '../../Buttons/Delete/DeleteBtn';
import { Description } from './Description';
import ViewHarvests from './ViewHarvests/ViewHarvests';
import { createCrop, deleteCrop, getAllCrops, updateCrop } from '../../../service/CropService';
import { getRole } from '../../../security/Keycloak';
import { UserRoles } from '../../../models/UserRoles';
import ExportBtn from '../../Buttons/Export/ExportBtn';
import ExportCropsDialog from './ExportCrops/ExportCropsDialog';

const CropsPage = () => {
  const classes = useStyles();
  const [crops, setCrops] = useState([]);
  const [error, setError] = useContext(ErrorContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const handleOpenExportDialog = () => {
    setIsExportDialogOpen(true);
  };

  useEffect(() => {
    getCrops();
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
      title: 'Name',
      field: 'name',
      width: '15%',
      validate: (rowData) => {
        let value = typeof rowData === 'string' ? rowData : rowData.name;
        return !value || value.length === 0
          ? { isValid: false, helperText: 'This field is required.' }
          : value.length > 64
          ? { isValid: false, helperText: 'Size cannot be longer then 64 symbols.' }
          : true;
      }
    },
    {
      title: 'Description',
      field: 'description',
      cellStyle: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      },
      render: (rowData) => (
        <div
          style={{
            maxHeight: '100px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
          {rowData.description}
        </div>
      ),
      editComponent: ({ value, onChange }) => {
        return <Description onChange={onChange} value={value} />;
      }
    },
    {
      title: 'Harvests',
      field: 'harvests',
      sorting: false,
      editable: 'never',
      cellStyle: { paddingLeft: '10px' },
      render: (rowData) => (
        <div>
          <ViewHarvests crop={rowData} />
        </div>
      )
    }
  ];

  const getCrops = () => {
    getAllCrops('', setError).then((result) => {
      setCrops(result);
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
      <ExportCropsDialog
        isDialogOpened={isExportDialogOpen}
        handleClose={() => setIsExportDialogOpen(false)}></ExportCropsDialog>
      <div className={classes.root}>
        <MaterialTable
          title={<Title text="Crops" />}
          icons={{
            Edit: () => <EditBtn />,
            Add: () => <Add />,
            Clear: () => <CloseBtn />,
            Check: () => <SaveBtn />,
            Delete: () => <DeleteBtn />
          }}
          isLoading={isLoading}
          columns={columns}
          data={crops}
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
              tooltip: 'Export yearly crops data to an .xlsx file',
              isFreeAction: true
            }
          ]}
          editable={{
            isEditHidden: () => getRole() === UserRoles.ACCOUNTANT,
            isDeleteHidden: () => getRole() === UserRoles.ACCOUNTANT,
            onRowAdd:
              getRole() === UserRoles.STOREKEEPER
                ? (data) =>
                    createCrop(data.name, data.description, setError).then((crop) => {
                      if (crop !== undefined) {
                        setCrops([...crops, crop]);
                      }
                    })
                : undefined,
            onRowDelete: (data) => {
              return deleteCrop(data.id, setError).then(() => {
                setCrops(crops.filter((crop) => crop.id !== data.id));
              });
            },
            onRowUpdate: (data) => {
              return updateCrop(data.id, data.name, data.description, setError).then(
                (updatedItem) => {
                  const newCrops = crops.map((crop) =>
                    crop.id === data.id ? { ...crop, ...updatedItem } : crop
                  );
                  setCrops(newCrops);
                }
              );
            }
          }}
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
export default CropsPage;
