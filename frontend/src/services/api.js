import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3003/api' // ✅ Correto! Agora funciona para usuários e motoristas
});

export default api;
