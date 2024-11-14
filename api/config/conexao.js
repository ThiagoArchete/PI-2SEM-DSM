const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'banco_dados',
});

(async () => {
    try {
        const connection = await db.getConnection();
        console.log('Conectado com sucesso com o pool!');
        connection.release(); 
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    }
})();

(async () => {
    try {
        const [results] = await db.query('SELECT * FROM usuarios');
        console.log(results);
    } catch (err) {
        console.error('Erro ao executar a consulta:', err);
    }
})();

module.exports = db;