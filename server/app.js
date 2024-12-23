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
app.get('/taskflow', async (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
      
    try {
        const [quadros] = await db.query('SELECT * FROM quadros WHERE id_usuario = ?', [req.session.usuario.id_usuario]);
        const [tarefas] = await db.query('SELECT * FROM tarefas');
        res.render('taskflow', { quadros, tarefas });
        console.log(quadros);
        
    } catch (err) { 
        console.error('Erro ao carregar taskflow:', err);
        res.status(500).send('Erro ao carregar página');
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

app.get('/taskflow/tarefas/:id', async (req, res) => {
    const boardId = req.params.id;
    
    try {
        const [tasks] = await db.query('SELECT * FROM tarefas WHERE id_quadro = ?', [boardId]);

        if (tasks.length > 0) {
            res.json(tasks);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        res.status(500).json({ message: 'Erro ao buscar tarefas' });
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
        const id_usuario = usuario.id_usuario;
        if (!id_usuario) {
            return res.status(400).json({ message: 'ID do usuário não encontrado na sessão' });
        }

        console.log('Usuário logado:', usuario);
        console.log('id_usuario:', id_usuario);

        const [result] = await db.query('INSERT INTO quadros (nome, id_usuario) VALUES (?, ?)', [nome, id_usuario]);
        const id_quadro = result.insertId; 

        res.status(201).json({
            success: true,
            quadro: { id_quadro, nome }
        });
    } catch (err) {
        console.error('Erro ao adicionar quadro:', err);
        res.status(500).json({ message: 'Erro ao salvar o quadro' });
    }
});

app.post('/taskflow/tarefas', async (req, res) => {
    const { descricao, prioridade, prazo, coluna, id_quadro } = req.body;

    if (!descricao || !prioridade || !prazo || !coluna || !id_quadro) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    try {
        const query = `
            INSERT INTO tarefas (descricao, prioridade, prazo, coluna, id_quadro)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [descricao, prioridade, prazo, coluna, id_quadro]);

        res.status(201).json({
            id: result.insertId,
            descricao,
            prioridade,
            prazo,
            coluna,
            id_quadro
        });
    } catch (err) {
        console.error('Erro ao criar tarefa:', err);
        res.status(500).json({ message: 'Erro ao salvar a tarefa no banco de dados' });
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
    const { id } = req.params;
    const usuario = req.session.usuario;

    if (!usuario) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    try {
        await db.query('DELETE FROM quadros WHERE id_quadro = ? AND id_usuario = ?', [id, usuario.id_usuario]);
        res.status(200).json({ message: 'Quadro excluído com sucesso!' });
    } catch (err) {
        console.error('Erro ao excluir quadro:', err);
        res.status(500).json({ message: 'Erro ao excluir quadro' });
    }
});


app.put('/taskflow/quadros/:id', async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    const usuario = req.session.usuario;

    if (!usuario) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    if (!nome) {
        return res.status(400).json({ message: 'Nome do quadro não fornecido' });
    }

    try {
        await db.query('UPDATE quadros SET nome = ? WHERE id_quadro = ? AND id_usuario = ?', [nome, id, usuario.id_usuario]);
        res.status(200).json({ message: 'Quadro atualizado com sucesso!' });
    } catch (err) {
        console.error('Erro ao editar quadro:', err);
        res.status(500).json({ message: 'Erro ao editar quadro' });
    }
});
app.put('/taskflow/tarefas/:id', async (req, res) => {
    const { id } = req.params;
    const { description, priority, deadLine, column } = req.body;

    if (!description || !priority || !deadLine || !column) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    try {
        const [result] = await db.query(
            `UPDATE tarefas 
             SET descricao = ?, prioridade = ?, prazo = ?, coluna = ? 
             WHERE id = ?`,
            [description, priority, deadLine, column, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tarefa não encontrada!' });
        }

        const [updatedTask] = await db.query('SELECT * FROM tarefas WHERE id = ?', [id]);
        res.status(200).json(updatedTask[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar a tarefa.' });
    }
});

app.delete('/taskflow/tarefas/:id', async (req, res) => {
    const { id } = req.params; 
    const usuario = req.session.usuario; 

    if (!usuario) {
        return res.status(401).json({ message: 'Usuário não autenticado' });  
    }
 
    try {
        const [result] = await db.query('DELETE FROM tarefas WHERE id = ? AND id_quadro IN (SELECT id_quadro FROM quadros WHERE id_usuario = ?)', [id, usuario.id_usuario]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tarefa não encontrada ou não pertencente ao usuário' });
        }

        res.status(200).json({ message: 'Tarefa excluída com sucesso!' });
    } catch (err) {
        console.error('Erro ao excluir tarefa:', err);
        res.status(500).json({ message: 'Erro ao excluir tarefa' });
    }
});



app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});         