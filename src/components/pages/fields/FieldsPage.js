import { search_box } from '../styles/Styles';
import { useContext, useEffect, useState } from 'react';
import ErrorContext from '../../error/ErrorContext';
import { Alert, AlertTitle, Collapse } from '@mui/material';
import MaterialTable from '@material-table/core';
import Title from '../../../assets/styles/constants/Title';
import Add from '../../Buttons/AddBtn/Add';
import CloseBtn from '../../Buttons/Close/CloseBtn';
import SaveBtn from '../../Buttons/Save/SaveBtn';
import DeleteBtn from '../../Buttons/Delete/DeleteBtn';
import { deactivateFarm, getCurrentFields } from '../../../service/FieldService';
import ViewField from './ViewField/ViewField';
import { parseCoordinatesToPoints } from '../../../utils/pointParser';
import EditBtn from '../../Buttons/Edit/EditBtn';

const FieldsPage = () => {
  const [fields, setFields] = useState([]);
  const [error, setError] = useContext(ErrorContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentFieldId, setCurrentFieldId] = useState(undefined);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);

  const handleOpen = (rowData) => {
    if (rowData === undefined) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setDialogOpen(true);
        },
        () => {
          setDialogOpen(true);
        }
      );
    } else {
      setCurrentFieldId(rowData.id);
      setMapCenter(parseCoordinatesToPoints(rowData.coordinates)[0]);
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setMapCenter([51.505, -0.09]);
    setCurrentFieldId(undefined);
    getFields();
    setDialogOpen(false);
  };

  useEffect(() => {
    getFields();
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
      field: 'fieldName',
      editable: 'never'
    },
    {
      title: 'Size (ha)',
      field: 'fieldSize',
      width: '15%',
      editable: 'never'
    },
    {
      title: 'Soil type',
      field: 'soilType',
      width: '15%',
      editable: 'never'
    }
  ];

  const getFields = () => {
    getCurrentFields('', setError).then((result) => {
      setFields(result);
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
      <ViewField
        isDialogOpened={isDialogOpen}
        fieldId={currentFieldId}
        mapCenter={mapCenter}
        handleClose={() => {
          handleCloseDialog();
        }}></ViewField>
      <div>
        <MaterialTable
          title={<Title text="Fields" />}
          icons={{
            Clear: () => <CloseBtn />,
            Check: () => <SaveBtn />,
            Delete: () => <DeleteBtn />
          }}
          isLoading={isLoading}
          columns={columns}
          data={fields}
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
            onRowDelete: (data) => {
              return deactivateFarm(data.id, setError).then(() => {
                setFields(fields.filter((field) => field.id !== data.id));
              });
            }
          }}
          actions={[
            (rowData) => {
              return {
                icon: () => <EditBtn />,
                tooltip: 'Field info',
                onClick: () => handleOpen(rowData)
              };
            },
            {
              icon: () => <Add />,
              tooltip: 'Add Field',
              onClick: () => handleOpen(),
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
export default FieldsPage;
