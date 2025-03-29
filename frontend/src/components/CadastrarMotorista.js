import React, { useState } from 'react';
import api from '../services/api';

const CadastrarMotorista = () => {
    const [formData, setFormData] = useState({
        nome: '',
        placa: '',
        modelo: '',
        ano: '',
        funcao: ''
    });
    const [mensagem, setMensagem] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post('/motoristas/cadastrar', formData)
            .then(() => setMensagem('✅ Motorista cadastrado com sucesso!'))
            .catch(() => setMensagem('❌ Erro ao cadastrar motorista!'));
    };

    return (
        <div className="container">
            <h2>Cadastrar Motorista</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="nome" placeholder="Nome" onChange={handleChange} required />
                <input type="text" name="placa" placeholder="Placa" onChange={handleChange} required />
                <input type="text" name="modelo" placeholder="Modelo" onChange={handleChange} required />
                <input type="number" name="ano" placeholder="Ano" onChange={handleChange} required />
                <input type="text" name="funcao" placeholder="Função" onChange={handleChange} required />
                <button type="submit">Cadastrar</button>
            </form>
            {mensagem && <p>{mensagem}</p>}
        </div>
    );
};

export default CadastrarMotorista;
