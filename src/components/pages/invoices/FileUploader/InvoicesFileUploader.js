import React, { useContext } from 'react';
import { Box, DialogContent, DialogTitle, Paper, Typography } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import Dialog from '@material-ui/core/Dialog';
import Title from '../../../../assets/styles/constants/Title';
import {
  exportExampleSaleInvoicesFile,
  importSaleInvoicesFromFile
} from '../../../../service/FileService';
import ErrorContext from '../../../error/ErrorContext';

const InvoicesFileUploader = ({
  // eslint-disable-next-line react/prop-types
  isDialogOpened,
  // eslint-disable-next-line react/prop-types
  handleCloseDialog,
  // eslint-disable-next-line react/prop-types
  refreshInvoices,
  // eslint-disable-next-line react/prop-types
  setLoading,
  // eslint-disable-next-line react/prop-types
  setIsImportSuccessful
}) => {
  const [, setError] = useContext(ErrorContext);

  const onDrop = (acceptedFiles) => {
    if (!isDragReject) {
      setLoading(true);
      importSaleInvoicesFromFile(acceptedFiles[0], setError, handleClose).then(() => {
        setIsImportSuccessful(true);
        refreshInvoices();
      });
      handleClose();
    }
  };

  const exportExample = () => {
    exportExampleSaleInvoicesFile(setError);
  };
  const handleClose = () => {
    handleCloseDialog(false);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    onDrop
  });

  return (
    <>
      <Dialog
        disableScrollLock
        open={isDialogOpened}
        onClose={handleClose}
        transitionDuration={{ enter: 500, exit: 1000 }}>
        <DialogTitle>
          <Title text="Import invoices from excel file" />
        </DialogTitle>
        <DialogContent dividers>
          <Typography className="text__modal">
            To import sale invoices from a .xlsx file you need to follow the same format as in the{' '}
            <a onClick={exportExample}>example</a>. Make sure these points are correct for your
            file:
          </Typography>
          <Typography className="text__modal">
            1. Harvests with crop name and monthAndYearOfCollection from invoice exists
          </Typography>
          <Typography className="text__modal">2. Unit price is greater than 0</Typography>
          <Typography className="text__modal">3. Amount value is greater than 0</Typography>
          <Box style={{ paddingTop: '10px' }}>
            <Paper className="import__file" {...getRootProps()}>
              <input {...getInputProps()} />
              {!isDragActive ? (
                <div className="containerTypography">
                  <Typography>Drag and drop your file here, or click to select a file</Typography>
                </div>
              ) : (
                <>
                  {isDragReject ? (
                    <div className="containerTypography">
                      <Typography style={{ color: '#FF7373' }}>
                        Only .xslx/.xsl files are accepted
                      </Typography>
                    </div>
                  ) : (
                    <div className="containerTypography">
                      <Typography>Drop the file here ...</Typography>
                    </div>
                  )}
                </>
              )}
            </Paper>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvoicesFileUploader;
