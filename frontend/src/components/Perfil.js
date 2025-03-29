import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Perfil = () => {
    const [perfil, setPerfil] = useState({ nome: '', email: '', tipo: '' });
    const [novoPerfil, setNovoPerfil] = useState({ nome: '', email: '', senha: '' });
    const [mensagem, setMensagem] = useState('');

    useEffect(() => {
        // 🚀 Buscar dados do perfil
        const token = localStorage.getItem('token');
        api.get('/usuarios/perfil', { headers: { Authorization: token } })
            .then(response => {
                setPerfil(response.data);
                setNovoPerfil({ nome: response.data.nome, email: response.data.email, senha: '' });
            })
            .catch(error => console.error('Erro ao carregar perfil:', error));
    }, []);

    const handleChange = (e) => {
        setNovoPerfil({ ...novoPerfil, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        api.put('/usuarios/perfil', novoPerfil, { headers: { Authorization: token } })
            .then(response => setMensagem('✅ Perfil atualizado com sucesso!'))
            .catch(error => setMensagem('❌ Erro ao atualizar perfil.'));
    };

    return (
        <div className="container">
            <h2>👤 Meu Perfil</h2>
            {mensagem && <p>{mensagem}</p>}
            <form onSubmit={handleSubmit}>
                <label>Nome:</label>
                <input type="text" name="nome" value={novoPerfil.nome} onChange={handleChange} required />

                <label>Email:</label>
                <input type="email" name="email" value={novoPerfil.email} onChange={handleChange} required />

                <label>Nova Senha (opcional):</label>
                <input type="password" name="senha" value={novoPerfil.senha} onChange={handleChange} />

                <button type="submit">Salvar Alterações</button>
            </form>
        </div>
    );
};

export default Perfil;
