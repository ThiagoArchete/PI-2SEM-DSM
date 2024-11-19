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

app.get('/registro', (req, res) => {
    res.render('registro');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/taskflow', (req, res) => {
    if (req.session && req.session.usuario) {
        res.render('taskflow', { usuario: req.session.usuario });
    } else {
        res.redirect('/login');
    }
});  
 
app.get('/home', (req,res) => {
    res.render('home');
}) 

app.get('/taskflow/quadros', async (req, res) => {
    const usuario = req.session.usuario; 
    
    if (!usuario) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    try {
        const [quadros] = await db.query('SELECT id_quadro, nome FROM quadros WHERE id_usuario = ?', [usuario.id_usuario]);
        res.json(quadros);
    } catch (err) {
        console.error('Erro ao buscar quadros:', err);
        res.status(500).json({ message: 'Erro ao buscar quadros' });
    }
});


app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    const usuarioValido = await validarUsuario(email, senha);  
    
    if (usuarioValido) {
        const [usuarios] = await db.query('SELECT id_usuario, email FROM usuarios WHERE email = ?', [email]);
        req.session.usuario = usuarios[0];
        console.log('Usuário logado:', usuarios[0]);  
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
app.post('/taskflow/quadros', async (req, res) => {
    const { nome } = req.body;
    const usuario = req.session.usuario; 
    if (!usuario) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    if (!nome) {
        return res.status(400).json({ message: 'Nome do quadro não fornecido' });
    }

    try {
        const [usuarios] = await db.query('SELECT id_usuario FROM usuarios WHERE email = ?', [usuario.email]);
        if (usuarios.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const id_usuario = usuarios[0].id_usuario;
        console.log('Usuário logado:', usuario);
        console.log('id_usuario:', id_usuario);

        const query = 'INSERT INTO quadros (nome, id_usuario) VALUES (?, ?)';
        await db.query(query, [nome, id_usuario]);

        res.status(201).json({ message: 'Quadro criado com sucesso!' });
    } catch (err) {
        console.error('Erro ao adicionar quadro:', err);
        res.status(500).json({ message: 'Erro ao salvar o quadro' });
    }
});



app.get('/home', (req, res) => {
    if (req.session && req.session.usuario) {
        res.render('home', { usuario: req.session.usuario });
    } else {
        res.redirect('/login');
    }  
}); 

app.delete('/taskflow/quadros/:id', async (req, res) => {
    const boardId = req.params.id; 
    const usuario = req.session.usuario;

    if (!usuario) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    try {
        const query = 'DELETE FROM quadros WHERE id_quadro = ? AND id_usuario = ?';
        const [result] = await db.query(query, [boardId, usuario.id_usuario]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Quadro excluído com sucesso' });
        } else {
            res.status(404).json({ message: 'Quadro não encontrado ou não pertence a este usuário' });
        }
    } catch (err) {
        console.error('Erro ao excluir quadro:', err);
        res.status(500).json({ message: 'Erro ao excluir quadro' });
    }
});
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});         