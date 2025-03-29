import React from 'react';

const Home = () => {
    return (
        <div className="container">
            <h2>🚗 Bem-vindo ao CheckPort</h2>
            <p>O sistema ideal para controle de entrada de veículos.</p>

            <div className="info-cards">
                <div className="card">
                    <h3>🔍 Buscar Motorista</h3>
                    <p>Encontre motoristas rapidamente pelo número da placa.</p>
                </div>
                <div className="card">
                    <h3>📋 Listagem Completa</h3>
                    <p>Visualize todos os motoristas cadastrados.</p>
                </div>
                <div className="card">
                    <h3>➕ Cadastro Rápido</h3>
                    <p>Adicione novos motoristas de forma simples e rápida.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
