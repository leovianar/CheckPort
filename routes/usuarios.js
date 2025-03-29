const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');

const router = express.Router();
const SECRET_KEY = 'checkport_secret'; // Mantenha isso seguro!

// ✅ Middleware para proteger rotas (agora definido ANTES das rotas)
const autenticarToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(403).json({ erro: 'Acesso negado!' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ erro: 'Token inválido!' });

        req.usuario = decoded;
        next();
    });
};

// ✅ Rota para obter os dados do usuário logado
router.get('/perfil', autenticarToken, (req, res) => {
    const userId = req.usuario.id;

    const sql = 'SELECT id, nome, email, tipo FROM usuarios WHERE id = ?';
    db.query(sql, [userId], (err, resultados) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar perfil', detalhes: err });

        if (resultados.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado' });

        res.status(200).json(resultados[0]);
    });
});

// ✅ Rota para atualizar os dados do usuário
router.put('/perfil', autenticarToken, async (req, res) => {
    const userId = req.usuario.id;
    const { nome, email, senha } = req.body;

    let sql, valores;

    if (senha) {
        try {
            const senhaCriptografada = await bcrypt.hash(senha, 10);
            sql = 'UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?';
            valores = [nome, email, senhaCriptografada, userId];
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao criptografar senha' });
        }
    } else {
        sql = 'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?';
        valores = [nome, email, userId];
    }

    db.query(sql, valores, (err, resultado) => {
        if (err) return res.status(500).json({ erro: 'Erro ao atualizar perfil', detalhes: err });

        res.status(200).json({ mensagem: '✅ Perfil atualizado com sucesso!' });
    });
});

// ✅ Rota para registrar um novo usuário
router.post('/register', async (req, res) => {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios!' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const sql = 'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)';
    const valores = [nome, email, senhaCriptografada, tipo || 'usuario'];

    db.query(sql, valores, (err, result) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao registrar usuário', detalhes: err });
        }
        res.status(201).json({ mensagem: '✅ Usuário registrado com sucesso!' });
    });
});

// ✅ Rota para fazer login
router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'E-mail e senha são obrigatórios!' });
    }

    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(sql, [email], async (err, resultados) => {
        if (err) return res.status(500).json({ erro: 'Erro no servidor', detalhes: err });

        if (resultados.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado!' });
        }

        const usuario = resultados[0];

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'Senha incorreta!' });
        }

        const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, SECRET_KEY, { expiresIn: '2h' });

        res.json({ mensagem: '✅ Login realizado com sucesso!', token });
    });
});

module.exports = router;
