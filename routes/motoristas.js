const express = require('express');
const router = express.Router();
const db = require('../database'); // Importa a conexão com MySQL

// ✅ Rota para cadastrar um motorista
router.post('/cadastrar', (req, res) => {
    const { nome, placa, modelo, ano, funcao } = req.body;

    if (!nome || !placa || !modelo || !ano || !funcao) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios!' });
    }

    const sql = 'INSERT INTO motoristas (nome, placa, modelo, ano, funcao) VALUES (?, ?, ?, ?, ?)';
    const valores = [nome, placa, modelo, ano, funcao];

    db.query(sql, valores, (err, result) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao cadastrar motorista', detalhes: err });
        }
        res.status(201).json({ mensagem: 'Motorista cadastrado com sucesso!', id: result.insertId });
    });
});

// ✅ Rota para listar todos os motoristas
router.get('/listar', (req, res) => {
    const sql = 'SELECT * FROM motoristas';

    db.query(sql, (err, resultados) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao buscar motoristas', detalhes: err });
        }
        res.status(200).json(resultados);
    });
});

// ✅ Rota para buscar um motorista pela placa do veículo
router.get('/buscar/:placa', (req, res) => {
    const { placa } = req.params;
    const sql = 'SELECT * FROM motoristas WHERE placa = ?';

    db.query(sql, [placa], (err, resultado) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao buscar motorista', detalhes: err });
        }
        if (resultado.length === 0) {
            return res.status(404).json({ mensagem: 'Motorista não encontrado!' });
        }
        res.status(200).json(resultado[0]);
    });
});

// ✅ Rota para deletar um motorista pelo ID (CORRIGIDA)
router.delete('/deletar/:id', (req, res) => { // ✅ AGORA ESTÁ CORRETO
    const { id } = req.params;
    const sql = 'DELETE FROM motoristas WHERE id = ?';

    db.query(sql, [id], (err, resultado) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao deletar motorista', detalhes: err });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Motorista não encontrado!' });
        }
        res.status(200).json({ mensagem: '✅ Motorista deletado com sucesso!' });
    });
});

// ✅ Rota para atualizar um motorista pelo ID (CORRIGIDA)
router.put('/editar/:id', (req, res) => { // ✅ AGORA ESTÁ CORRETO
    const { id } = req.params;
    const { nome, placa, modelo, ano, funcao } = req.body;

    const sql = 'UPDATE motoristas SET nome = ?, placa = ?, modelo = ?, ano = ?, funcao = ? WHERE id = ?';
    const valores = [nome, placa, modelo, ano, funcao, id];

    db.query(sql, valores, (err, resultado) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao atualizar motorista', detalhes: err });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Motorista não encontrado!' });
        }
        res.status(200).json({ mensagem: '✅ Motorista atualizado com sucesso!' });
    });
});


// ✅ Rota para buscar estatísticas dos motoristas
router.get('/estatisticas', (req, res) => {
    const sqlTotal = 'SELECT COUNT(*) AS total FROM motoristas';
    const sqlTipos = 'SELECT funcao, COUNT(*) AS quantidade FROM motoristas GROUP BY funcao';
    const sqlMaisRecente = 'SELECT * FROM motoristas ORDER BY id DESC LIMIT 1';

    db.query(sqlTotal, (err, totalRes) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar estatísticas', detalhes: err });

        db.query(sqlTipos, (err, tiposRes) => {
            if (err) return res.status(500).json({ erro: 'Erro ao buscar tipos', detalhes: err });

            db.query(sqlMaisRecente, (err, maisRecenteRes) => {
                if (err) return res.status(500).json({ erro: 'Erro ao buscar o motorista mais recente', detalhes: err });

                res.status(200).json({
                    totalMotoristas: totalRes[0].total,
                    tiposVeiculos: tiposRes,
                    motoristaMaisRecente: maisRecenteRes[0] || null
                });
            });
        });
    });
});


module.exports = router;
