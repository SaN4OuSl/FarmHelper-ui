import { Box } from '@material-ui/core';
import { TextareaAutosize } from '@mui/base';
import React from 'react';
import PropTypes from 'prop-types';

export const ContactInfo = ({ onChange, value }) => {
  const maxLength = 1000;

  const handleChange = (e) => {
    if (e.target.value.length <= maxLength) {
      onChange(e.target.value);
    }
  };

  return (
    <>
      <Box sx={{ bottom: '185px' }}>
        <TextareaAutosize
          maxRows={8}
          resize={false}
          minRows={3}
          placeholder="Contact Information"
          role="textbox"
          value={value}
          onChange={handleChange}
          style={{
            width: '100%',
            resize: 'vertical',
            maxHeight: '119px',
            borderColor: '#e0e3ee',
            outline: 'none',
            borderRadius: '7px'
          }}
        />
        <div>
          Length: {value?.length}/{maxLength}
        </div>
      </Box>
    </>
  );
};

ContactInfo.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  array: PropTypes.array,
  name: PropTypes.string
};
