import React, { useContext } from 'react';
import { Box, DialogContent, DialogTitle, Paper, Typography } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import Dialog from '@material-ui/core/Dialog';
import Title from '../../../../assets/styles/constants/Title';
import { exportExampleHarvestsFile, importHarvestsFromFile } from '../../../../service/FileService';
import ErrorContext from '../../../error/ErrorContext';

const HarvestsFileUploader = ({
  // eslint-disable-next-line react/prop-types
  isDialogOpened,
  // eslint-disable-next-line react/prop-types
  handleCloseDialog,
  // eslint-disable-next-line react/prop-types
  refreshHarvests,
  // eslint-disable-next-line react/prop-types
  setLoading,
  // eslint-disable-next-line react/prop-types
  setIsImportSuccessful
}) => {
  const [, setError] = useContext(ErrorContext);

  const onDrop = (acceptedFiles) => {
    if (!isDragReject) {
      setLoading(true);
      importHarvestsFromFile(acceptedFiles[0], setError, handleClose).then(() => {
        setIsImportSuccessful(true);
        refreshHarvests();
      });
      handleClose();
    }
  };

  const exportExample = () => {
    exportExampleHarvestsFile(setError);
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
          <Title text="Import Harvests from excel file" />
        </DialogTitle>
        <DialogContent dividers>
          <Typography className="text__modal">
            To import harvests from a .xlsx file you need to follow the same format as in the{' '}
            <a onClick={exportExample}>example</a>. Make sure these points are correct for your
            file:
          </Typography>
          <Typography className="text__modal">
            1. Harvests with same crop name and monthAndYearOfCollection does not exists
          </Typography>
          <Typography className="text__modal">
            2. Existed fields are entered in the fields info
          </Typography>
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

export default HarvestsFileUploader;
