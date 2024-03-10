import { useContext, useEffect, useState } from 'react';
import MaterialTable from '@material-table/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Title from '../../../../assets/styles/constants/Title';
import ErrorContext from '../../../error/ErrorContext';
import { search_box } from '../../styles/Styles';
import { getAllHarvestsOfCrop } from '../../../../service/HarvestService';

const ViewHarvests = (params) => {
  const [open, setOpen] = useState(false);
  const [cropHarvests, setCropHarvests] = useState([]);
  const [maxWidth] = useState('xl');
  const [fullWidth] = useState(true);
  const [error, setError] = useContext(ErrorContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
      title: 'Month and year of collection',
      field: 'monthAndYearOfCollection',
      width: '15%',
      type: 'date',
      editable: 'never'
    },
    {
      title: 'Amount, tons',
      field: 'amount',
      editable: 'never'
    },
    {
      title: 'Field size, hectares',
      field: 'fieldSize',
      editable: 'never'
    },
    {
      title: 'Soil type',
      field: 'soilType',
      editable: 'never'
    }
  ];

  const handleClickOpen = () => {
    setOpen(true);
    initHarvests();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const initHarvests = () => {
    setIsLoading(true);
    getAllHarvestsOfCrop(params.crop.id, '', setError).then((result) => {
      setIsLoading(false);
      setCropHarvests(result);
    });
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        color="primary"
        style={{ textAlign: 'left' }}
        role="view-users-dialog">
        View Harvests
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        transitionDuration={{ enter: 500, exit: 1000 }}>
        <div className="v__users">
          <MaterialTable
            title={
              <Title
                text={
                  <span>
                    Harvests of <strong>{params.crop.name}</strong>
                  </span>
                }
              />
            }
            columns={columns}
            isLoading={isLoading}
            data={cropHarvests}
            options={{
              draggable: false,
              search: true,
              exportAllData: true,
              addRowPosition: 'first',
              actionsColumnIndex: -1,
              exportFileName: 'TableData',
              paging: false,
              searchFieldVariant: 'outlined',
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
              width: '100%'
            }}></MaterialTable>
        </div>
      </Dialog>
    </>
  );
};
export default ViewHarvests;
