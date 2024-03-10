import { Link } from 'react-router-dom';
import Logo from '../logo/Logo';
import Logout from '../Icon/Logout';
import './header.css';
import keycloak, { getRole, getUsername } from '../../security/Keycloak';

const Header = () => {
  return (
    <header className="header">
      <div className="header__container">
        <Logo />
        <div className="logout">
          <div className="name__admin">{getUsername() + ' ' + getRole()}</div>
          <div className="btn__logout">
            <Link to="/" onClick={() => keycloak.logout()}>
              <Logout />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
