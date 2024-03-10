import { NavLink } from 'react-router-dom';
import './logo.css';

const Logo = () => {
  return (
    <div className="header__logo">
      <NavLink to="/" className="logo__link">
        <img src={require('../../resources/images/shortlogo.png')} className="logo" />
      </NavLink>
    </div>
  );
};

export default Logo;
