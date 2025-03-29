import React, { useState } from 'react';
import api from '../services/api';

const BuscarMotorista = () => {
    const [placa, setPlaca] = useState('');
    const [motorista, setMotorista] = useState(null);
    const [erro, setErro] = useState('');
    const [editando, setEditando] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        placa: '',
        modelo: '',
        ano: '',
        funcao: ''
    });

    // ✅ Função para buscar o motorista pelo número da placa
    const buscarMotorista = async () => {
        try {
            const response = await api.get(`/motoristas/buscar/${placa}`);
            setMotorista(response.data);
            setFormData(response.data); // Atualiza os dados no formulário de edição
            setErro('');
        } catch {
            setMotorista(null);
            setErro('❌ Motorista não encontrado.');
        }
    };

    // ✅ Função para excluir motorista
    const excluirMotorista = async () => {
        if (!motorista) return;

        if (window.confirm('Tem certeza que deseja excluir este motorista?')) {
            try {
                await api.delete(`/motoristas/deletar/${motorista.id}`);
                alert('🚗 Motorista excluído com sucesso!');
                setMotorista(null);
                setPlaca('');
            } catch {
                alert('❌ Erro ao excluir motorista!');
            }
        }
    };

    // ✅ Função para abrir o modal de edição
    const abrirModalEdicao = () => {
        setEditando(true);
    };

    // ✅ Função para fechar o modal de edição
    const fecharModalEdicao = () => {
        setEditando(false);
    };

    // ✅ Função para atualizar os dados do motorista
    const atualizarMotorista = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/motoristas/editar/${motorista.id}`, formData);
            alert('✅ Motorista atualizado com sucesso!');
            setMotorista(formData); // Atualiza os dados na tela
            fecharModalEdicao();
        } catch {
            alert('❌ Erro ao atualizar motorista!');
        }
    };

    return (
        <div className="container">
            <h2>🔍 Buscar Motorista</h2>
            <input
                type="text"
                placeholder="Digite a placa"
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
            />
            <button onClick={buscarMotorista}>Buscar</button>

            {motorista && (
                <div className="resultado-busca">
                    <h3>🚗 <strong>{motorista.nome}</strong></h3>
                    <p><strong>Placa:</strong> {motorista.placa}</p>
                    <p><strong>Modelo:</strong> {motorista.modelo} ({motorista.ano})</p>
                    <p><strong>Função:</strong> {motorista.funcao}</p>

                    {/* Botões de Editar e Excluir */}
                    <div className="botoes-acoes">
                        <button className="btn-editar" onClick={abrirModalEdicao}>✏️ Editar</button>
                        <button className="btn-excluir" onClick={excluirMotorista}>🗑️ Excluir</button>
                    </div>
                </div>
            )}

            {erro && <p>{erro}</p>}

            {/* ✅ Modal de Edição */}
            {editando && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>✏️ Editar Motorista</h2>
                        <form onSubmit={atualizarMotorista}>
                            <input type="text" name="nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
                            <input type="text" name="placa" value={formData.placa} onChange={(e) => setFormData({ ...formData, placa: e.target.value })} required />
                            <input type="text" name="modelo" value={formData.modelo} onChange={(e) => setFormData({ ...formData, modelo: e.target.value })} required />
                            <input type="number" name="ano" value={formData.ano} onChange={(e) => setFormData({ ...formData, ano: e.target.value })} required />
                            <input type="text" name="funcao" value={formData.funcao} onChange={(e) => setFormData({ ...formData, funcao: e.target.value })} required />
                            <button type="submit">💾 Salvar</button>
                            <button type="button" className="btn-cancelar" onClick={fecharModalEdicao}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuscarMotorista;
