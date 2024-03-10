import React, { useContext, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Box, TextField, FormLabel, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import errorContext from '../../../error/ErrorContext';
import AsyncSelect from 'react-select/async';
import { addAmountToExistedHarvest } from '../../../../service/HarvestService';

// eslint-disable-next-line react/prop-types
const AddHarvest = ({ isDialogOpened, harvestId, harvestName, handleClose, loadFieldsOptions }) => {
  const [addAmount, setAddAmount] = useState(undefined);
  const [fields, setFields] = useState([]);
  const [error, setError] = useContext(errorContext);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    let timeout = setTimeout(() => {
      setError('');
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const handleAddAmountChange = (e) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d*$/;
    const isPositiveDoubleWithOneDot =
      value === '' || (regex.test(value) && value !== '.' && parseFloat(value) > 0);
    setAddAmount(value);

    if (isPositiveDoubleWithOneDot) {
      setValidationError('');
    } else {
      setValidationError('Number should be a positive double with at most one dot');
    }
  };

  const addAmountToHarvest = () => {
    const amount = parseFloat(addAmount);
    if (!isNaN(amount) && amount > 0) {
      addAmountToExistedHarvest(
        harvestId,
        parseFloat(amount),
        fields.map((field) => field.value),
        setError
      ).then(() => {
        setAddAmount(undefined);
        setFields([]);
        handleClose();
      });
    } else {
      setValidationError('Number should be a positive double with at most one dot');
    }
  };

  return (
    <Dialog
      open={isDialogOpened}
      onClose={handleClose}
      role="composite-dialog"
      disableScrollLock
      fullWidth={true}
      maxWidth="sm"
      transitionDuration={{ enter: 500, exit: 1000 }}>
      {/* Add padding to this Box to apply it around the edges of the dialog content */}
      <Box display="flex" flexDirection="column" p={2}>
        {' '}
        {/* Padding added here */}
        <FormLabel>
          <Typography
            className="title__tag"
            style={{
              color: '#585E74',
              fontSize: '17px',
              fontWeight: '400',
              lineHeight: '20px'
            }}>
            Add amount to harvest, {harvestName}
          </Typography>
        </FormLabel>
        <TextField
          error={!!validationError}
          helperText={validationError}
          label="Add amount"
          value={addAmount}
          onChange={handleAddAmountChange}
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <AsyncSelect
          placeholder="Select fields..."
          value={fields}
          onChange={(selectedOptions) => {
            setFields(selectedOptions);
          }}
          loadOptions={loadFieldsOptions}
          cacheOptions
          isMulti
          menuPosition={'fixed'}
        />
        <Box mt="auto" p={2} display="flex" justifyContent="flex-end">
          <Button onClick={handleClose} className="cancel__tags" style={{ marginRight: '10px' }}>
            Cancel
          </Button>
          <Button onClick={addAmountToHarvest} className="save__tags">
            Save
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AddHarvest;
