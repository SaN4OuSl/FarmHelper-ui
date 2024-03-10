import { Typography } from '@material-ui/core';

// eslint-disable-next-line react/prop-types
const Title = ({ text, variant = 'h4', className }) => (
  <Typography
    variant={variant}
    className={className}
    style={{
      color: '#585E74',
      fontSize: '17px',
      fontWeight: '400',
      lineHeight: '20px'
    }}>
    {text}
  </Typography>
);
export default Title;
