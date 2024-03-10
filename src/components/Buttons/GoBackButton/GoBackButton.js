import { ArrowBackIos } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

const GoBackButton = ({ onClick }) => {
  return (
    <Link className="btn-link" to="/" onClick={onClick}>
      <ArrowBackIos fontSize="10" />
      Go back
    </Link>
  );
};

GoBackButton.propTypes = {
  onClick: PropTypes.func
};

export default GoBackButton;
