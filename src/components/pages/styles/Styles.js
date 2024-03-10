import { makeStyles } from '@mui/styles';

export const search_box = {
  width: '300px',
  padding: 'inherit',
  borderRadius: '7px',
  marginTop: '7px',
  marginBottom: '5px',
  fontWeight: '400',
  color: '#A8AEC5'
};

export const useStyles = makeStyles({
  root: {
    '& .MuiInput-input': {
      padding: '7px 0 6px'
    }
  },
  cell_header: {
    '& .MuiTableCell-sizeSmall': {
      background: '#FBFCFE',
      color: '#585E74',
      borderTop: '1px solid #DBDFEC',
      fontSize: '14px',
      lineHeight: '19px',
      fontWeight: '400',
      padding: '16px 20px'
    }
  },
  tableEditRow: {
    '& td': {
      border: '1px solid black !important'
    }
  },
  inputRoot: {
    '& .MuiInputBase-input': {
      height: '1.1876em',
      padding: '18.5px 14px'
    }
  }
});
