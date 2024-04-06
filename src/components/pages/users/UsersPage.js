import { useContext, useEffect, useState } from 'react';
import MaterialTable from '@material-table/core';
import { AlertTitle } from '@mui/material';
import { Alert, Collapse } from '@mui/material';
import Add from '../../Buttons/AddBtn/Add';
import SaveBtn from '../../Buttons/Save/SaveBtn';
import CloseBtn from '../../Buttons/Close/CloseBtn';
import DeleteBtn from '../../Buttons/Delete/DeleteBtn';
import Title from '../../../assets/styles/constants/Title';
import ErrorContext from '../../error/ErrorContext';
import { search_box, useStyles } from '../styles/Styles';
import AsyncSelect from 'react-select/async';
import { MenuItem, Select } from '@material-ui/core';
import { UserRoles } from '../../../models/UserRoles';
import {
  assignRoleToUser,
  deactivateUser,
  getAllUsers,
  getUnassignedUsers
} from '../../../service/UserService';

const UsersPage = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [error, setError] = useContext(ErrorContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initUsers();
    let timeout = setTimeout(() => {
      setError('');
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const columns = [
    {
      field: 'Id',
      defaultSort: 'id',
      hidden: true,
      sorting: true,
      customSort: (a, b) => b.id - a.id
    },
    {
      title: 'Username',
      field: 'username',
      editable: 'onAdd',
      validate: (rowData) =>
        rowData.username === undefined || rowData.username === ''
          ? { isValid: false, helperText: 'Username cannot be empty' }
          : true,
      editComponent: ({ value, onChange }) => (
        <AsyncSelect
          value={value}
          onChange={(selectedOption) => onChange(selectedOption)}
          loadOptions={findOtherUsers}
          cacheOptions
          menuPosition={'fixed'}
        />
      )
    },
    {
      title: 'Full name',
      field: 'fullName',
      editable: 'never'
    },
    {
      title: 'Email',
      field: 'email',
      editable: 'never'
    },
    {
      title: 'Role',
      field: 'role',
      editComponent: ({ value, onChange }) => (
        <Select value={value} onChange={(e) => onChange(e.target.value)} style={{ width: '100%' }}>
          {Object.keys(UserRoles)
            .slice(1)
            .map((key) => (
              <MenuItem key={key} value={UserRoles[key]}>
                {UserRoles[key]}
              </MenuItem>
            ))}
        </Select>
      ),
      render: (rowData) =>
        rowData.role === null ? (
          <p style={{ color: '#FF7373', margin: 0 }}> You need to fill this cell </p>
        ) : (
          UserRoles[rowData.role]
        ),
      validate: (rowData) => {
        if (rowData.tableData?.editing !== 'delete') {
          let value = typeof rowData === 'string' ? rowData : rowData.role;
          return !value || value.length === 0 || !/^STOREKEEPER$|^ACCOUNTANT$/.test(value)
            ? { isValid: false, helperText: 'Role is invalid' }
            : true;
        }
        return true;
      }
    }
  ];

  const initUsers = () => {
    getAllUsers('', setError).then((result) => {
      setUsers(result);
      setIsLoading(false);
    });
  };

  const findOtherUsers = (inputValue) => {
    return new Promise((resolve) => {
      if (inputValue.length >= 2) {
        getUnassignedUsers(inputValue, setError).then((result) => {
          let users = Object.values(result);
          resolve(
            users.map((username) => ({
              value: username,
              label: username
            }))
          );
        });
      }
    });
  };

  return (
    <>
      <Collapse in={error !== ''}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          <span style={{ whiteSpace: 'pre-line' }}>{error}</span>
        </Alert>
      </Collapse>
      <div className={classes.root}>
        <MaterialTable
          title={<Title text="Users" />}
          columns={columns}
          icons={{
            Add: () => <Add />,
            Clear: () => <CloseBtn />,
            Check: () => <SaveBtn />,
            Delete: () => <DeleteBtn />
          }}
          isLoading={isLoading}
          data={users}
          options={{
            draggable: false,
            search: true,
            exportAllData: true,
            addRowPosition: 'first',
            actionsColumnIndex: -1,
            exportFileName: 'TableData',
            paging: true,
            pageSize: 20,
            paginationAlignment: 'left',
            searchFieldVariant: 'outlined',
            showFirstLastPageButtons: false,
            emptyRowsWhenPaging: false,
            searchAutoFocus: false,
            searchFieldStyle: search_box,
            headerStyle: {
              backgroundColor: '#FBFCFE',
              fontWeight: '400',
              color: '#585E74',
              lineHeight: '19px',
              fontSize: '14px',
              padding: '16px 20px'
            }
          }}
          style={{
            width: '95%',
            height: 'max-content',
            boxShadow: '0px 8px 16px rgba(0, 43, 159, 0.04)',
            marginLeft: '24px',
            marginTop: '24px',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px'
          }}
          editable={{
            isDeleteHidden: (rowData) => rowData.role === UserRoles.ADMIN,
            onRowAdd: (data) =>
              assignRoleToUser(data.username.value, data.role, setError).then(initUsers),
            onRowDelete: (data) => deactivateUser(data.username, setError).then(initUsers)
          }}></MaterialTable>
      </div>
    </>
  );
};
export default UsersPage;
