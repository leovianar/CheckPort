import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
    const [estatisticas, setEstatisticas] = useState(null);

    useEffect(() => {
        api.get('/motoristas/estatisticas')
            .then(response => setEstatisticas(response.data))
            .catch(error => console.error('Erro ao buscar estatísticas:', error));
    }, []);

    if (!estatisticas) {
        return <p>Carregando estatísticas...</p>;
    }

    const { totalMotoristas, tiposVeiculos, motoristaMaisRecente } = estatisticas;

    // Dados do gráfico de barras
    const barData = {
        labels: tiposVeiculos.map(tipo => tipo.funcao),
        datasets: [{
            label: 'Quantidade por Tipo',
            data: tiposVeiculos.map(tipo => tipo.quantidade),
            backgroundColor: ['#8db986', '#acce91', '#badb73'],
        }]
    };

    // Dados do gráfico de pizza
    const pieData = {
        labels: tiposVeiculos.map(tipo => tipo.funcao),
        datasets: [{
            data: tiposVeiculos.map(tipo => tipo.quantidade),
            backgroundColor: ['#8db986', '#acce91', '#badb73'],
        }]
    };

    return (
        <div className="container">
            <h2>📊 Painel de Estatísticas</h2>
            <p><strong>Total de Motoristas:</strong> {totalMotoristas}</p>

            {motoristaMaisRecente && (
                <p><strong>Motorista Mais Recente:</strong> {motoristaMaisRecente.nome} ({motoristaMaisRecente.placa})</p>
            )}

            <div className="chart-container">
                <h3>📊 Distribuição por Tipo</h3>
                <Bar data={barData} />

                <h3>🟢 Proporção de Tipos</h3>
                <Pie data={pieData} />
            </div>
        </div>
    );
};

export default Dashboard;
