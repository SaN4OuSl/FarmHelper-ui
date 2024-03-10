import React, { useContext, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Box, FormLabel, TextField, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { writeOffAmountOfHarvest } from '../../../../service/HarvestService';
import errorContext from '../../../error/ErrorContext';

// eslint-disable-next-line react/prop-types
const WriteOffHarvest = ({ isDialogOpened, harvestId, harvestName, handleClose }) => {
  const [writeOffAmount, setWriteOffAmount] = useState(undefined);
  const [writeOffExplanation, setWriteOffExplanation] = useState('');
  const [error, setError] = useContext(errorContext);
  const [validationError, setValidationError] = useState('');
  const [explanationError, setExplanationError] = useState('');

  useEffect(() => {
    let timeout = setTimeout(() => {
      setError('');
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const handleWriteOffAmountChange = (e) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d*$/;
    const isPositiveDoubleWithOneDot =
      value === '' || (regex.test(value) && value !== '.' && parseFloat(value) > 0);
    setWriteOffAmount(value);

    if (isPositiveDoubleWithOneDot) {
      setValidationError('');
    } else {
      setValidationError('Number should be a positive double with at most one dot');
    }
  };

  const writeOffHarvest = () => {
    const amount = parseFloat(writeOffAmount);
    if (isNaN(amount) || amount <= 0) {
      setValidationError('Number should be a positive double with at most one dot');
    } else {
      setValidationError('');
    }
    if (writeOffExplanation.length === 0) {
      setExplanationError('There must be an explanation for the write-off with the reason');
    } else {
      setExplanationError('');
    }
    if (validationError.length === 0 && explanationError.length === 0) {
      writeOffAmountOfHarvest(harvestId, parseFloat(amount), writeOffExplanation, setError).then(
        () => {
          handleCloseDialog();
        }
      );
    }
  };

  const handleCloseDialog = () => {
    setWriteOffAmount(undefined);
    setWriteOffExplanation('');
    setValidationError('');
    setExplanationError('');
    handleClose();
  };

  return (
    <Dialog
      open={isDialogOpened}
      onClose={handleCloseDialog}
      role="composite-dialog"
      disableScrollLock
      fullWidth={true}
      maxWidth="sm"
      transitionDuration={{ enter: 500, exit: 1000 }}>
      <Box display="flex" flexDirection="column" p={2}>
        {' '}
        <FormLabel>
          <Typography
            className="title__tag"
            style={{
              color: '#585E74',
              fontSize: '17px',
              fontWeight: '400',
              lineHeight: '20px'
            }}>
            Write off harvest, {harvestName}
          </Typography>
        </FormLabel>
        <TextField
          error={!!validationError}
          helperText={validationError}
          label="Write off amount"
          value={writeOffAmount}
          onChange={handleWriteOffAmountChange}
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <TextField
          error={!!explanationError}
          helperText={explanationError}
          label="Write off explenation"
          value={writeOffExplanation}
          onChange={(e) => setWriteOffExplanation(e.target.value)}
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <Box mt="auto" p={2} display="flex" justifyContent="flex-end">
          <Button
            onClick={handleCloseDialog}
            className="cancel__tags"
            style={{ marginRight: '10px' }}>
            Cancel
          </Button>
          <Button onClick={writeOffHarvest} className="save__tags">
            Save
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default WriteOffHarvest;
