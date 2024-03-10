import React, { useContext, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Box, FormLabel, TextField, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import errorContext from '../../../error/ErrorContext';
import { exportCropsInYearFile } from '../../../../service/FileService';
import { useStyles } from '../../styles/Styles';

// eslint-disable-next-line react/prop-types
const ExportCropsDialog = ({ isDialogOpened, handleClose }) => {
  const classes = useStyles();
  const [year, setYear] = useState(undefined);
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

  const exportCrops = () => {
    if (year !== undefined) {
      exportCropsInYearFile(setError, year);
    } else {
      setValidationError('You should choose year!');
    }
  };

  const handleYearChange = (e) => {
    const yearValue = e.target.value;
    if (yearValue.length <= 4) {
      setYear(yearValue);
      setValidationError('');
    } else {
      setValidationError('Write correct year!');
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
          error={!!validationError}
          helperText={validationError}
          type="number"
          onChange={handleYearChange}
          margin="normal"
          variant="outlined"
          label="Select the harvest year"
          fullWidth
          InputProps={{
            classes: { root: classes.inputRoot },
            inputProps: { min: 1900, max: new Date().getFullYear() }
          }}
          InputLabelProps={{
            shrink: true
          }}
        />
        <Box mt="auto" p={2} display="flex" justifyContent="flex-end">
          <Button onClick={handleClose} className="cancel__tags" style={{ marginRight: '10px' }}>
            Cancel
          </Button>
          <Button onClick={exportCrops} className="save__tags">
            Export
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ExportCropsDialog;
