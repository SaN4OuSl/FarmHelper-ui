import Keycloak from 'keycloak-js';
import axios from 'axios';

// eslint-disable-next-line no-undef
const keycloak = new Keycloak(process.env.REACT_APP_KEYCLOAK_CONFIG);

// eslint-disable-next-line no-undef
const SecurityPath = process.env.REACT_APP_API_URL + 'security';

export function getToken() {
  return 'Bearer ' + keycloak.token;
}

export function getUsername() {
  if (keycloak.principal !== undefined) {
    return keycloak.principal.username;
  }
}

export function getUserId() {
  if (keycloak.principal !== undefined) {
    return keycloak.principal.id;
  }
}

export async function getPrincipal() {
  await axios
    .get(SecurityPath + '/principal', {
      headers: {
        Authorization: getToken()
      }
    })
    .then(async (response) => {
      keycloak.principal = await response.data;
    })
    .catch(() => {
      // eslint-disable-next-line no-undef
      window.location.href = process.env.REACT_APP_RADAR_URL;
    });
}

export function getRole() {
  if (keycloak.principal !== undefined) {
    return keycloak.principal.role;
  }
}

export default keycloak;
