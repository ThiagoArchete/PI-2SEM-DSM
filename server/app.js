const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('../api/config/conexao');
const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(session({
    secret: 'skibidi',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.get('/registro', (req, res) => {
    res.render('registro');
});
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/home', (req,res) => {
    res.render('home')
})

async function validarUsuario(email, senha) {
    const query = 'SELECT * FROM usuarios WHERE email = ?'; 
    const [usuarios] = await db.query(query, [email]); 

    if (usuarios.length > 0) {
        const usuario = usuarios[0];  
        return usuario.senha === senha; 
    } else {
        return false; 
    }
}

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    const usuarioValido = await validarUsuario(email, senha);  

    if (usuarioValido) {
        req.session.usuario = { email };  
        res.status(200).json({ message: 'Login realizado com sucesso' });
    } else {
        res.status(401).json({ message: 'Credenciais inválidas' });
    }
});

app.post('/registro', async (req, res) => {
    const { nome, email, senha, confirmaSenha } = req.body;

    if (senha !== confirmaSenha) {
        return res.status(400).json({ message: 'As senhas não correspondem' });
    }
 
    try {
        const [result] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (result.length > 0) {
            return res.status(400).json({ message: 'E-mail já cadastrado' });
        }
        const query = 'INSERT INTO usuarios (nome_completo, email, senha) VALUES (?, ?, ?)';
        await db.query(query, [nome, email, senha]);

        res.status(200).json({ message: 'Usuário registrado com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor ao registrar o usuário' });
    }
}); 
 
app.get('/home', (req, res) => {
    if (req.session && req.session.usuario) {
        res.render('home', { usuario: req.session.usuario });
    } else {
        res.redirect('/login');
    }  
}); 

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});        