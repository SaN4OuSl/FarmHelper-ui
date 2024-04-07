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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function checkRoles() {
    getPrincipal()
      .then(() => {
        setDoesUserHaveRole(keycloak.principal.role !== '');
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
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
    <>
      <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{
          checkLoginIframe: false,
          onLoad: 'login-required'
        }}
        onEvent={keycloakEventHandler}>
        {loading ? (
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
                          <Layout></Layout>
                        </PrivateRoute>
                      }
                    />
                    <Route
                      exact
                      path="/users"
                      element={
                        <PrivateRoute>
                          <Layout>{getRole() === UserRoles.ADMIN ? <UsersPage /> : <></>}</Layout>
                        </PrivateRoute>
                      }
                    />
                    <Route
                      exact
                      path="/fields"
                      element={
                        <PrivateRoute>
                          <Layout>{getRole() === UserRoles.ADMIN ? <FieldsPage /> : <></>}</Layout>
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
                              <></>
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
                              <></>
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
                              <></>
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
                              <></>
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
    </>
  );
}

export default App;
