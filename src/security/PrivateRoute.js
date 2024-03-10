import keycloak from './Keycloak';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = keycloak.authenticated;

  return isLoggedIn ? children : undefined;
};

export default PrivateRoute;
