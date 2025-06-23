import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './security/PrivateRoute';
import UsersPage from './components/pages/users/UsersPage';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak, { getPrincipal, getRole } from './security/Keycloak';
import { UserRoles } from './models/UserRoles';
import Spinner from 'react-bootstrap/Spinner';
import Layout from './components/layout/Layout';
import ErrorContext from './components/error/ErrorContext';
import PageNotFound from './components/error/PageNotFound';
import AccessDenied from './components/error/AccessDenied';
import CropsPage from './components/pages/crops/CropsPage';
import HarvestsPage from './components/pages/harvests/HarvestsPage';
import FieldsPage from './components/pages/fields/FieldsPage';
import TransactionPage from './components/pages/transactions/TransactionPage';
import InvoicesPage from './components/pages/invoices/InvoicesPage';

function App() {
  const [doesUserHaveRole, setDoesUserHaveRole] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const [error, setError] = useState('');

  function checkRoles() {
    getPrincipal()
      .then(() => {
        setDoesUserHaveRole(keycloak.principal.role !== '');
        setIsAppReady(true);
      })
      .catch(() => {
        setIsAppReady(true);
      });
  }

  const keycloakEventHandler = (event) => {
    if (event === 'onAuthSuccess' || event === 'onAuthRefreshSuccess') {
      checkRoles();
    }
    if (event === 'onAuthError' || event === 'onAuthRefreshError') {
      keycloak.clearToken();
      keycloak.logout();
    }
  };

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        checkLoginIframe: false,
        onLoad: 'login-required',
        redirectUri: window.location.origin + '/farmhelper-ui',
        pkceMethod: 'S256',
        useNonce: false
      }}
      onEvent={keycloakEventHandler}
      onTokens={() => checkRoles()}>
      {!isAppReady ? (
        <Spinner
          role="spinner"
          animation="border"
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '20%'
          }}
        />
      ) : (
        <div className="App">
          <ErrorContext.Provider value={[error, setError]}>
            <Routes>
              {doesUserHaveRole ? (
                <>
                  <Route
                    exact
                    path="/"
                    element={
                      <PrivateRoute>
                        <Layout />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    exact
                    path="/users"
                    element={
                      <PrivateRoute>
                        <Layout>
                          {getRole() === UserRoles.ADMIN ? <UsersPage /> : <AccessDenied />}
                        </Layout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    exact
                    path="/fields"
                    element={
                      <PrivateRoute>
                        <Layout>
                          {getRole() === UserRoles.ADMIN ? <FieldsPage /> : <AccessDenied />}
                        </Layout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    exact
                    path="/crops"
                    element={
                      <PrivateRoute>
                        <Layout>
                          {getRole() === UserRoles.STOREKEEPER ||
                          getRole() === UserRoles.ACCOUNTANT ? (
                            <CropsPage />
                          ) : (
                            <AccessDenied />
                          )}
                        </Layout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    exact
                    path="/harvests"
                    element={
                      <PrivateRoute>
                        <Layout>
                          {getRole() === UserRoles.STOREKEEPER ||
                          getRole() === UserRoles.ACCOUNTANT ? (
                            <HarvestsPage />
                          ) : (
                            <AccessDenied />
                          )}
                        </Layout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    exact
                    path="/invoices"
                    element={
                      <PrivateRoute>
                        <Layout>
                          {getRole() === UserRoles.STOREKEEPER ||
                          getRole() === UserRoles.ACCOUNTANT ? (
                            <InvoicesPage />
                          ) : (
                            <AccessDenied />
                          )}
                        </Layout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    exact
                    path="/transactions"
                    element={
                      <PrivateRoute>
                        <Layout>
                          {getRole() === UserRoles.STOREKEEPER ||
                          getRole() === UserRoles.ACCOUNTANT ? (
                            <TransactionPage />
                          ) : (
                            <AccessDenied />
                          )}
                        </Layout>
                      </PrivateRoute>
                    }
                  />
                </>
              ) : (
                <Route
                  exact
                  path="/"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <AccessDenied />
                      </Layout>
                    </PrivateRoute>
                  }
                />
              )}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </ErrorContext.Provider>
        </div>
      )}
    </ReactKeycloakProvider>
  );
}

export default App;
