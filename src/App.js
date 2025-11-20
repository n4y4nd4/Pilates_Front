import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import ClientesList from './components/Clientes/ClientesList';
import ClienteForm from './components/Clientes/ClienteForm';
import CobrancasList from './components/Cobrancas/CobrancasList';
import NotificacoesList from './components/Notificacoes/NotificacoesList';
import BottomNav from './components/Navigation/BottomNav';

function App() {
  return (
    <Router>
      <div className="app">
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<ClientesList />} />
            <Route path="/clientes/novo" element={<ClienteForm />} />
            <Route path="/clientes/:id/editar" element={<ClienteForm />} />
            <Route path="/cobrancas" element={<CobrancasList />} />
            <Route path="/notificacoes" element={<NotificacoesList />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
