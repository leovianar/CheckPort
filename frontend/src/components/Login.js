import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🚀 Para redirecionar após login
import api from '../services/api';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate(); // 🚀 Hook para navegação

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('http://localhost:3003/api/usuarios/login', { email, senha });

            // Salvar token no localStorage
            localStorage.setItem('token', response.data.token);

            // Atualizar estado do usuário
            setUser(response.data);

            alert('✅ Login realizado com sucesso!');
            
            // 🚀 Redirecionar para a página principal (painel de motoristas)
            navigate('/listar'); 

        } catch (err) {
            setErro('❌ E-mail ou senha incorretos.');
        }
    };

    return (
        <div className="container">
            <h2>🔐 Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                <button type="submit">Entrar</button>
            </form>
            {erro && <p>{erro}</p>}
        </div>
    );
};

export default Login;
