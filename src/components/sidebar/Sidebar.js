import React from 'react';
import { NavLink } from 'react-router-dom';
import Users from '../Icon/Users';
import './Sidebar.css';
import { getRole } from '../../security/Keycloak';
import { UserRoles } from '../../models/UserRoles';
import Crops from '../Icon/Crops';
import Harvests from '../Icon/Harvests';
import Transactions from '../Icon/Transactions';
import Field from '../Icon/Field';
import Invoice from '../Icon/Invoice';

const Sidebar = () => {
  return (
    <div className="sidebar__wrapper">
      <div className="sidebar__nav">
        {getRole() === UserRoles.ADMIN ? (
          <>
            <div className="nav__item">
              <NavLink to="/users" className="menu__link">
                <Users />
                <span className="item__title">Users</span>
              </NavLink>
            </div>
            <div className="nav__item">
              <NavLink to="/fields" className="menu__link">
                <Field />
                <span className="item__title">Fields</span>
              </NavLink>
            </div>
          </>
        ) : (
          <></>
        )}
        {getRole() === UserRoles.STOREKEEPER || getRole() === UserRoles.ACCOUNTANT ? (
          <>
            <div className="nav__item">
              <NavLink to="/crops" className="menu__link">
                <Crops />
                <span className="item__title">Crops</span>
              </NavLink>
            </div>
            <div className="nav__item">
              <NavLink to="/harvests" className="menu__link">
                <Harvests />
                <span className="item__title">Harvests</span>
              </NavLink>
            </div>
            <div className="nav__item">
              <NavLink to="/invoices" className="menu__link">
                <Invoice />
                <span className="item__title">Invoices</span>
              </NavLink>
            </div>
            <div className="nav__item">
              <NavLink to="/transactions" className="menu__link">
                <Transactions />
                <span className="item__title">Transactions</span>
              </NavLink>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
