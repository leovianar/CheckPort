const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./database'); // Conexão com MySQL
const motoristasRoutes = require('./routes/motoristas'); // ✅ Importa as rotas
const usuariosRoutes = require('./routes/usuarios'); // ✅ Importa rotas de usuários

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json()); // ✅ Middleware JSON deve vir antes das rotas!

// ✅ Assegure-se de que as rotas são carregadas na ordem correta
app.use('/api/usuarios', usuariosRoutes);
console.log("✅ Rota de usuários carregada!");

app.use('/api/motoristas', motoristasRoutes);

app.get('/', (req, res) => {
    res.send('🚀 Servidor do CheckPort rodando com sucesso!');
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
