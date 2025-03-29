import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, Navigate } from 'react-router-dom';
import Home from './components/Home';
import MotoristasList from './components/MotoristasList';
import BuscarMotorista from './components/BuscarMotorista';
import CadastrarMotorista from './components/CadastrarMotorista';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Perfil from './components/Perfil'; // ✅ Mantendo a página de perfil
import './styles/global.css';

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        }
    }, []);

    return (
        <Router>
            <AppContent user={user} setUser={setUser} />
        </Router>
    );
};

// ✅ Criando um componente para rotas protegidas
const PrivateRoute = ({ element, user }) => {
    return user ? element : <Navigate to="/login" replace />;
};

// ✅ Componente principal com proteção de rotas
const AppContent = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <div className="app-container">
            <nav className="navbar">
                <h1>🚗 CheckPort</h1>
                <div className="nav-links">
                    <Link to="/">🏠 Início</Link>
                    {user ? (
                        <>
                            <Link to="/listar">📋 Lista</Link>
                            <Link to="/buscar">🔍 Buscar</Link>
                            <Link to="/cadastrar">➕ Cadastrar</Link>
                            <Link to="/dashboard">📊 Dashboard</Link>
                            <Link to="/perfil">👤 Meu Perfil</Link> {/* ✅ Mantendo o link do perfil */}
                            <button onClick={handleLogout}>🚪 Sair</button>
                        </>
                    ) : (
                        <Link to="/login">🔐 Login</Link>
                    )}
                </div>
            </nav>

            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    
                    {/* 🔒 Rotas protegidas */}
                    <Route path="/listar" element={<PrivateRoute user={user} element={<MotoristasList />} />} />
                    <Route path="/buscar" element={<PrivateRoute user={user} element={<BuscarMotorista />} />} />
                    <Route path="/cadastrar" element={<PrivateRoute user={user} element={<CadastrarMotorista />} />} />
                    <Route path="/dashboard" element={<PrivateRoute user={user} element={<Dashboard />} />} />
                    <Route path="/perfil" element={<PrivateRoute user={user} element={<Perfil />} />} /> {/* ✅ Rota para perfil */}
                </Routes>
            </div>
        </div>
    );
};




export default App;
