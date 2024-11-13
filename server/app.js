const express = require('express');
const path = require('path');
const db = require('../api/config/conexao');
const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.get('/registro', (req, res) => {
    res.render('registro');
});
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/registro', (req, res) => {
    const { nome, email, senha, confirmaSenha } = req.body;

    if (senha !== confirmaSenha) {
        return res.status(400).send('As senhas não correspondem');
    }

    const query = 'INSERT INTO usuarios (nome_completo, email, senha) VALUES (?, ?, ?)';
    db.query(query, [nome, email, senha], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao registrar o usuário');
        }
        res.send('Usuário registrado com sucesso!');
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});       