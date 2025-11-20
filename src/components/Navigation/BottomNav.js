import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
        <div className="nav-icon">📊</div>
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/clientes" className={({ isActive }) => (isActive ? 'active' : '')}>
        <div className="nav-icon">👥</div>
        <span>Clientes</span>
      </NavLink>
      <NavLink to="/cobrancas" className={({ isActive }) => (isActive ? 'active' : '')}>
        <div className="nav-icon">💳</div>
        <span>Cobranças</span>
      </NavLink>
      <NavLink to="/notificacoes" className={({ isActive }) => (isActive ? 'active' : '')}>
        <div className="nav-icon">📬</div>
        <span>Notificações</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;

