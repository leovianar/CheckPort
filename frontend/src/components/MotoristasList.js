import React, { useState, useEffect } from 'react';
import api from '../services/api';

const MotoristasList = () => {
    const [motoristas, setMotoristas] = useState([]);

    useEffect(() => {
        api.get('/motoristas/listar')
            .then(response => setMotoristas(response.data))
            .catch(error => console.error('Erro ao buscar motoristas:', error));
    }, []);

    return (
        <div className="container">
            <h2>Lista de Motoristas</h2>
            {motoristas.length === 0 ? (
                <p>Nenhum motorista cadastrado ainda.</p>
            ) : (
                <ul>
                    {motoristas.map(motorista => (
                        <li key={motorista.id} className="motorista-card">
                            <span><strong>{motorista.nome}</strong> - {motorista.placa}</span>
                            <span>{motorista.modelo} ({motorista.ano})</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MotoristasList;
