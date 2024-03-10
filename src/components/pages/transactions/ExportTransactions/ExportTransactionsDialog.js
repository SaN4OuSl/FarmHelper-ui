import React, { useContext, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Box, FormLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import errorContext from '../../../error/ErrorContext';
import { exportTransactionsToFile } from '../../../../service/FileService';
import { useStyles } from '../../styles/Styles';
import { TransactionTypes } from '../../../../models/ActionTypes';
import { FormControl } from '@mui/base';
import { InputLabel } from '@mui/material';

// eslint-disable-next-line react/prop-types
const ExportTransactionsDialog = ({ isDialogOpened, handleClose }) => {
  const classes = useStyles();
  const [actionType, setActionType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useContext(errorContext);
  const transactionTypesArray = Object.entries(TransactionTypes).map(([key, value]) => ({
    value: key,
    label: value
  }));

  useEffect(() => {
    let timeout = setTimeout(() => {
      setError('');
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const exportTransactions = () => {
    exportTransactionsToFile(setError, actionType, startDate, endDate);
  };

  const handleStartDateChange = (e) => {
    const date = new Date(e.target.value);
    date.setHours(0, 0, 0, 0);
    let timestamp = date.getTime();
    if (!timestamp) {
      timestamp = '';
    }
    setStartDate(timestamp);
  };

  const handleEndDateChange = (e) => {
    const date = new Date(e.target.value);
    date.setHours(23, 59, 59, 999);
    let timestamp = date.getTime();
    if (!timestamp) {
      timestamp = '';
    }
    setEndDate(timestamp);
  };

  const handleCloseDialog = () => {
    setActionType('');
    setStartDate('');
    setEndDate('');
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
              lineHeight: '20px',
              marginBottom: '5%'
            }}>
            Export crops
          </Typography>
        </FormLabel>
        <TextField
          type="date"
          onChange={handleStartDateChange}
          margin="normal"
          variant="outlined"
          label="Select the start date"
          fullWidth
          InputProps={{
            classes: { root: classes.inputRoot }
          }}
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          type="date"
          onChange={handleEndDateChange}
          margin="normal"
          variant="outlined"
          label="Select the end date"
          fullWidth
          InputProps={{
            classes: { root: classes.inputRoot }
          }}
          InputLabelProps={{
            shrink: true
          }}
        />
        <FormControl style={{ width: '100%' }}>
          <InputLabel>Select action type</InputLabel>
          <Select onChange={(e) => setActionType(e.target.value)} style={{ width: '100%' }}>
            {transactionTypesArray.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box mt="auto" p={2} display="flex" justifyContent="flex-end">
          <Button
            onClick={handleCloseDialog}
            className="cancel__tags"
            style={{ marginRight: '10px' }}>
            Cancel
          </Button>
          <Button onClick={exportTransactions} className="save__tags">
            Export
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ExportTransactionsDialog;
